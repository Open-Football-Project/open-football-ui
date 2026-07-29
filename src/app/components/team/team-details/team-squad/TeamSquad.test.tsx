import { render, screen } from "@testing-library/react";
import { TeamSquad } from "./TeamSquad";
import { mockPlayers } from "@matchinsights/core";
import { MemoryRouter } from "react-router-dom";

describe("TeamSquad", () => {
  it("renders the Squad title", () => {
    render(
      <MemoryRouter>
        <TeamSquad players={mockPlayers} />
      </MemoryRouter>
    );
    expect(screen.getByText("common.squad")).toBeInTheDocument();
  });

  it("renders all players provided", () => {
    render(
      <MemoryRouter>
        <TeamSquad players={mockPlayers} />
      </MemoryRouter>
    );
    mockPlayers.forEach((player) => {
      expect(screen.getByText(player.name)).toBeInTheDocument();
    });
  });

  it("renders correctly with an empty list", () => {
    render(
      <MemoryRouter>
        <TeamSquad players={[]} />
      </MemoryRouter>
    );
    expect(screen.getByText("common.squad")).toBeInTheDocument();
    expect(screen.queryByText(/common.age:/)).not.toBeInTheDocument();
  });
});
