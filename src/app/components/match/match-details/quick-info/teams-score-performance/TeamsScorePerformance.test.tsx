import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TeamsScorePerformanceComponent from "./TeamsScorePerformance";
import { TeamsScorePerformance } from "open-football-project-core";

vi.mock("../../../../general/no-data/NoData", () => ({
  default: ({ loading }: { loading?: boolean }) => (
    <div data-testid="no-data">{loading ? "Loading..." : "No Data"}</div>
  ),
}));

vi.mock("../../../../general/status-tile/ArrowStatusTile", () => ({
  default: ({
    status,
    isFlat,
    isUp,
  }: {
    status: string;
    isFlat: boolean;
    isUp: boolean;
  }) => (
    <div data-testid="arrow-tile">
      Status:{status} | Flat:{String(isFlat)} | Up:{String(isUp)}
    </div>
  ),
}));

describe("TeamsScorePerformanceComponent", () => {
  const mockPerformance: TeamsScorePerformance = {
    homeTeamPerformance: "Good Form",
    awayTeamPerformance: "Bad Form",
  };

  it("renders loading state", () => {
    render(
      <TeamsScorePerformanceComponent
        isHome={true}
        loading={true}
        performance={null}
      />
    );
    expect(screen.getByTestId("no-data")).toHaveTextContent("Loading...");
  });

  it("renders NoData when no performance provided", () => {
    render(
      <TeamsScorePerformanceComponent
        isHome={true}
        loading={false}
        performance={null}
      />
    );
    expect(screen.getByTestId("no-data")).toHaveTextContent("No Data");
  });

  it("renders home team performance", () => {
    render(
      <TeamsScorePerformanceComponent
        isHome={true}
        loading={false}
        performance={mockPerformance}
      />
    );
    expect(screen.getByTestId("arrow-tile")).toHaveTextContent(
      "Status:common.good_form | Flat:false | Up:true"
    );
  });

  it("renders away team performance", () => {
    render(
      <TeamsScorePerformanceComponent
        isHome={false}
        loading={false}
        performance={mockPerformance}
      />
    );
    expect(screen.getByTestId("arrow-tile")).toHaveTextContent(
      "Status:common.bad_form | Flat:false | Up:false"
    );
  });

  it("interprets 'no data' as flat", () => {
    const perf: TeamsScorePerformance = {
      homeTeamPerformance: "No Data",
      awayTeamPerformance: "",
    };
    render(
      <TeamsScorePerformanceComponent
        isHome={true}
        loading={false}
        performance={perf}
      />
    );
    expect(screen.getByTestId("arrow-tile")).toHaveTextContent(
      "Status:common.no_data | Flat:true | Up:false"
    );
  });

  it("interprets empty string as flat", () => {
    const perf: TeamsScorePerformance = {
      homeTeamPerformance: "",
      awayTeamPerformance: "",
    };
    render(
      <TeamsScorePerformanceComponent
        isHome={true}
        loading={false}
        performance={perf}
      />
    );
    expect(screen.getByTestId("arrow-tile")).toHaveTextContent(
      "Status:common. | Flat:true | Up:false"
    );
  });
});
