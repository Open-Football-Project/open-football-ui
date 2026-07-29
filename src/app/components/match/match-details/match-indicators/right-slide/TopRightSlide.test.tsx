/// <reference types="@testing-library/jest-dom" />
/// <reference types="vitest/globals" />
import { render, screen } from "@testing-library/react";
import { TopRightSlide } from "./TopRightSlide";
import { vi } from "vitest";
import { IndicatorResult } from "@matchinsights/core";

vi.mock("../../quick-info/odds-winner-feeling/OddsWinnerFeeling", () => ({
  default: vi.fn(({ loading, homeTeam, awayTeam }) => (
    <div data-testid="winner-feeling">
      {loading
        ? "loading winner feeling..."
        : `Rendered winner feeling for ${homeTeam} vs ${awayTeam}`}
    </div>
  )),
}));

vi.mock("../../../../general/tiny-card/TinyCard", () => ({
  default: vi.fn(({ title, cardId, sections }) => (
    <div data-testid={cardId}>
      <h3>{title}</h3>
      {sections.map((s: any, i: number) => (
        <div key={i}>
          {s.label && <span>{s.label}</span>}
          {s.component}
        </div>
      ))}
    </div>
  )),
}));

vi.mock("../../../live-indicators/pie-chart/LiveMatchPieChart", () => ({
  LiveMatchPieChart: vi.fn(({ indicator }) => (
    <div data-testid="h2h-pie-chart">{indicator.label}</div>
  )),
}));

const mockH2HIndicator: IndicatorResult = {
  emoji: "⚔️",
  label: "indicators.h2h_history",
  homePercent: 60,
  awayPercent: 40,
};

describe("TopRightSlide", () => {
  const baseProps = {
    homeTeam: "Liverpool",
    awayTeam: "Manchester City",
    isOddsFeelingAvailable: true,
    loadingOddsFeeling: false,
    oddsFeeling: { home: "1.80", draw: "3.50", away: "4.20" },
  };

  it("renders OddsWinnerFeelingComponent with proper data", () => {
    render(<TopRightSlide {...baseProps} />);
    expect(
      screen.getByText(
        "Rendered winner feeling for Liverpool vs Manchester City"
      )
    ).toBeInTheDocument();
  });

  it("shows loading state for odds when loading prop is true", () => {
    render(<TopRightSlide {...baseProps} loadingOddsFeeling={true} />);
    expect(screen.getByText("loading winner feeling...")).toBeInTheDocument();
  });

  it("does not render winner feeling when not available", () => {
    render(<TopRightSlide {...baseProps} isOddsFeelingAvailable={false} />);
    expect(screen.queryByTestId("winner-feeling")).not.toBeInTheDocument();
  });

  it("renders H2H pie chart card when isH2HAvailable is true", () => {
    render(
      <TopRightSlide
        {...baseProps}
        h2hIndicator={mockH2HIndicator}
        isH2HAvailable={true}
      />
    );
    expect(screen.getByTestId("h2h-pie-chart")).toBeInTheDocument();
  });

  it("does not render H2H card when isH2HAvailable is false", () => {
    render(
      <TopRightSlide
        {...baseProps}
        h2hIndicator={mockH2HIndicator}
        isH2HAvailable={false}
      />
    );
    expect(screen.queryByTestId("h2h-pie-chart")).not.toBeInTheDocument();
  });

  it("does not render H2H card when h2hIndicator is not provided", () => {
    render(<TopRightSlide {...baseProps} isH2HAvailable={true} />);
    expect(screen.queryByTestId("h2h-pie-chart")).not.toBeInTheDocument();
  });

  it("renders both cards when both are available", () => {
    render(
      <TopRightSlide
        {...baseProps}
        h2hIndicator={mockH2HIndicator}
        isH2HAvailable={true}
      />
    );
    expect(screen.getByTestId("winner-feeling")).toBeInTheDocument();
    expect(screen.getByTestId("h2h-pie-chart")).toBeInTheDocument();
  });
});
