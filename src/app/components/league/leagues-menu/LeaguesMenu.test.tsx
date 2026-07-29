import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { LeagueMenuSelectionOption, LeaguesMenu } from "./LeaguesMenu";

vi.mock("./leagues-menu-grid/LeaguesMenuGrid", () => ({
  LeaguesMenuGrid: ({ leagues }: { leagues: any[] }) => (
    <div data-testid="leagues-grid">
      {leagues.map((l) => (
        <div key={l.id}>{l.name}</div>
      ))}
    </div>
  ),
}));

vi.mock("./leagues-menu-options/LeaguesMenuOptions", () => ({
  LeaguesMenuOptions: ({
    items,
    selectItem,
  }: {
    items: LeagueMenuSelectionOption[];
    selectItem: (item: LeagueMenuSelectionOption) => void;
  }) => (
    <div data-testid="leagues-options">
      {items.map((i) => (
        <button key={i.id} onClick={() => selectItem(i)}>
          {i.country}
        </button>
      ))}
    </div>
  ),
}));

const mockLeaguesGroups = {
  internationals: [{ id: 1, name: "World Cup" }],
  others: [{ id: 2, name: "Other League" }],
  countryLeagues: [
    {
      country: "England",
      leagues: [{ id: 3, name: "Premier League" }],
    },
    {
      country: "Spain",
      leagues: [{ id: 4, name: "La Liga" }],
    },
  ],
};

describe("LeaguesMenu", () => {
  it("renders loading state", () => {
    const { container } = render(
      <LeaguesMenu
        leaguesGroups={undefined}
        loading={true}
        isAnyLeagueAvailable={false}
      />
    );
    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  it("renders leagues menu with options", () => {
    render(
      <LeaguesMenu
        leaguesGroups={mockLeaguesGroups}
        loading={false}
        isAnyLeagueAvailable={true}
      />
    );
    expect(screen.getByText(/common.leaguesmenu/i)).toBeInTheDocument();
    expect(screen.getByTestId("leagues-options")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/common.countrysearch/i)
    ).toBeInTheDocument();
  });

  it("filters options via search", () => {
    render(
      <LeaguesMenu
        leaguesGroups={mockLeaguesGroups}
        loading={false}
        isAnyLeagueAvailable={true}
      />
    );
    const searchInput = screen.getByPlaceholderText(/common.countrysearch/i);

    fireEvent.change(searchInput, { target: { value: "Eng" } });

    expect(screen.getByText("England")).toBeInTheDocument();
  });

  it("selects International and shows its leagues", () => {
    render(
      <LeaguesMenu
        leaguesGroups={mockLeaguesGroups}
        loading={false}
        isAnyLeagueAvailable={true}
      />
    );
    fireEvent.click(screen.getByText("International"));

    expect(screen.getByText(/International/i)).toBeInTheDocument();
    expect(screen.getByTestId("leagues-grid")).toBeInTheDocument();
    expect(screen.getByText("World Cup")).toBeInTheDocument();
  });

  it("selects country and shows its leagues", () => {
    render(
      <LeaguesMenu
        leaguesGroups={mockLeaguesGroups}
        loading={false}
        isAnyLeagueAvailable={true}
      />
    );
    fireEvent.click(screen.getByText("England"));

    expect(screen.getByText(/England/i)).toBeInTheDocument();
    expect(screen.getByText("Premier League")).toBeInTheDocument();
  });

  it("resets selection when back button clicked", () => {
    render(
      <LeaguesMenu
        leaguesGroups={mockLeaguesGroups}
        loading={false}
        isAnyLeagueAvailable={true}
      />
    );
    fireEvent.click(screen.getByText("England"));

    expect(screen.getByText(/England/i)).toBeInTheDocument();

    fireEvent.click(screen.getByTitle("Go back"));
    expect(screen.getByText(/common.leaguesmenu/i)).toBeInTheDocument();
  });
});
