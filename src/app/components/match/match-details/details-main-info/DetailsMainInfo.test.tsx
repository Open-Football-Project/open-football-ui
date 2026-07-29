import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { DetailsMainInfo } from "./DetailsMainInfo";
import { ApiService } from "@matchinsights/core";

vi.mock("./team-details-info/TeamDetailsInfo", () => ({
  default: ({ team }: any) => (
    <div data-testid="team-details">
      <span>{team.name}</span>
    </div>
  ),
}));

vi.mock("@matchinsights/core", async () => {
  const actual = await vi.importActual("@matchinsights/core");
  return {
    ...actual,
    useCharteableMatchNow: vi.fn(() => ({
      isCharteableMatchNow: false,
      loadingCharteableMatchNow: false,
    })),
    useTopGuysAvailable: vi.fn(() => ({
      isTopGuysAvailable: false,
      loadingTopGuysAvailable: false,
    })),
  };
});

import { useCharteableMatchNow, useTopGuysAvailable } from "@matchinsights/core";

const mockApiService = {} as unknown as ApiService;

describe("DetailsMainInfo", () => {
  const homeTeam = { id: 1, name: "Home FC", logo: "home.png" };
  const awayTeam = { id: 2, name: "Away United", logo: "away.png" };
  const league = { id: 10, name: "Premier League", season: 2025 };
  const venue = { id: 100, name: "Big Stadium", city: "Metropolis" };
  const goals = { home: 2, away: 1 };
  const score = {
    halftime: { home: 1, away: 0 },
    fulltime: { home: 2, away: 1 },
    extratime: { home: 2, away: 1 },
  };

  // Mock window.open for share
  const originalOpen = window.open;
  beforeAll(() => {
    window.open = vi.fn();
  });
  afterAll(() => {
    window.open = originalOpen;
  });

  const renderComponent = (overrideProps = {}) =>
    render(
      <MemoryRouter>
        <DetailsMainInfo
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          date="2024-03-10T15:30:00Z"
          league={league}
          venue={venue}
          goals={goals}
          score={score}
          fixtureId={1234}
          apiService={mockApiService}
          isLiveNow={false}
          {...overrideProps}
        />
      </MemoryRouter>,
    );

  it("renders home and away teams", () => {
    renderComponent();
    expect(screen.getAllByTestId("team-details")).toHaveLength(2);
  });

  it("renders league link with correct href and name", () => {
    renderComponent();
    const leagueLink = screen.getByTestId("league-link");
    expect(leagueLink).toHaveAttribute("href", "/league/10");
    expect(leagueLink).toHaveTextContent("Premier Lg.");
  });

  it("renders fallback league text when league id is missing", () => {
    renderComponent({ league: { id: undefined, name: "" } });
    expect(screen.getByTestId("league-link")).toHaveTextContent(
      "common.unknown",
    );
  });

  it("renders venue and date correctly", () => {
    renderComponent();
    expect(screen.getByTestId("venue-details")).toBeDefined();
    expect(screen.getByTestId("match-date")).toBeDefined();
  });

  it("renders live now link button", () => {
    renderComponent({ isLiveNow: true });
    expect(screen.getByTestId("live-now-link")).toBeInTheDocument();
  });

  it("renders the chart link next to the live button when charteable and live", () => {
    vi.mocked(useCharteableMatchNow).mockReturnValue({
      isCharteableMatchNow: true,
      loadingCharteableMatchNow: false,
    });

    renderComponent({ isLiveNow: true });

    expect(screen.getByTestId("live-now-link")).toBeInTheDocument();
    expect(screen.getByTestId("chart-link")).toHaveAttribute(
      "href",
      "/charts/1234",
    );
  });

  it("renders the chart link next to the status text when charteable and not live", () => {
    vi.mocked(useCharteableMatchNow).mockReturnValue({
      isCharteableMatchNow: true,
      loadingCharteableMatchNow: false,
    });

    renderComponent({ isLiveNow: false });

    expect(screen.getByTestId("match-status")).toBeInTheDocument();
    expect(screen.getByTestId("chart-link")).toHaveAttribute(
      "href",
      "/charts/1234",
    );
  });

  it("does not render the chart link when not charteable, live or not", () => {
    vi.mocked(useCharteableMatchNow).mockReturnValue({
      isCharteableMatchNow: false,
      loadingCharteableMatchNow: false,
    });

    renderComponent({ isLiveNow: true });
    expect(screen.queryByTestId("chart-link")).not.toBeInTheDocument();

    renderComponent({ isLiveNow: false });
    expect(screen.queryByTestId("chart-link")).not.toBeInTheDocument();
  });

  it("renders a top guys link when the fixture has a today-players watchlist", () => {
    vi.mocked(useTopGuysAvailable).mockReturnValue({
      isTopGuysAvailable: true,
      loadingTopGuysAvailable: false,
    });

    renderComponent();

    expect(screen.getByTestId("top-guys-link")).toHaveAttribute(
      "href",
      "/today-players/1234",
    );
  });

  it("does not render a top guys link when the fixture has no today-players watchlist", () => {
    vi.mocked(useTopGuysAvailable).mockReturnValue({
      isTopGuysAvailable: false,
      loadingTopGuysAvailable: false,
    });

    renderComponent();

    expect(screen.queryByTestId("top-guys-link")).not.toBeInTheDocument();
  });

  it("renders SocialSharing and its buttons", () => {
    renderComponent();
    expect(screen.getByRole("button", { name: /share/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /download/i }),
    ).toBeInTheDocument();
  });

  it("calls handleShare (opens window) when Share is clicked", () => {
    renderComponent();
    const shareBtn = screen.getByRole("button", { name: /share/i });
    shareBtn.click();
    expect(window.open).toHaveBeenCalled();
  });
});
