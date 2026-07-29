import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import PlayerHeader from "./PlayerHistoryHeader";
import { MemoryRouter } from "react-router-dom";
import { PlayerMainInfo } from "@matchinsights/core";

describe("PlayerHeader Component", () => {
  const player: PlayerMainInfo = {
    playerId: 1,
    age: 30,
    height: "180",
    weight: "75",
    injured: false,
    nationality: "Argentina",
    position: "Forward",
    teamId: 10,
    teamName: "FC Barcelona",
    teamLogo: "https://example.com/barcelona.png",
    name: "Lionel Messi",
    photo: "https://example.com/messi.png",
  };

  const playerWithoutPhoto: PlayerMainInfo = {
    ...player,
    photo: null,
  };

  it("renders the player info", () => {
    render(
      <MemoryRouter>
        <PlayerHeader player={player} />
      </MemoryRouter>
    );
    expect(screen.getByText("Lionel Messi")).toBeInTheDocument();
    expect(screen.getByText("FC Barcelona")).toBeInTheDocument();
    expect(screen.getByText("Argentina")).toBeInTheDocument();
    expect(screen.getByText(30)).toBeInTheDocument();
  });

  it("renders the player photo when available", () => {
    render(
      <MemoryRouter>
        <PlayerHeader player={player} />
      </MemoryRouter>
    );
    const img = screen.getAllByTestId("team-logo")[0] as HTMLImageElement;
    expect(img.src).toBe(player.photo);
  });

  it("renders the fallback image when player photo is missing", () => {
    render(
      <MemoryRouter>
        <PlayerHeader player={playerWithoutPhoto} />
      </MemoryRouter>
    );
    const img = screen.getAllByTestId("team-logo")[0] as HTMLImageElement;
    expect(img.src).toContain("player.png");
  });
});
