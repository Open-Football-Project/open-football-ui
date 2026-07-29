import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import LastFiveMatches from "./LastFiveMatches";

vi.mock("../../../../general/no-data/NoData", () => ({
  default: ({ loading }: { loading?: boolean }) => (
    <div data-testid="no-data">{loading ? "Loading..." : "No Data"}</div>
  ),
}));

describe("LastFiveMatches Component", () => {
  const mockLastFive = {
    homeTeamLastFive: ["W", "D", "L", "W", "W"],
    awayTeamLastFive: ["L", "L", "D", "W", "D"],
  };

  it("renders loading state", () => {
    render(
      <LastFiveMatches loading={true} lastFiveResults={null} isHome={true} />
    );
    expect(screen.getByTestId("no-data")).toHaveTextContent("Loading...");
  });

  it("renders NoData when lastFiveResults is null and loading is false", () => {
    render(
      <LastFiveMatches loading={false} lastFiveResults={null} isHome={true} />
    );
    expect(screen.getByTestId("no-data")).toHaveTextContent("No Data");
  });

  it("renders home team last five matches correctly", () => {
    render(
      <LastFiveMatches
        loading={false}
        lastFiveResults={mockLastFive}
        isHome={true}
      />
    );

    const spans = screen.getAllByText(/W|D|L/);
    expect(spans).toHaveLength(5);

    expect(spans[0]).toHaveTextContent("W");
    expect(spans[0]).toHaveClass("bg-brand-success");
    expect(spans[1]).toHaveTextContent("D");
    expect(spans[1]).toHaveClass("bg-brand-yellow");
    expect(spans[2]).toHaveTextContent("L");
    expect(spans[2]).toHaveClass("bg-brand-red");
  });

  it("renders away team last five matches correctly", () => {
    render(
      <LastFiveMatches
        loading={false}
        lastFiveResults={mockLastFive}
        isHome={false}
      />
    );

    const spans = screen.getAllByText(/W|D|L/);
    expect(spans).toHaveLength(5);

    expect(spans[0]).toHaveTextContent("L");
    expect(spans[0]).toHaveClass("bg-brand-red");
    expect(spans[1]).toHaveTextContent("L");
    expect(spans[1]).toHaveClass("bg-brand-red");
    expect(spans[2]).toHaveTextContent("D");
    expect(spans[2]).toHaveClass("bg-brand-yellow");
  });

  it("renders 'No data' when last five array is empty", () => {
    const emptyData = { homeTeamLastFive: [], awayTeamLastFive: [] };
    render(
      <LastFiveMatches
        loading={false}
        lastFiveResults={emptyData}
        isHome={true}
      />
    );
    expect(screen.getByText("common.no_data")).toBeInTheDocument();
  });
});
