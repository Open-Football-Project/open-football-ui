import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import { LeagueRankingPlayer } from "open-football-project-core";
import RankingPlayerCard from "./RankingPlayerCard";

describe("RankingPlayerCard", () => {
  const mockPlayer: LeagueRankingPlayer = {
    playerId: 14,
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
  };

  const renderCard = (player = mockPlayer) =>
    render(
      <MemoryRouter>
        <RankingPlayerCard player={player} />
      </MemoryRouter>,
    );

  it("renders the player name, age and team", () => {
    renderCard();
    expect(screen.getByText(mockPlayer.playerName)).toBeInTheDocument();
    expect(screen.getByText(`common.age: ${mockPlayer.playerAge}`)).toBeInTheDocument();
    expect(screen.getByText(mockPlayer.playerTeamName)).toBeInTheDocument();
  });

  it("renders all stat fields", () => {
    renderCard();
    expect(screen.getByTestId("goals")).toBeInTheDocument();
    expect(screen.getByText(`${mockPlayer.playerTotalGoals}`)).toBeInTheDocument();
    expect(screen.getByTestId("assists")).toBeInTheDocument();
    expect(screen.getByText(`${mockPlayer.playerTotalAssists}`)).toBeInTheDocument();
    expect(screen.getByTestId("y-cards")).toBeInTheDocument();
    expect(screen.getByText(`${mockPlayer.playerTotalYellowCards}`)).toBeInTheDocument();
    expect(screen.getByTestId("r-cards")).toBeInTheDocument();
    expect(screen.getByText(`${mockPlayer.playerTotalRedCards}`)).toBeInTheDocument();
    expect(screen.getByTestId("appearences")).toBeInTheDocument();
    expect(screen.getByText(`${mockPlayer.playerTotalAppearances}`)).toBeInTheDocument();
  });

  it("renders player photo and team logo", () => {
    renderCard();
    const playerImg = screen.getByAltText(mockPlayer.playerName) as HTMLImageElement;
    const teamLogo = screen.getByAltText(mockPlayer.playerTeamName) as HTMLImageElement;
    expect(playerImg.src).toContain(mockPlayer.playerPhoto);
    expect(teamLogo.src).toContain(mockPlayer.playerTeamLogo);
  });

  it("uses profile placeholder when playerPhoto is empty", () => {
    renderCard({ ...mockPlayer, playerPhoto: "" });
    const playerImg = screen.getByAltText(mockPlayer.playerName) as HTMLImageElement;
    expect(playerImg.src).toContain("player.png");
  });

  it("renders link to team page", () => {
    renderCard();
    expect(screen.getByRole("link", { name: /common.view_team/i }))
      .toHaveAttribute("href", `/team/${mockPlayer.playerTeamId}`);
  });

  it("renders link to player page", () => {
    renderCard();
    expect(screen.getByRole("link", { name: /common.view_player/i }))
      .toHaveAttribute("href", `/player/${mockPlayer.playerId}`);
  });

  it("renders Download and Quiz buttons", () => {
    renderCard();
    expect(screen.getByRole("button", { name: /download/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /quiz/i })).toBeInTheDocument();
  });

  it("Download button is enabled by default", () => {
    renderCard();
    expect(screen.getByRole("button", { name: /download/i })).not.toBeDisabled();
  });

  it("Quiz button is enabled by default", () => {
    renderCard();
    expect(screen.getByRole("button", { name: /quiz/i })).not.toBeDisabled();
  });
});
