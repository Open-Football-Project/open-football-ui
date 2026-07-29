import { ReactNode } from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import LeagueKnockoutPage from "./LeagueKnockoutPage";
import { ApiService, LeagueFixture, LeagueInfo, useLeaguePage } from "@matchinsights/core";
import { BannerProps } from "../../../common-props/BannerProps";

type LeaguePageResult = ReturnType<typeof useLeaguePage>;
type LeaguePageOverrides = Partial<LeaguePageResult>;

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom"
  );

  return {
    ...actual,
    useParams: () => ({ leagueId: "123" }),
  };
});

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, opts?: { defaultValue?: string }) => opts?.defaultValue ?? key,
  }),
}));

vi.mock("@matchinsights/core", async () => {
  const actual = await vi.importActual("@matchinsights/core");
  return {
    ...actual,
    useLeaguePage: vi.fn(),
  };
});

vi.mock("../../../components/general/sub-header/SubHeader", () => ({
  default: ({ title }: { title: string }) => <div data-testid="subheader">{title}</div>,
}));

vi.mock("../../../components/league/knockout/bracket-tree/KnockoutBracketSection", () => ({
  default: ({ leagueName }: { fixtures: unknown; leagueName: string }) => (
    <div data-testid="knockout-bracket-section">{leagueName}</div>
  ),
}));

vi.mock("../../../main/seo/Seo", () => ({
  default: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

vi.mock("../../../main/seo/league-metadata", () => ({
  default: () => ({}),
}));

const mockApiService = {} as ApiService;
const bannerProps: BannerProps = {
  bannersService: {} as BannerProps["bannersService"],
  storage: {} as BannerProps["storage"],
  countryApiHost: "http://localhost",
};

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={["/league/123"]}>
      <Routes>
        <Route
          path="/league/:leagueId"
          element={
            <LeagueKnockoutPage
              apiService={mockApiService}
              bannerProps={bannerProps}
            />
          }
        />
      </Routes>
    </MemoryRouter>
  );

const mockUseLeaguePage = (overrides: LeaguePageOverrides = {}) => {
  vi.mocked(useLeaguePage).mockReturnValue({
    fixtures: undefined,
    leagueInfo: {
      name: "Champions League",
      logo: "logo.png",
      country: "Spain",
    },
    loadingFixtures: false,
    isLeaguefixturesAvailable: true,
    hasKnockoutPhase: false,
    leagueLinks: [],
    ...overrides,
  } as LeaguePageResult);
};

describe("LeagueKnockoutPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders fallback header when league name is missing", () => {
    mockUseLeaguePage({
      leagueInfo: { name: "Unknown League" } as LeagueInfo,
    });

    renderPage();

    expect(screen.getByTestId("subheader")).toHaveTextContent(
      "knockout.header"
    );
  });

  it("renders league name when available", () => {
    mockUseLeaguePage({
      leagueInfo: { name: "Copa Libertadores" } as LeagueInfo,
    });

    renderPage();

    expect(screen.getByTestId("subheader")).toHaveTextContent(
      "Copa Libertadores"
    );
  });

  it("shows NOT knockout message when no knockout rounds exist", () => {
    mockUseLeaguePage({
      hasKnockoutPhase: false,
      isLeaguefixturesAvailable: true,
      fixtures: {
        rounds: [
          {
            name: "Regular Season",
            days: [],
          },
        ],
      } as unknown as LeagueFixture,
    });

    renderPage();

    expect(screen.getByText("nodata.default")).toBeInTheDocument();
  });

  const withKnockoutFixtures: LeaguePageOverrides = {
    hasKnockoutPhase: true,
    isLeaguefixturesAvailable: true,
    fixtures: {
      rounds: [
        {
          name: "Quarter-finals",
          days: [
            {
              date: "2024-01-01",
              matches: [
                {
                  fixtureId: 1,
                  homeTeamId: 1,
                  awayTeamId: 2,
                  homeTeamName: "A",
                  awayTeamName: "B",
                  date: "2024-01-01",
                  isFinished: false,
                  statusShort: "NS",
                  statusLong: "Not Started",
                  isLiveNow: false,
                },
              ],
            },
          ],
        },
      ],
    } as unknown as LeagueFixture,
  };

  it("renders KnockoutBracketSection with the league name when knockout rounds exist", () => {
    mockUseLeaguePage(withKnockoutFixtures);

    renderPage();

    expect(screen.getByTestId("knockout-bracket-section")).toHaveTextContent(
      "Champions League"
    );
  });

  it("does not render KnockoutBracketSection while loading", () => {
    mockUseLeaguePage({
      loadingFixtures: true,
    });

    renderPage();

    expect(screen.queryByTestId("knockout-bracket-section")).not.toBeInTheDocument();
  });

  it("does not render KnockoutBracketSection when fixtures are unavailable", () => {
    mockUseLeaguePage({
      isLeaguefixturesAvailable: false,
    });

    renderPage();

    expect(screen.queryByTestId("knockout-bracket-section")).not.toBeInTheDocument();
  });
});
