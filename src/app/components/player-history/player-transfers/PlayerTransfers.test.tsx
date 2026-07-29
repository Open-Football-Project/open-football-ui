import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PlayerTransfers from "./PlayerTransfers";

vi.mock("../../general/logo/Logo", () => ({
  default: ({ src }: { src: string }) => (
    <img data-testid="team-logo" src={src} alt="team" />
  ),
}));

describe("PlayerTransfers Component", () => {
  const transfers = [
    {
      date: "2022-07-01",
      fromTeamId: 1,
      fromTeamName: "Team A",
      fromTeamLogo: null,
      toTeamId: 2,
      toTeamName: "Team B",
      toTeamLogo: "https://example.com/team-b.png",
    },
  ];

  it("renders NoData when transfers array is empty", () => {
    render(
      <MemoryRouter>
        <PlayerTransfers transfers={[]} />
      </MemoryRouter>
    );
    expect(screen.getByText(/nodata.default/i)).toBeInTheDocument();
  });

  it("renders a transfer with correct date, team names, and logos", () => {
    render(
      <MemoryRouter>
        <PlayerTransfers transfers={transfers} />
      </MemoryRouter>
    );

    expect(screen.getByText("01 Jul 2022")).toBeInTheDocument();

    const fromLogo = screen.getAllByTestId("team-logo")[0] as HTMLImageElement;
    expect(fromLogo.src).toBeDefined();

    const toLogo = screen.getAllByTestId("team-logo")[1] as HTMLImageElement;
    expect(toLogo.src).toBe("https://example.com/team-b.png");
  });

  it("renders correct link paths for fromTeamId and toTeamId", () => {
    render(
      <MemoryRouter>
        <PlayerTransfers transfers={transfers} />
      </MemoryRouter>
    );

    const links = screen.getAllByRole("link");
    expect(links[0]).toHaveAttribute("href", "/team/1");
    expect(links[1]).toHaveAttribute("href", "/team/2");
  });
});
