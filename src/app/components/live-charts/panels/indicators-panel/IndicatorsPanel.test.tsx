import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import IndicatorsPanel from "./IndicatorsPanel";
import { ChartPanel, ChartPanelType } from "@matchinsights/core";
import { ODDS_CHART_COLORS } from "../constants";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, opts?: { defaultValue?: string }) =>
      opts?.defaultValue ?? key,
  }),
}));

vi.mock("../../charts/momentum-oscillator/MomentumOscillator", () => ({
  MomentumOscillatorChart: ({
    points,
    homeTeamName,
    awayTeamName,
  }: {
    points: unknown[];
    homeTeamName: string;
    awayTeamName: string;
  }) => (
    <div data-testid="momentum-oscillator-chart">
      {homeTeamName}-{awayTeamName}-{points.length}
    </div>
  ),
}));

vi.mock("../../charts/percentage-chart/PercentageChart", () => ({
  PercentageChart: ({
    points,
    homeTeamName,
    awayTeamName,
    brand,
  }: {
    points: unknown[];
    homeTeamName: string;
    awayTeamName: string;
    brand: { home: string; away: string };
  }) => (
    <div data-testid="percentage-chart">
      {homeTeamName}-{awayTeamName}-{points.length}-{brand.home}-{brand.away}
    </div>
  ),
}));

vi.mock("../../charts/odds/OddsChart", () => ({
  OddsChart: ({
    lines,
    colors,
  }: {
    lines: { label: string }[];
    colors: string[];
  }) => (
    <div data-testid="odds-chart">
      {lines.length}-{colors.length}
    </div>
  ),
}));

const momentumPanel: ChartPanel = {
  type: ChartPanelType.Momentum,
  points: [{ minute: 5, value: 20, capturedAt: "2026-06-24T15:05:00Z" }],
  homeTeamName: "Arsenal",
  awayTeamName: "Chelsea",
};

const controlPanel: ChartPanel = {
  type: ChartPanelType.Control,
  points: [{ minute: 5, value: 60, capturedAt: "2026-06-24T15:05:00Z" }],
  homeTeamName: "Arsenal",
  awayTeamName: "Chelsea",
};

const goalThreatPanel: ChartPanel = {
  type: ChartPanelType.GoalThreat,
  points: [{ minute: 5, value: 70, capturedAt: "2026-06-24T15:05:00Z" }],
  homeTeamName: "Arsenal",
  awayTeamName: "Chelsea",
};

const oddsPanel: ChartPanel = {
  type: ChartPanelType.Odds,
  points: [],
  homeTeamName: "Arsenal",
  awayTeamName: "Chelsea",
  id: 501,
  title: "fulltime_result",
  lines: [
    { label: "Home", points: [{ minute: 5, odd: "1.50", capturedAt: "2026-06-24T15:05:00Z" }] },
    { label: "Draw", points: [{ minute: 5, odd: "3.20", capturedAt: "2026-06-24T15:05:00Z" }] },
  ],
};

describe("IndicatorsPanel", () => {
  it("renders the localized title for a Momentum panel", () => {
    render(<IndicatorsPanel panel={momentumPanel} />);

    expect(screen.getByText("Live Momentum")).toBeInTheDocument();
  });

  it("renders MomentumOscillatorChart with the panel's data for a Momentum panel", () => {
    render(<IndicatorsPanel panel={momentumPanel} />);

    expect(screen.getByTestId("momentum-oscillator-chart")).toHaveTextContent(
      "Arsenal-Chelsea-1",
    );
  });

  it("renders the localized title for a Control panel", () => {
    render(<IndicatorsPanel panel={controlPanel} />);

    expect(screen.getByText("Live Control")).toBeInTheDocument();
  });

  it("renders PercentageChart with the panel's data, using the dedicated percentage-chart colors", () => {
    render(<IndicatorsPanel panel={controlPanel} />);

    expect(screen.getByTestId("percentage-chart")).toHaveTextContent(
      "Arsenal-Chelsea-1-#f97316-#ffc61a",
    );
  });

  it("renders the localized title for a Goal Threat panel", () => {
    render(<IndicatorsPanel panel={goalThreatPanel} />);

    expect(screen.getByText("Live Goal Threat")).toBeInTheDocument();
  });

  it("renders PercentageChart with the panel's data for a Goal Threat panel, using the dedicated percentage-chart colors", () => {
    render(<IndicatorsPanel panel={goalThreatPanel} />);

    expect(screen.getByTestId("percentage-chart")).toHaveTextContent(
      "Arsenal-Chelsea-1-#f97316-#ffc61a",
    );
  });

  it("renders the localized title for an Odds panel, falling back to the raw market name", () => {
    render(<IndicatorsPanel panel={oddsPanel} />);

    expect(screen.getByText("fulltime_result")).toBeInTheDocument();
  });

  it("renders OddsChart with the panel's lines and the shared odds color palette", () => {
    render(<IndicatorsPanel panel={oddsPanel} />);

    expect(screen.getByTestId("odds-chart")).toHaveTextContent(
      `2-${ODDS_CHART_COLORS.length}`,
    );
  });
});
