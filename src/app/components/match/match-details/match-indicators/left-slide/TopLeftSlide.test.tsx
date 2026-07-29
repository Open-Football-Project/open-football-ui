import { render, screen } from "@testing-library/react";
import { TopLeftSlide } from "./TopLeftSlide";
import { vi } from "vitest";

vi.mock("../../quick-info/last-five-matches/LastFiveMatches", () => ({
  default: vi.fn(({ isHome, loading }) => (
    <div data-testid={`last-five-${isHome ? "home" : "away"}`}>
      {loading ? "loading..." : `Rendered LastFive ${isHome ? "home" : "away"}`}
    </div>
  )),
}));

vi.mock(
  "../../quick-info/teams-score-performance/TeamsScorePerformance",
  () => ({
    default: vi.fn(({ isHome, loading }) => (
      <div data-testid={`performance-${isHome ? "home" : "away"}`}>
        {loading ? "loading..." : `Rendered Perf ${isHome ? "home" : "away"}`}
      </div>
    )),
  })
);

vi.mock("../../quick-info/teams-rest-status/TeamRestStatus", () => ({
  default: vi.fn(({ isHome, loading }) => (
    <div data-testid={`rest-${isHome ? "home" : "away"}`}>
      {loading ? "loading..." : `Rendered Rest ${isHome ? "home" : "away"}`}
    </div>
  )),
}));

vi.mock("../../../../general/tiny-card/TinyCard", () => ({
  default: vi.fn(({ title, cardId, sections }) => (
    <div data-testid={cardId}>
      <h3>{title}</h3>
      {sections.map((s: any) => (
        <div key={s.label}>
          <span>{s.label}</span>
          {s.component}
        </div>
      ))}
    </div>
  )),
}));

describe("TopLeftSlide", () => {
  const baseProps = {
    lastFiveLoading: false,
    lastFiveResults: { results: [] },
    loadingPerformance: false,
    performance: { data: [] },
    loadingRestStatus: false,
    restStatus: { restDays: [] },
    homeTeam: "Arsenal",
    awayTeam: "Chelsea",
    isRestStatusAvailable: true,
    isPerformanceAvailable: true,
    isLastFiveAvailable: true,
  };

  it("renders three TinyCards with correct titles", () => {
    render(<TopLeftSlide {...baseProps} />);

    expect(screen.getByText("common.last_five_results")).toBeInTheDocument();
    expect(screen.getByText("common.performance")).toBeInTheDocument();
    expect(screen.getByText("common.rest_status")).toBeInTheDocument();
  });

  it("passes loading props correctly to child components", () => {
    render(<TopLeftSlide {...baseProps} lastFiveLoading={true} />);
    expect(screen.getByTestId("last-five-away")).toHaveTextContent(
      "loading..."
    );
    expect(screen.getByTestId("last-five-home")).toHaveTextContent(
      "loading..."
    );
  });

  it("renders performance and rest components for both home and away", () => {
    render(<TopLeftSlide {...baseProps} />);
    expect(screen.getByTestId("performance-home")).toBeInTheDocument();
    expect(screen.getByTestId("performance-away")).toBeInTheDocument();
    expect(screen.getByTestId("rest-home")).toBeInTheDocument();
    expect(screen.getByTestId("rest-away")).toBeInTheDocument();
  });
});
