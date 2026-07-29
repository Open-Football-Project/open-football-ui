/// <reference types="@testing-library/jest-dom" />
import { describe, it, expect, vi } from "vitest";
import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MatchCard from "./MatchCard";

vi.mock("../../general/logo/Logo", () => ({
  default: ({ src }: { src?: string | null }) => (
    <img data-testid="logo" src={src ?? ""} alt="team logo" />
  ),
}));

vi.mock("@matchinsights/core", async () => {
  const actual = await vi.importActual("@matchinsights/core");
  return {
    ...actual,
    getFormattedDate: vi.fn(() => "21/10"),
    getFormattedTime: vi.fn(() => "12:00"),
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

import {
  ApiService,
  useCharteableMatchNow,
  useTopGuysAvailable,
} from "@matchinsights/core";

const mockApiService = {} as unknown as ApiService;

const baseMatch = {
  fixtureId: 42,
  homeTeamName: "Arsenal",
  awayTeamName: "Chelsea",
  homeTeamLogo: "arsenal.png",
  awayTeamLogo: "chelsea.png",
  homeTeamScore: 2,
  awayTeamScore: 1,
  isFinished: false,
  date: "2025-10-11T15:00:00Z",
  statusShort: "NS",
  isLiveNow: false,
};

describe("MatchCard", () => {
  it("renders both team names", () => {
    render(
      <MemoryRouter>
        <MatchCard match={baseMatch} apiService={mockApiService} />
      </MemoryRouter>,
    );

    expect(screen.getByText("Arsenal")).toBeInTheDocument();
    expect(screen.getByText("Chelsea")).toBeInTheDocument();
  });

  it("renders both team logos", () => {
    render(
      <MemoryRouter>
        <MatchCard match={baseMatch} apiService={mockApiService} />
      </MemoryRouter>,
    );

    const logos = screen.getAllByTestId("logo");
    expect(logos).toHaveLength(2);
    expect(logos[0]).toHaveAttribute("src", "arsenal.png");
    expect(logos[1]).toHaveAttribute("src", "chelsea.png");
  });

  it("shows the score when the match is finished", () => {
    render(
      <MemoryRouter>
        <MatchCard
          match={{ ...baseMatch, isFinished: true }}
          apiService={mockApiService}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText("2 - 1")).toBeInTheDocument();
  });

  it("shows a dash instead of a score when the match is not finished", () => {
    render(
      <MemoryRouter>
        <MatchCard match={baseMatch} apiService={mockApiService} />
      </MemoryRouter>,
    );

    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("renders a Details link for a non-live match", () => {
    render(
      <MemoryRouter>
        <MatchCard match={baseMatch} apiService={mockApiService} />
      </MemoryRouter>,
    );

    expect(
      screen.getByTestId("match-details-link").closest("a"),
    ).toHaveAttribute("href", "/match/42");
  });

  it("renders a Live link for a live match", () => {
    render(
      <MemoryRouter>
        <MatchCard
          match={{ ...baseMatch, isLiveNow: true }}
          apiService={mockApiService}
        />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("live-now-link").closest("a")).toHaveAttribute(
      "href",
      "/live/42",
    );
  });

  it("renders the date and time stacked vertically in the left column", () => {
    render(
      <MemoryRouter>
        <MatchCard match={baseMatch} apiService={mockApiService} />
      </MemoryRouter>,
    );

    const status = screen.getByTestId("match-status");
    expect(status).toHaveClass("flex-col");
    expect(status).not.toHaveClass("flex-row");
  });

  it("forwards ref to the focusable match button element", () => {
    const ref = createRef<HTMLAnchorElement>();

    render(
      <MemoryRouter>
        <MatchCard match={baseMatch} apiService={mockApiService} ref={ref} />
      </MemoryRouter>,
    );

    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe("A");
  });

  it("renders a chart link when the match is charteable", () => {
    vi.mocked(useCharteableMatchNow).mockReturnValue({
      isCharteableMatchNow: true,
      loadingCharteableMatchNow: false,
    });

    render(
      <MemoryRouter>
        <MatchCard match={baseMatch} apiService={mockApiService} />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("chart-link")).toHaveAttribute(
      "href",
      "/charts/42",
    );
  });

  it("does not render a chart link when the match is not charteable", () => {
    vi.mocked(useCharteableMatchNow).mockReturnValue({
      isCharteableMatchNow: false,
      loadingCharteableMatchNow: false,
    });

    render(
      <MemoryRouter>
        <MatchCard match={baseMatch} apiService={mockApiService} />
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
        <MatchCard match={baseMatch} apiService={mockApiService} />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("top-guys-link")).toHaveAttribute(
      "href",
      "/today-players/42",
    );
  });

  it("does not render a top guys link when the fixture has no today-players watchlist", () => {
    vi.mocked(useTopGuysAvailable).mockReturnValue({
      isTopGuysAvailable: false,
      loadingTopGuysAvailable: false,
    });

    render(
      <MemoryRouter>
        <MatchCard match={baseMatch} apiService={mockApiService} />
      </MemoryRouter>,
    );

    expect(screen.queryByTestId("top-guys-link")).not.toBeInTheDocument();
  });
});
