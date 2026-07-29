import { render, screen } from "@testing-library/react";
import { describe, it } from "vitest";
import MatchOdds from "./MatchOdds";
import { Bet } from "open-football-project-core";

vi.mock("../match-details-slider/MatchDetailsSlider", () => {
  return {
    default: ({ items }: { items: any[] }) => (
      <div data-testid="slider">
        {items.length > 0 ? (
          items.map((it: any, idx: number) => (
            <div key={idx} data-testid="slide">
              {it.title} - {it.component}
            </div>
          ))
        ) : (
          <div>NoData</div>
        )}
      </div>
    ),
  };
});

describe("MatchOdds", () => {
  it("renders NoData when loading", () => {
    render(
      <MatchOdds bets={[{ betName: "Winner", values: [] }]} isLoading={true} />
    );

    expect(screen.getByText("NoData")).toBeInTheDocument();
  });

  it("renders odds when data is available", () => {
    const mockBets: Bet[] = [
      {
        betName: "Winner",
        values: [
          { label: "Home", odd: "1.50" },
          { label: "Draw", odd: "3.40" },
          { label: "Away", odd: "5.25" },
        ],
      },
    ];

    render(<MatchOdds bets={mockBets} isLoading={false} />);

    expect(screen.getByTestId("slide")).toHaveTextContent("Winner");

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("1.50")).toBeInTheDocument();
    expect(screen.getByText("Draw")).toBeInTheDocument();
    expect(screen.getByText("3.40")).toBeInTheDocument();
    expect(screen.getByText("Away")).toBeInTheDocument();
    expect(screen.getByText("5.25")).toBeInTheDocument();
  });

  it("renders NoData when bets array is empty", () => {
    render(<MatchOdds bets={[]} isLoading={false} />);

    expect(screen.getByText("NoData")).toBeInTheDocument();
  });
});
