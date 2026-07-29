import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import LeagueStanding from "./LeagueStanding";
import { mockLeagueInfo } from "@matchinsights/core";
import { svgToPng } from "../../../converter/svg-png-converter/svg-png-converter";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, opts?: any) => opts?.defaultValue ?? key,
    i18n: { language: "en" },
  }),
}));

vi.mock("../../../converter/svg-png-converter/svg-png-converter", () => ({
  svgToPng: vi.fn(),
}));

vi.mock("../league-table/LeagueTable", () => ({
  LeagueTable: ({ teams }: { teams: any[] }) => (
    <ul>
      {teams.map((t) => (
        <li key={t.teamId}>{t.teamName}</li>
      ))}
    </ul>
  ),
}));

const downloadButton = () => screen.getByRole("button", { name: /download/i });
const shareButton = () => screen.getByRole("button", { name: /share/i });

describe("LeagueStanding – share on X", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("open", vi.fn());
  });

  it("renders a Share button", () => {
    render(<LeagueStanding leagueInfo={mockLeagueInfo} loading={false} />);
    expect(shareButton()).toBeInTheDocument();
  });

  it("opens a twitter intent URL when Share is clicked", () => {
    render(<LeagueStanding leagueInfo={mockLeagueInfo} loading={false} />);
    fireEvent.click(shareButton());
    expect(window.open).toHaveBeenCalledWith(
      expect.stringContaining("twitter.com/intent/tweet"),
      "_blank",
      "noopener,noreferrer",
    );
  });
});

describe("LeagueStanding – download", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(svgToPng).mockResolvedValue(undefined);
  });

  it("renders a Download button", () => {
    render(<LeagueStanding leagueInfo={mockLeagueInfo} loading={false} />);
    expect(downloadButton()).toBeInTheDocument();
  });

  it("calls svgToPng with the correct filename on click", async () => {
    render(<LeagueStanding leagueInfo={mockLeagueInfo} loading={false} />);
    fireEvent.click(downloadButton());

    await waitFor(() =>
      expect(svgToPng).toHaveBeenCalledWith(
        expect.any(Object),
        "futballero-premier-lg.-standings.png",
        expect.any(Number),
        expect.any(Number),
      ),
    );
  });

  it("includes the active group label in the filename when multi-group", async () => {
    render(<LeagueStanding leagueInfo={mockLeagueInfo} loading={false} />);

    fireEvent.click(screen.getByTestId("button-right"));
    fireEvent.click(downloadButton());

    await waitFor(() =>
      expect(svgToPng).toHaveBeenCalledWith(
        expect.any(Object),
        "futballero-premier-lg.-standings.png",
        expect.any(Number),
        expect.any(Number),
      ),
    );
  });
});

describe("LeagueStanding", () => {
  it("renders loading state", () => {
    const { container } = render(
      <LeagueStanding leagueInfo={null} loading={true} />,
    );
    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  it("renders no league info state", () => {
    render(<LeagueStanding leagueInfo={null} loading={false} />);
    expect(screen.getByText(/nodata.default/i)).toBeInTheDocument();
  });

  it("renders teams from first group", () => {
    render(<LeagueStanding leagueInfo={mockLeagueInfo} loading={false} />);
    expect(
      screen.getByText(mockLeagueInfo.group[0].teams[0].teamName),
    ).toBeInTheDocument();
  });

  it("navigates between groups with arrows", () => {
    render(<LeagueStanding leagueInfo={mockLeagueInfo} loading={false} />);

    expect(
      screen.getByText(mockLeagueInfo.group[0].teams[0].teamName),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("button-right"));
    expect(
      screen.getByText(mockLeagueInfo.group[1].teams[0].teamName),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("button-left"));
    expect(
      screen.getByText(mockLeagueInfo.group[0].teams[0].teamName),
    ).toBeInTheDocument();
  });

  it("selects another group from the dropdown", () => {
    render(<LeagueStanding leagueInfo={mockLeagueInfo} loading={false} />);

    const groupSelect = screen.getByTestId("drop-down-btn");
    fireEvent.change(groupSelect, { target: { value: "1" } });

    expect(
      screen.getByText(mockLeagueInfo.group[1].teams[0].teamName),
    ).toBeInTheDocument();
  });
});
