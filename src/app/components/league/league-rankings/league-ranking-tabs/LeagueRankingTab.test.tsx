import { render, screen, fireEvent } from "@testing-library/react";
import LeagueRankingTab from "./LeagueRankingTab";
import { LeagueRankingPlayer } from "open-football-project-core";

vi.mock("../LeagueRanking", () => ({
  default: ({ players }: any) => (
    <div data-testid="league-ranking">
      {players.map((p: any) => p.playerName).join(",")}
    </div>
  ),
}));

vi.mock("../../../general/no-data/NoData", () => ({
  default: () => <div>Not Available</div>,
}));

describe("LeagueRankingTab", () => {
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

  it("renders only available tabs based on data", () => {
    render(
      <LeagueRankingTab
        topScorers={mockPlayers}
        yellowCards={[]}
        redCards={mockPlayers}
        assists={[]}
      />
    );

    expect(screen.getByText("common.top_scorers")).toBeInTheDocument();
    expect(screen.queryByText("common.top_y_cards")).not.toBeInTheDocument();
    expect(screen.getByText("common.top_r_cards")).toBeInTheDocument();
    expect(screen.queryByText("common.top_assists")).not.toBeInTheDocument();
  });

  it("renders the first available tab as active by default", () => {
    render(
      <LeagueRankingTab
        topScorers={mockPlayers}
        yellowCards={[]}
        redCards={mockPlayers}
        assists={[]}
      />
    );

    const ranking = screen.getByTestId("league-ranking");
    expect(ranking).toHaveTextContent("Erling Haaland,Lionel Messi");
  });

  it("switches content when a tab is clicked", () => {
    render(
      <LeagueRankingTab
        topScorers={mockPlayers}
        yellowCards={mockPlayers}
        redCards={[]}
        assists={[]}
      />
    );

    expect(screen.getByTestId("league-ranking")).toHaveTextContent(
      "Erling Haaland,Lionel Messi"
    );

    const yellowTab = screen.getByText("common.top_y_cards");
    fireEvent.click(yellowTab);

    expect(screen.getByTestId("league-ranking")).toHaveTextContent(
      "Erling Haaland,Lionel Messi"
    );
  });

  it("renders NoData if all arrays are empty", () => {
    render(
      <LeagueRankingTab
        topScorers={[]}
        yellowCards={[]}
        redCards={[]}
        assists={[]}
      />
    );

    expect(screen.getByText("Not Available")).toBeInTheDocument();
  });
});
