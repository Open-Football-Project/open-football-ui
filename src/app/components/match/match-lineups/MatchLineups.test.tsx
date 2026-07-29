import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import MatchLineups from "./MatchLineups";
import { mockLineups, buildMatchLineupsSvgString } from "@matchinsights/core";
import { svgToPng } from "../../../converter/svg-png-converter/svg-png-converter";

vi.mock("../../general/logo/Logo", () => ({
  default: ({ src }: { src: string }) => (
    <img data-testid="logo" src={src} alt="team-logo" />
  ),
}));

vi.mock("../../general/no-data/NoData", () => ({
  default: () => <div data-testid="no-data">No Data</div>,
}));

vi.mock("@matchinsights/core", async () => {
  const actual = await vi.importActual("@matchinsights/core");
  return {
    ...actual,
    buildMatchLineupsSvgString: vi.fn().mockReturnValue("<svg>mock</svg>"),
  };
});

vi.mock("../../../converter/svg-png-converter/svg-png-converter", () => ({
  svgToPng: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (_key: string, opts?: { defaultValue?: string }) => opts?.defaultValue ?? _key,
  }),
}));

describe("MatchLineups download", () => {
  let mockSvgEl: SVGSVGElement;

  beforeEach(() => {
    mockSvgEl = document.createElementNS("http://www.w3.org/2000/svg", "svg") as SVGSVGElement;
    vi.stubGlobal(
      "DOMParser",
      class {
        parseFromString() {
          return { documentElement: mockSvgEl };
        }
      },
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("renders the download button", () => {
    render(<MatchLineups lineups={mockLineups} />);
    expect(screen.getByRole("button", { name: "Download" })).toBeInTheDocument();
  });

  it("calls buildMatchLineupsSvgString with both teams on click", async () => {
    render(<MatchLineups lineups={mockLineups} />);
    await userEvent.click(screen.getByRole("button", { name: "Download" }));

    expect(vi.mocked(buildMatchLineupsSvgString)).toHaveBeenCalledOnce();
    expect(vi.mocked(buildMatchLineupsSvgString)).toHaveBeenCalledWith(
      mockLineups.teamA,
      mockLineups.teamB,
      expect.any(Function),
      expect.any(Function),
      expect.any(Function),
    );
  });

  it("calls svgToPng with the parsed SVG element, correct filename and dimensions", async () => {
    render(<MatchLineups lineups={mockLineups} />);
    await userEvent.click(screen.getByRole("button", { name: "Download" }));

    await waitFor(() => {
      expect(vi.mocked(svgToPng)).toHaveBeenCalledWith(
        mockSvgEl,
        "arsenal-vs-chelsea-lineups.png",
        540,
        740,
      );
    });
  });

  it("disables the button while downloading", async () => {
    let resolveDownload!: () => void;
    vi.mocked(svgToPng).mockReturnValue(
      new Promise<void>((res) => {
        resolveDownload = res;
      }),
    );

    render(<MatchLineups lineups={mockLineups} />);
    const button = screen.getByRole("button", { name: "Download" });

    await userEvent.click(button);
    expect(button).toBeDisabled();

    resolveDownload();
    await waitFor(() => expect(button).not.toBeDisabled());
  });

  it("re-enables the button after download completes", async () => {
    render(<MatchLineups lineups={mockLineups} />);
    const button = screen.getByRole("button", { name: "Download" });

    await userEvent.click(button);
    await waitFor(() => expect(button).not.toBeDisabled());
  });

  it("does not trigger a second download while one is in progress", async () => {
    let resolveDownload!: () => void;
    vi.mocked(svgToPng).mockReturnValue(
      new Promise<void>((res) => {
        resolveDownload = res;
      }),
    );

    render(<MatchLineups lineups={mockLineups} />);
    await userEvent.click(screen.getByRole("button", { name: "Download" }));

    // button is disabled — second click is a no-op
    await userEvent.click(screen.getByRole("button", { name: /…/ }));

    resolveDownload();
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Download" })).not.toBeDisabled(),
    );
    expect(vi.mocked(buildMatchLineupsSvgString)).toHaveBeenCalledTimes(1);
  });
});

describe("MatchLineups Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders NoData when lineups are empty", () => {
    render(
      <MatchLineups
        lineups={{ teamA: { lineup: [] }, teamB: { lineup: [] } }}
      />
    );
    expect(screen.getByTestId("no-data")).toBeInTheDocument();
  });

  it("renders both teams and substitutes when lineups exist", () => {
    render(<MatchLineups lineups={mockLineups} />);

    expect(
      screen.getByText(mockLineups.teamA?.teamName ?? "")
    ).toBeInTheDocument();
    expect(
      screen.getByText(mockLineups.teamB?.teamName ?? "")
    ).toBeInTheDocument();

    expect(
      screen.getByText(mockLineups.teamA?.teamFormation ?? "")
    ).toBeInTheDocument();
    expect(
      screen.getByText(mockLineups.teamB?.teamFormation ?? "")
    ).toBeInTheDocument();

    expect(screen.getAllByText("lineups.substitutes").length).toBe(2);

    mockLineups.teamA?.lineup.forEach((p) => {
      expect(screen.getByText(p.name)).toBeInTheDocument();
    });

    mockLineups.teamB?.lineup.forEach((p) => {
      expect(screen.getByText(p.name)).toBeInTheDocument();
    });
  });
});
