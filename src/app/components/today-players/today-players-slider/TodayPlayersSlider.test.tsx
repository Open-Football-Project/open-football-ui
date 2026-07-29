import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TodayPlayerScore } from "open-football-project-core";

import TodayPlayersSlider from "./TodayPlayersSlider";

vi.mock("../today-player-card/TodayPlayerCard", () => ({
  default: ({ playerScore, teamName }: any) => (
    <div data-testid="today-player-card">
      {playerScore.player.name}-{teamName}
    </div>
  ),
}));

const playerScore = (id: number, name: string): TodayPlayerScore => ({
  player: { id, name, age: null, number: null, position: null, photo: null },
  score: 1,
  signal: "ODDS_IMPLIED",
  reason: { markets: ["Anytime Goal Scorer"] },
});

describe("TodayPlayersSlider", () => {
  const playerScores = [
    playerScore(1, "Messi"),
    playerScore(2, "Di Maria"),
    playerScore(3, "Alvarez"),
  ];

  it("renders NoData when no players are passed", () => {
    render(<TodayPlayersSlider playerScores={[]} teamName="Argentina" />);

    expect(screen.getByText(/nodata.default/i)).toBeInTheDocument();
  });

  it("renders the first player's card by default", () => {
    render(<TodayPlayersSlider playerScores={playerScores} teamName="Argentina" />);

    expect(screen.getByText("Messi-Argentina")).toBeInTheDocument();
  });

  it("hides the prev/next arrows when there is only one player", () => {
    render(<TodayPlayersSlider playerScores={[playerScores[0]]} teamName="Argentina" />);

    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });

  it("shows the prev/next arrows when there is more than one player", () => {
    render(<TodayPlayersSlider playerScores={playerScores} teamName="Argentina" />);

    expect(screen.getAllByRole("button")).toHaveLength(2);
  });

  it("navigates to the next player when the right arrow is clicked", async () => {
    render(<TodayPlayersSlider playerScores={playerScores} teamName="Argentina" />);

    fireEvent.click(screen.getAllByRole("button")[1]);

    await waitFor(() => {
      expect(screen.getByText("Di Maria-Argentina")).toBeInTheDocument();
    });
  });

  it("navigates to the previous player (wrapping to the last) when the left arrow is clicked", async () => {
    render(<TodayPlayersSlider playerScores={playerScores} teamName="Argentina" />);

    fireEvent.click(screen.getAllByRole("button")[0]);

    await waitFor(() => {
      expect(screen.getByText("Alvarez-Argentina")).toBeInTheDocument();
    });
  });

  it("wraps around to the first player after the last", async () => {
    render(<TodayPlayersSlider playerScores={playerScores} teamName="Argentina" />);

    const rightBtn = screen.getAllByRole("button")[1];
    fireEvent.click(rightBtn);
    fireEvent.click(rightBtn);
    fireEvent.click(rightBtn);

    await waitFor(() => {
      expect(screen.getByText("Messi-Argentina")).toBeInTheDocument();
    });
  });
});
