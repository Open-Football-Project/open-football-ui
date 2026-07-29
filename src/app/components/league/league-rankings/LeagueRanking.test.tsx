import { render, screen } from "@testing-library/react";
import LeagueRanking from "./LeagueRanking";
import { LeagueRankingPlayer } from "@matchinsights/core";

vi.mock("./rankin-player-card/RankingPlayerCard", () => ({
  default: ({ player }: any) => (
    <div data-testid="player-card">{player.playerName}</div>
  ),
}));

describe("LeagueRanking", () => {
  const mockPlayers: LeagueRankingPlayer[] = [
    {
      playerId: 1,
      playerName: "Erling Haaland",
      playerPhoto: "https://example.com/haaland.png",
      playerAge: 24,
      playerTeamId: 33,
      playerTeamLogo: "https://example.com/man-city-logo.png",
      playerTeamName: "Manchester City",
      playerTotalGoals: 36,
      playerTotalAssists: 8,
      playerTotalYellowCards: 2,
      playerTotalRedCards: 0,
      playerTotalAppearances: 30,
    },
    {
      playerId: 2,
      playerName: "Lionel Messi",
      playerPhoto: "https://example.com/messi.png",
      playerAge: 36,
      playerTeamId: 10,
      playerTeamLogo: "https://example.com/psg-logo.png",
      playerTeamName: "PSG",
      playerTotalGoals: 25,
      playerTotalAssists: 12,
      playerTotalYellowCards: 1,
      playerTotalRedCards: 0,
      playerTotalAppearances: 28,
    },
  ];

  it("renders the correct number of player cards", () => {
    render(<LeagueRanking players={mockPlayers} />);

    const cards = screen.getAllByTestId("player-card");
    expect(cards).toHaveLength(mockPlayers.length);
  });

  it("renders each player name in the card", () => {
    render(<LeagueRanking players={mockPlayers} />);

    mockPlayers.forEach((player) => {
      expect(screen.getByText(player.playerName)).toBeInTheDocument();
    });
  });
});
