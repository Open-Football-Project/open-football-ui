import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import BettingToolWrapper from "./BettingToolWrapper";
import { ValueBetsResponse } from "open-football-project-core";

vi.mock("../ValueBetTable", () => ({
  default: ({ market }: { market: { betName: string } }) => (
    <div data-testid="value-bet-table">{market.betName}</div>
  ),
}));

const data: ValueBetsResponse = {
  markets: [
    {
      betName: "Match Winner",
      fairOdds: [],
      bookmakers: [],
    },
    {
      betName: "Goals Over/Under",
      fairOdds: [],
      bookmakers: [],
    },
    {
      betName: "Both Teams Score",
      fairOdds: [],
      bookmakers: [],
    },
  ],
};

describe("BettingToolWrapper", () => {
  it("renders one button per market", () => {
    render(<BettingToolWrapper data={data} isLoading={false} />);

    expect(screen.getByRole("button", { name: "Match Winner" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Goals Over/Under" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Both Teams Score" })).toBeInTheDocument();
  });

  it("shows the first market table by default", () => {
    render(<BettingToolWrapper data={data} isLoading={false} />);

    expect(screen.getByTestId("value-bet-table")).toHaveTextContent("Match Winner");
  });

  it("switches the displayed table when a market button is clicked", async () => {
    render(<BettingToolWrapper data={data} isLoading={false} />);

    await userEvent.click(screen.getByRole("button", { name: "Goals Over/Under" }));

    expect(screen.getByTestId("value-bet-table")).toHaveTextContent("Goals Over/Under");
  });

  it("always renders the Gamble Aware footer", () => {
    render(<BettingToolWrapper data={data} isLoading={false} />);

    expect(screen.getByText("+18 | Gamble Aware")).toBeInTheDocument();
  });
});
