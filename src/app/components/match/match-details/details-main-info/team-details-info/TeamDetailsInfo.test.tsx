import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import TeamDetailsInfo from "./TeamDetailsInfo";

vi.mock("../../../../general/logo/Logo", () => ({
  default: ({ src }: { src: string }) => (
    <img data-testid="team-logo" src={src} alt="team logo" />
  ),
}));

describe("TeamDetailsInfo", () => {
  const team = { id: 1, name: "Home FC", logo: "home-logo.png" };

  const renderComponent = () =>
    render(
      <MemoryRouter>
        <TeamDetailsInfo team={team} />
      </MemoryRouter>
    );

  it("renders the team link with correct text and href", () => {
    renderComponent();

    const teamlink = screen.getByTestId("1-team-link");
    expect(teamlink).toHaveAttribute("href", "/team/1");
    expect(screen.getByText("Home FC")).toBeInTheDocument();

    const teamlogo = screen.getByTestId("team-logo");
    expect(teamlogo).toHaveAttribute("src", "home-logo.png");
  });
});
