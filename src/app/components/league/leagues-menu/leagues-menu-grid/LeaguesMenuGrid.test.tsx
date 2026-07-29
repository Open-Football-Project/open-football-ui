import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { LeaguesMenuGrid } from "./LeaguesMenuGrid";
import { mockLeaguesGroups } from "@matchinsights/core";
import { MemoryRouter } from "react-router-dom";

vi.mock("../../../../components/general/logo/Logo", () => ({
  default: ({
    src,
    customImageClass,
  }: {
    src: string;
    customImageClass?: string;
  }) => <img data-testid="mock-logo" src={src} className={customImageClass} />,
}));

describe("LeaguesMenuGrid", () => {
  const setup = (leagues) =>
    render(
      <MemoryRouter>
        <LeaguesMenuGrid leagues={leagues} />
      </MemoryRouter>
    );

  it("renders without crashing", () => {
    setup(mockLeaguesGroups.internationals);
    expect(
      screen.getByRole("list", { name: /aria.leaguesMenu.leagues/i })
    ).toBeInTheDocument();
  });

  it("renders all leagues with their names and logos", () => {
    setup(mockLeaguesGroups.internationals);
    mockLeaguesGroups.internationals.forEach((league) => {
      expect(screen.getByText(league.name)).toBeDefined();
      const logo = screen
        .getAllByTestId("mock-logo")
        .find((img) => img.getAttribute("src") === league.logo);
      expect(logo).toBeTruthy();
    });
  });
});
