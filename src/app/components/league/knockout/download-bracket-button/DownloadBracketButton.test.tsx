import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DownloadBracketButton from "./DownloadBracketButton";
import { collectRounds, buildBracketSvgString, BracketNode, RoundLayout } from "@matchinsights/core";
import { svgToPng } from "../../../../converter/svg-png-converter/svg-png-converter";

vi.mock("@matchinsights/core", async () => {
  const actual = await vi.importActual<typeof import("@matchinsights/core")>("@matchinsights/core");
  return {
    ...actual,
    collectRounds: vi.fn(),
    buildBracketSvgString: vi.fn(),
  };
});

vi.mock("../../../../converter/svg-png-converter/svg-png-converter", () => ({
  svgToPng: vi.fn(),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string, opts?: { defaultValue?: string }) => opts?.defaultValue ?? key }),
}));

const fakeRoot = { roundKey: "final", tie: null, missingData: false } as unknown as BracketNode;

describe("DownloadBracketButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    const fakeRounds: RoundLayout[] = [{ key: "final", nodes: [fakeRoot] }];
    vi.mocked(collectRounds).mockReturnValue(fakeRounds);
    vi.mocked(buildBracketSvgString).mockReturnValue("<svg><rect width='10' height='10'/></svg>");
    vi.mocked(svgToPng).mockResolvedValue(undefined);
  });

  it("renders a disabled button when there is no bracket data", () => {
    render(<DownloadBracketButton root={null} leagueName="Champions League" />);
    expect(screen.getByRole("button", { name: /download png/i })).toBeDisabled();
  });

  it("renders an enabled button when bracket data is present", () => {
    render(<DownloadBracketButton root={fakeRoot} leagueName="Champions League" />);
    expect(screen.getByRole("button", { name: /download png/i })).not.toBeDisabled();
  });

  it("does not call svgToPng when root is null", async () => {
    render(<DownloadBracketButton root={null} leagueName="Champions League" />);
    fireEvent.click(screen.getByRole("button"));
    await Promise.resolve();
    expect(svgToPng).not.toHaveBeenCalled();
  });

  it("builds the SVG with showScores enabled when clicked", async () => {
    render(<DownloadBracketButton root={fakeRoot} leagueName="Champions League" />);
    fireEvent.click(screen.getByRole("button"));

    await waitFor(() =>
      expect(buildBracketSvgString).toHaveBeenCalledWith(
        expect.any(Array),
        expect.any(Number),
        expect.any(Number),
        "Champions League",
        expect.any(Function),
        true,
      )
    );
  });

  it("calls svgToPng with a results-oriented, slugified filename when clicked", async () => {
    render(<DownloadBracketButton root={fakeRoot} leagueName="Champions League" />);
    fireEvent.click(screen.getByRole("button"));

    await waitFor(() =>
      expect(svgToPng).toHaveBeenCalledWith(
        expect.any(SVGElement),
        "champions-league-knockout-bracket-results.png",
        expect.any(Number),
        expect.any(Number),
      )
    );
  });

  it("disables the button while svgToPng is in progress, then re-enables it", async () => {
    let resolvePng!: () => void;
    vi.mocked(svgToPng).mockReturnValue(new Promise<void>((r) => { resolvePng = r; }));

    render(<DownloadBracketButton root={fakeRoot} leagueName="Champions League" />);
    const button = screen.getByRole("button");

    fireEvent.click(button);
    await waitFor(() => expect(button).toBeDisabled());

    resolvePng();
    await waitFor(() => expect(button).not.toBeDisabled());
  });
});
