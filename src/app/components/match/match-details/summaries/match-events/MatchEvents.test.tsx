import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import MatchEvents from "./MatchEvents";

vi.mock("../../../../general/no-data/NoData", () => ({
  default: ({ loading }: { loading?: boolean }) => (
    <div data-testid="no-data">{loading ? "Loading..." : "No Data"}</div>
  ),
}));

describe("MatchEvents Component", () => {
  const mockEvents = {
    firstHalfGoals: 1,
    secondHalfGoals: 2,
    extraTimeGoals: 1,
    penalties: 0,
    firstHalfYellowCards: 1,
    secondHalfYellowCards: 2,
    extraTimeYellowCards: 0,
    firstHalfRedCards: 0,
    secondHalfRedCards: 1,
    extraTimeRedCards: 0,
  };

  it("renders loading state", () => {
    render(<MatchEvents loading={true} events={null} />);
    expect(screen.getByTestId("no-data")).toHaveTextContent("Loading...");
  });

  it("renders NoData when events is null and loading is false", () => {
    render(<MatchEvents loading={false} events={null} />);
    expect(screen.getByTestId("no-data")).toHaveTextContent("No Data");
  });

  it("renders all event categories correctly", () => {
    render(<MatchEvents loading={false} events={mockEvents} />);

    expect(screen.getByTestId("goal-events")).toBeDefined;
    expect(screen.getByTestId("ycard-events")).toBeDefined;
    expect(screen.getByTestId("rcards-events")).toBeDefined;
  });
});
