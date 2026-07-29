import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { PlayerPosition, TodayPlayerScore } from "@matchinsights/core";

import TodayPlayersPositionRow from "./TodayPlayersPositionRow";

vi.mock("../today-players-slider/TodayPlayersSlider", () => ({
  default: ({ playerScores, teamName }: any) => (
    <div data-testid="today-players-slider">
      {teamName}:{playerScores.map((p: TodayPlayerScore) => p.player.name).join(",")}
    </div>
  ),
}));

const playerScore = (id: number, name: string): TodayPlayerScore => ({
  player: { id, name, age: null, number: null, position: null, photo: null },
  score: 1,
  signal: "ODDS_IMPLIED",
  reason: { markets: ["Anytime Goal Scorer"] },
});

describe("TodayPlayersPositionRow", () => {
  const homePlayerScores = [playerScore(1, "Messi")];
  const awayPlayerScores = [playerScore(2, "Salah")];

  it("renders a home slider and an away slider, each with that side's players and team name", () => {
    render(
      <TodayPlayersPositionRow
        position={"ATTACKER" as PlayerPosition}
        homePlayerScores={homePlayerScores}
        awayPlayerScores={awayPlayerScores}
        homeTeamName="Argentina"
        awayTeamName="Egypt"
      />,
    );

    const sliders = screen.getAllByTestId("today-players-slider");
    expect(sliders).toHaveLength(2);
    expect(sliders[0]).toHaveTextContent("Argentina:Messi");
    expect(sliders[1]).toHaveTextContent("Egypt:Salah");
  });

  it("does not render a slider for a side with no players for this position", () => {
    render(
      <TodayPlayersPositionRow
        position={"GOALKEEPER" as PlayerPosition}
        homePlayerScores={[]}
        awayPlayerScores={awayPlayerScores}
        homeTeamName="Argentina"
        awayTeamName="Egypt"
      />,
    );

    const sliders = screen.getAllByTestId("today-players-slider");
    expect(sliders).toHaveLength(1);
    expect(sliders[0]).toHaveTextContent("Egypt:Salah");
  });

  it("renders no sliders when neither side has players for this position", () => {
    render(
      <TodayPlayersPositionRow
        position={"GOALKEEPER" as PlayerPosition}
        homePlayerScores={[]}
        awayPlayerScores={[]}
        homeTeamName="Argentina"
        awayTeamName="Egypt"
      />,
    );

    expect(screen.queryByTestId("today-players-slider")).not.toBeInTheDocument();
  });
});
