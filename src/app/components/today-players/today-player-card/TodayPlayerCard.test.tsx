import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TodayPlayerScore } from "@matchinsights/core";

import TodayPlayerCard from "./TodayPlayerCard";

const playerScore: TodayPlayerScore = {
  player: {
    id: 154,
    name: "L. Messi",
    age: 38,
    number: 10,
    position: "Attacker",
    photo: "https://example.com/messi.png",
  },
  score: 0.4812,
  signal: "ODDS_IMPLIED",
  reason: { markets: ["Anytime Goal Scorer", "Player Assists"] },
};

describe("TodayPlayerCard", () => {
  it("renders the player's photo, name, position, and team", () => {
    render(<TodayPlayerCard playerScore={playerScore} teamName="Argentina" />);

    expect(screen.getByRole("img", { name: "L. Messi" })).toHaveAttribute(
      "src",
      "https://example.com/messi.png",
    );
    expect(screen.getByText("L. Messi")).toBeInTheDocument();
    expect(screen.getByText("Argentina")).toBeInTheDocument();
  });

  it("falls back to the placeholder image when the player has no photo", () => {
    render(
      <TodayPlayerCard
        playerScore={{ ...playerScore, player: { ...playerScore.player, photo: null } }}
        teamName="Argentina"
      />,
    );

    const img = screen.getByRole("img", { name: "L. Messi" }) as HTMLImageElement;
    expect(img.src).toContain("player");
    expect(img.src).not.toContain("example.com");
  });

  it("omits the position line when the player has no position", () => {
    render(
      <TodayPlayerCard
        playerScore={{ ...playerScore, player: { ...playerScore.player, position: null } }}
        teamName="Argentina"
      />,
    );

    expect(screen.queryByTestId("today-player-position")).not.toBeInTheDocument();
  });

  it("shows the player's position when present", () => {
    render(<TodayPlayerCard playerScore={playerScore} teamName="Argentina" />);

    expect(screen.getByTestId("today-player-position")).toHaveTextContent("Attacker");
  });

  it("shows an Odds signal badge, a labeled average-implied-probability percentage, and one list item per matched market when the signal is ODDS_IMPLIED", () => {
    render(<TodayPlayerCard playerScore={playerScore} teamName="Argentina" />);

    expect(screen.getByTestId("today-player-signal")).toHaveTextContent("Odds");

    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(3);
    expect(items[0]).toHaveTextContent("Avg. implied probability: 48%");
    expect(items[1]).toHaveTextContent("Anytime Goal Scorer");
    expect(items[2]).toHaveTextContent("Player Assists");
  });

  it("truncates the markets list to 2 plus a '+N more' summary when there are more than 3 matched markets, capping the card at 4 lines like a Season Form card", () => {
    const manyMarketsScore: TodayPlayerScore = {
      ...playerScore,
      reason: {
        markets: ["Anytime Goal Scorer", "Player Assists", "Player Shots On Target", "Home Player Shots"],
      },
    };

    render(<TodayPlayerCard playerScore={manyMarketsScore} teamName="Argentina" />);

    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(4);
    expect(items[0]).toHaveTextContent("Avg. implied probability: 48%");
    expect(items[1]).toHaveTextContent("Anytime Goal Scorer");
    expect(items[2]).toHaveTextContent("Player Assists");
    expect(items[3]).toHaveTextContent("+2 more");
  });

  it("shows a Season Form signal badge and one list item per stat when the signal is SEASON_STAT", () => {
    const seasonStatScore: TodayPlayerScore = {
      ...playerScore,
      signal: "SEASON_STAT",
      reason: { appearances: 20, goals: 6, assists: 2, rating: 6.893 },
    };

    render(<TodayPlayerCard playerScore={seasonStatScore} teamName="Argentina" />);

    expect(screen.getByTestId("today-player-signal")).toHaveTextContent("Season Form");

    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(4);
    expect(items[0]).toHaveTextContent("Appearences: 20");
    expect(items[1]).toHaveTextContent("Goals: 6");
    expect(items[2]).toHaveTextContent("Assists: 2");
    expect(items[3]).toHaveTextContent("Rating: 6.9");
  });
});
