import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import MatchLiveIndicators from "./MatchLiveIndicators";
import { svgToPng } from "../../../converter/svg-png-converter/svg-png-converter";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("open-football-project-core", async () => {
  const actual = await vi.importActual<typeof import("open-football-project-core")>(
    "open-football-project-core",
  );
  return {
    ...actual,
    useLiveIndicators: vi.fn(),
    buildLiveIndicatorsDonutsSvgString: vi.fn().mockReturnValue("<svg></svg>"),
    LIVE_MATCH_DONUTS_SVG_W: 540,
    LIVE_MATCH_DONUTS_SVG_H: 200,
  };
});

vi.mock("./pie-chart/LiveMatchPieChart", () => ({
  LiveMatchPieChart: ({ indicator, homeTeamName, awayTeamName }: any) => (
    <div data-testid="live-match-pie-chart">
      {indicator.label}-{homeTeamName}-{awayTeamName}
    </div>
  ),
}));

vi.mock("react-icons/fa6", () => ({
  FaXTwitter: () => <svg data-testid="x-icon" />,
}));

vi.mock("../../../converter/svg-png-converter/svg-png-converter", () => ({
  svgToPng: vi.fn(),
}));

import {
  useLiveIndicators,
  TwoTeamsStatistics,
  buildLiveIndicatorsDonutsSvgString,
} from "open-football-project-core";

const mockStats = {} as TwoTeamsStatistics;

const mockIndicators = {
  hasData: true,
  momentum: {
    emoji: "⚡",
    label: "indicators.momentum",
    homePercent: 65,
    awayPercent: 35,
  },
  control: {
    emoji: "🎮",
    label: "indicators.match_control",
    homePercent: 60,
    awayPercent: 40,
  },
  goalThreat: {
    emoji: "🎯",
    label: "indicators.goal_threat",
    homePercent: 72,
    awayPercent: 28,
  },
};

describe("MatchLiveIndicators", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders three pie charts even when there is no data", () => {
    (useLiveIndicators as Mock).mockReturnValue({
      ...mockIndicators,
      hasData: false,
    });

    render(
      <MatchLiveIndicators
        liveStats={mockStats}
        homeTeamName="Arsenal"
        awayTeamName="Chelsea"
      />,
    );

    expect(screen.getAllByTestId("live-match-pie-chart")).toHaveLength(3);
  });

  it("disables the share button when there is no data", () => {
    (useLiveIndicators as Mock).mockReturnValue({
      ...mockIndicators,
      hasData: false,
    });

    render(
      <MatchLiveIndicators
        liveStats={mockStats}
        homeTeamName="Arsenal"
        awayTeamName="Chelsea"
      />,
    );

    expect(
      screen.getByRole("button", { name: /indicators\.share_on_x/i }),
    ).toBeDisabled();
  });

  it("renders three pie charts when data is available", () => {
    (useLiveIndicators as Mock).mockReturnValue(mockIndicators);

    render(
      <MatchLiveIndicators
        liveStats={mockStats}
        homeTeamName="Arsenal"
        awayTeamName="Chelsea"
      />,
    );

    expect(screen.getAllByTestId("live-match-pie-chart")).toHaveLength(3);
  });

  it("passes home and away team names to each pie chart", () => {
    (useLiveIndicators as Mock).mockReturnValue(mockIndicators);

    render(
      <MatchLiveIndicators
        liveStats={mockStats}
        homeTeamName="Arsenal"
        awayTeamName="Chelsea"
      />,
    );

    const charts = screen.getAllByTestId("live-match-pie-chart");
    charts.forEach((chart) => {
      expect(chart.textContent).toContain("Arsenal");
      expect(chart.textContent).toContain("Chelsea");
    });
  });

  it("renders the Share on X button", () => {
    (useLiveIndicators as Mock).mockReturnValue(mockIndicators);

    render(
      <MatchLiveIndicators
        liveStats={mockStats}
        homeTeamName="Arsenal"
        awayTeamName="Chelsea"
      />,
    );

    expect(
      screen.getByRole("button", { name: /indicators\.share_on_x/i }),
    ).toBeInTheDocument();
  });

  it("opens a twitter share URL when the share button is clicked", async () => {
    (useLiveIndicators as Mock).mockReturnValue(mockIndicators);
    const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);

    render(
      <MatchLiveIndicators
        liveStats={mockStats}
        homeTeamName="Arsenal"
        awayTeamName="Chelsea"
      />,
    );

    await userEvent.click(
      screen.getByRole("button", { name: /indicators\.share_on_x/i }),
    );

    expect(openSpy).toHaveBeenCalledWith(
      expect.stringContaining("twitter.com/intent/tweet"),
      "_blank",
      "noopener,noreferrer",
    );

    openSpy.mockRestore();
  });

  it("includes team names in the share URL", async () => {
    (useLiveIndicators as Mock).mockReturnValue(mockIndicators);
    const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);

    render(
      <MatchLiveIndicators
        liveStats={mockStats}
        homeTeamName="Arsenal"
        awayTeamName="Chelsea"
      />,
    );

    await userEvent.click(
      screen.getByRole("button", { name: /indicators\.share_on_x/i }),
    );

    const calledUrl = openSpy.mock.calls[0][0] as string;
    const decodedText = decodeURIComponent(calledUrl.split("text=")[1]);
    expect(decodedText).toContain("Arsenal");
    expect(decodedText).toContain("Chelsea");

    openSpy.mockRestore();
  });

  it("renders the download PNG button", () => {
    (useLiveIndicators as Mock).mockReturnValue(mockIndicators);

    render(
      <MatchLiveIndicators
        liveStats={mockStats}
        homeTeamName="Arsenal"
        awayTeamName="Chelsea"
      />,
    );

    expect(
      screen.getByRole("button", { name: /indicators\.download_png/i }),
    ).toBeTruthy();
  });

  it("disables the download button when there is no data", () => {
    (useLiveIndicators as Mock).mockReturnValue({
      ...mockIndicators,
      hasData: false,
    });

    render(
      <MatchLiveIndicators
        liveStats={mockStats}
        homeTeamName="Arsenal"
        awayTeamName="Chelsea"
      />,
    );

    const btn = screen.getByRole("button", {
      name: /indicators\.download_png/i,
    });
    expect((btn as HTMLButtonElement).disabled).toBe(true);
  });

  it("calls buildLiveIndicatorsSvgString and svgToPng when download is clicked", async () => {
    (useLiveIndicators as Mock).mockReturnValue(mockIndicators);
    vi.mocked(svgToPng).mockResolvedValue(undefined);

    render(
      <MatchLiveIndicators
        liveStats={mockStats}
        homeTeamName="Arsenal"
        awayTeamName="Chelsea"
      />,
    );

    await userEvent.click(
      screen.getByRole("button", { name: /indicators\.download_png/i }),
    );

    await waitFor(() =>
      expect(buildLiveIndicatorsDonutsSvgString).toHaveBeenCalled(),
    );
    await waitFor(() =>
      expect(svgToPng).toHaveBeenCalledWith(
        expect.any(Object),
        "arsenal-vs-chelsea-live.png",
        540,
        200,
      ),
    );
  });

  it("shows '…' while downloading then restores label", async () => {
    (useLiveIndicators as Mock).mockReturnValue(mockIndicators);
    let resolvePng!: () => void;
    vi.mocked(svgToPng).mockReturnValue(
      new Promise<void>((r) => {
        resolvePng = r;
      }),
    );

    render(
      <MatchLiveIndicators
        liveStats={mockStats}
        homeTeamName="Arsenal"
        awayTeamName="Chelsea"
      />,
    );

    await userEvent.click(
      screen.getByRole("button", { name: /indicators\.download_png/i }),
    );

    await waitFor(() =>
      expect(screen.getByRole("button", { name: "…" })).toBeTruthy(),
    );

    resolvePng();

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /indicators\.download_png/i }),
      ).toBeTruthy(),
    );
  });
});
