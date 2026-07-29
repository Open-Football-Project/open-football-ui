import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TeamPlayer } from "@matchinsights/core";
import { PlayerCard } from "./PlayerCard";

describe("PlayerCard", () => {
  const mockPlayer: TeamPlayer = {
    playerId: 10,
    name: "Lionel Messi",
    age: 36,
    position: "Forward",
    playerNumber: 10,
    photo: "https://example.com/messi.png",
  };

  it("renders player name", () => {
    render(<PlayerCard player={mockPlayer} />);
    expect(screen.getByText(/Lionel Messi/i)).toBeInTheDocument();
  });

  it("renders age when present", () => {
    render(<PlayerCard player={mockPlayer} />);
    expect(screen.getByText(/common.age/i)).toBeInTheDocument();
    expect(screen.getByText(/36/)).toBeInTheDocument();
  });

  it("renders position when present", () => {
    render(<PlayerCard player={mockPlayer} />);
    expect(screen.getByText(/common.position/i)).toBeInTheDocument();
  });

  it("renders player number when present", () => {
    render(<PlayerCard player={mockPlayer} />);
    expect(screen.getByText(/common.number/i)).toBeInTheDocument();
    expect(screen.getByText(/10/)).toBeInTheDocument();
  });

  it("does not render age when absent", () => {
    const player: TeamPlayer = { ...mockPlayer, age: undefined };
    render(<PlayerCard player={player} />);
    expect(screen.queryByText(/common.age/i)).not.toBeInTheDocument();
  });

  it("does not render position when absent", () => {
    const player: TeamPlayer = { ...mockPlayer, position: undefined };
    render(<PlayerCard player={player} />);
    expect(screen.queryByText(/common.position/i)).not.toBeInTheDocument();
  });

  it("does not render player number when absent", () => {
    const player: TeamPlayer = { ...mockPlayer, playerNumber: undefined };
    render(<PlayerCard player={player} />);
    expect(screen.queryByText(/common.number/i)).not.toBeInTheDocument();
  });

  it("renders player photo when provided", () => {
    render(<PlayerCard player={mockPlayer} />);
    const img = screen.getByAltText(mockPlayer.name) as HTMLImageElement;
    expect(img.src).toContain(mockPlayer.photo);
  });

  it("uses profile placeholder when photo is absent", () => {
    const player: TeamPlayer = { ...mockPlayer, photo: undefined };
    render(<PlayerCard player={player} />);
    const img = screen.getByAltText(mockPlayer.name) as HTMLImageElement;
    expect(img.src).toContain("player.png");
  });

  it("renders Download and Quiz buttons", () => {
    render(<PlayerCard player={mockPlayer} />);
    expect(screen.getByRole("button", { name: /download/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /quiz/i })).toBeInTheDocument();
  });

  it("Download and Quiz buttons are enabled by default", () => {
    render(<PlayerCard player={mockPlayer} />);
    expect(screen.getByRole("button", { name: /download/i })).not.toBeDisabled();
    expect(screen.getByRole("button", { name: /quiz/i })).not.toBeDisabled();
  });
});
