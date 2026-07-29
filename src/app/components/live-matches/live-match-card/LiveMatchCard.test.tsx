import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { LiveMatchCard } from "./LiveMatchCard";
import { ApiService, LiveMatch } from "@matchinsights/core";

vi.mock("../../general/logo/Logo", () => ({
  default: ({ src }: { src?: string }) => (
    <img data-testid="logo" src={src ?? ""} alt="team logo" />
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

const baseMatch: LiveMatch = {
  id: 7,
  homeTeamName: "Arsenal",
  awayTeamName: "Chelsea",
  homeTeamId: 1,
  awayTeamId: 2,
  homeTeamLogo: "arsenal.png",
  awayTeamLogo: "chelsea.png",
  homeTeamScore: 2,
  awayTeamScore: 1,
  elapsedTime: 45,
  leagueName: "Premier League",
  leagueId: 39,
  statusShort: "1H",
  statusLong: "First Half",
  matchDate: "2025-10-11T15:00:00Z",
  events: [],
  polls: [],
  homeAwayForm: {
    homeForm: [],
    awayForm: [],
    isHomeHot: false,
    isHomeCold: false,
    isAwayHot: false,
    isAwayCold: false,
    isDisplayable: false,
  },
};

describe("LiveMatchCard", () => {
  it("renders both team names and logos", () => {
    render(
      <MemoryRouter>
        <LiveMatchCard
          match={baseMatch}
          selectedMatchId={null}
          selectMatch={vi.fn()}
          apiService={mockApiService}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText("Arsenal")).toBeInTheDocument();
    expect(screen.getByText("Chelsea")).toBeInTheDocument();

    const logos = screen.getAllByTestId("logo");
    expect(logos).toHaveLength(2);
    expect(logos[0]).toHaveAttribute("src", "arsenal.png");
    expect(logos[1]).toHaveAttribute("src", "chelsea.png");
  });

  it("renders the score", () => {
    render(
      <MemoryRouter>
        <LiveMatchCard
          match={baseMatch}
          selectedMatchId={null}
          selectMatch={vi.fn()}
          apiService={mockApiService}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText("2 - 1")).toBeInTheDocument();
  });

  it("renders the elapsed minute when present", () => {
    render(
      <MemoryRouter>
        <LiveMatchCard
          match={baseMatch}
          selectedMatchId={null}
          selectMatch={vi.fn()}
          apiService={mockApiService}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText("45'")).toBeInTheDocument();
  });

  it("renders a dash when elapsed time is not present", () => {
    render(
      <MemoryRouter>
        <LiveMatchCard
          match={{ ...baseMatch, elapsedTime: undefined }}
          selectedMatchId={null}
          selectMatch={vi.fn()}
          apiService={mockApiService}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("renders the Details link for the match", () => {
    render(
      <MemoryRouter>
        <LiveMatchCard
          match={baseMatch}
          selectedMatchId={null}
          selectMatch={vi.fn()}
          apiService={mockApiService}
        />
      </MemoryRouter>,
    );

    expect(
      screen.getByTestId("match-details-link").closest("a"),
    ).toHaveAttribute("href", "/match/7");
  });

  it("calls selectMatch with the match id when clicked", () => {
    const selectMatch = vi.fn();

    render(
      <MemoryRouter>
        <LiveMatchCard
          match={baseMatch}
          selectedMatchId={null}
          selectMatch={selectMatch}
          apiService={mockApiService}
        />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText("Arsenal"));

    expect(selectMatch).toHaveBeenCalledWith(7);
  });

  it("renders a chart link when the match is charteable", () => {
    vi.mocked(useCharteableMatchNow).mockReturnValue({
      isCharteableMatchNow: true,
      loadingCharteableMatchNow: false,
    });

    render(
      <MemoryRouter>
        <LiveMatchCard
          match={baseMatch}
          selectedMatchId={null}
          selectMatch={vi.fn()}
          apiService={mockApiService}
        />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("chart-link")).toHaveAttribute(
      "href",
      "/charts/7",
    );
  });

  it("does not render a chart link when the match is not charteable", () => {
    vi.mocked(useCharteableMatchNow).mockReturnValue({
      isCharteableMatchNow: false,
      loadingCharteableMatchNow: false,
    });

    render(
      <MemoryRouter>
        <LiveMatchCard
          match={baseMatch}
          selectedMatchId={null}
          selectMatch={vi.fn()}
          apiService={mockApiService}
        />
      </MemoryRouter>,
    );

    expect(screen.queryByTestId("chart-link")).not.toBeInTheDocument();
  });

  it("renders a top guys link when the fixture has a today-players watchlist", () => {
    vi.mocked(useTopGuysAvailable).mockReturnValue({
      isTopGuysAvailable: true,
      loadingTopGuysAvailable: false,
    });

    render(
      <MemoryRouter>
        <LiveMatchCard
          match={baseMatch}
          selectedMatchId={null}
          selectMatch={vi.fn()}
          apiService={mockApiService}
        />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("top-guys-link")).toHaveAttribute(
      "href",
      "/today-players/7",
    );
  });

  it("does not render a top guys link when the fixture has no today-players watchlist", () => {
    vi.mocked(useTopGuysAvailable).mockReturnValue({
      isTopGuysAvailable: false,
      loadingTopGuysAvailable: false,
    });

    render(
      <MemoryRouter>
        <LiveMatchCard
          match={baseMatch}
          selectedMatchId={null}
          selectMatch={vi.fn()}
          apiService={mockApiService}
        />
      </MemoryRouter>,
    );

    expect(screen.queryByTestId("top-guys-link")).not.toBeInTheDocument();
  });
});
