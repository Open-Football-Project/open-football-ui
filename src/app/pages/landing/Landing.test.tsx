import { describe, it, expect, vi, Mock, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Landing from "./Landing";
import { BannerProps } from "../../common-props/BannerProps";
import { useTodayMatches } from "open-football-project-core";
import { DayMatches } from "open-football-project-core";

vi.mock("../../main/seo/Seo", () => {
  return {
    default: ({ children }: any) => <>{children}</>,
  };
});

vi.mock("../../components/news/NewsSlider", () => ({
  default: ({ items }: { items: any[] }) => (
    <div data-testid="news-slider">{items.join(",")}</div>
  ),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "en" },
  }),
}));

vi.mock("open-football-project-core", async () => {
  const actual = await vi.importActual("open-football-project-core");
  return {
    ...actual,
    useNewsInfo: vi.fn(() => ({
      isPlayerNewsAvailable: true,
      news: [
        {
          title:
            "Pablo Durán y Borja Iglesias, listos para reaparecer ante el Valencia",
          url: "https://www.marca.com/futbol/celta/2026/01/01/pablo-duran-borja-iglesias-listos-reaparecer-valencia.html",
          description:
            "El fantasma de la temporada 2028/19 se apodera del entorno viendo a su equipo incapaz de mejorar",
          image:
            "https://objetos-xlk.estaticos-marca.com/files/og_thumbnail/uploads/2025/11/16/691998c47b1bf.jpeg",
          source: "https://www.marca.com/rss/futbol.xml",
        },
        {
          title: "Mercado de fichajes de invierno: altas, bajas y rumores",
          url: "https://www.marca.com/futbol/primera-division/2025/12/29/mercado-fichajes-invierno-2026-laliga-ea-sports-altas-bajas-rumores.html",
          description:
            "El Betis resistió ante el líder, se pone quinto provisional de LaLiga y sueña con la Champions",
          image:
            "https://objetos-xlk.estaticos-marca.com/files/og_thumbnail/uploads/2025/12/29/6952a22fe4121.jpeg",
          source: "https://www.marca.com/rss/futbol.xml",
        },
      ],
    })),
    useTodayMatches: vi.fn(),
  };
});

vi.mock("../../components/general/banners/global-banners/GlobalBanners", () => ({
  default: () => null,
}));

vi.mock("../../components/general/banners/country-banners/CountryBanners", () => ({
  default: () => null,
}));

const mockApiService = {
  chartsService: {
    fetchFixtureIndicators: vi.fn().mockResolvedValue({}),
    fetchOddsFixtures: vi.fn().mockResolvedValue([]),
  },
  playerService: {
    fetchTodayPlayersFixtureIds: vi.fn().mockResolvedValue([]),
  },
} as any;

const bannerProps: BannerProps = {
  bannersService: { bannersManager: vi.fn() } as any,
  storage: {} as any,
  countryApiHost: "http://localhost",
};

const mockLeagueMatches: DayMatches[] = [
  {
    leagueId: 39,
    leagueName: "Premier League",
    leagueLogo: "premier.png",
    matches: [
      {
        fixtureId: 101,
        homeTeamId: 1,
        awayTeamId: 2,
        homeTeamName: "Arsenal",
        awayTeamName: "Chelsea",
        date: new Date().toISOString(),
        isFinished: false,
        statusShort: "NS",
        statusLong: "Not Started",
        isLiveNow: false,
      },
    ],
  },
  {
    leagueId: 140,
    leagueName: "La Liga",
    leagueLogo: "laliga.png",
    matches: [
      {
        fixtureId: 201,
        homeTeamId: 3,
        awayTeamId: 4,
        homeTeamName: "Barcelona",
        awayTeamName: "Real Madrid",
        date: new Date().toISOString(),
        isFinished: false,
        statusShort: "NS",
        statusLong: "Not Started",
        isLiveNow: false,
      },
    ],
  },
];

const renderLanding = () =>
  render(
    <MemoryRouter>
      <Landing apiService={mockApiService} bannerProps={bannerProps} />
    </MemoryRouter>,
  );

describe("Landing Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useTodayMatches as unknown as Mock).mockReturnValue({
      loadingMatches: false,
      leagueMatches: mockLeagueMatches,
      isLeagueMatchesAvailable: true,
    });
  });

  it("renders today's players link", () => {
    renderLanding();
    const link = screen.getByTestId("today-players-link");
    expect(link).toBeDefined();
    expect(link.getAttribute("href")).toBe("/today-players");
  });

  it("renders the hero section", () => {
    renderLanding();
    expect(screen.getByTestId("hero-section")).toBeDefined();
  });

  it("renders the today matches section", () => {
    renderLanding();
    expect(screen.getByTestId("today-matches")).toBeDefined();
  });

  it("renders the CTA section", () => {
    renderLanding();
    expect(screen.getByTestId("cta-section")).toBeDefined();
  });

  it("renders the news slider", () => {
    renderLanding();
    const slider = screen.getByTestId("news-slider");
    expect(slider).toBeInTheDocument();
  });

  it("renders the Play Store button in the CTA section", () => {
    renderLanding();
    const playStoreLink = screen.getByTestId("play-store-link");
    expect(playStoreLink).toBeDefined();
    expect(playStoreLink.getAttribute("href")).toBe(
      "https://play.google.com/store/apps/details?id=com.futballero",
    );
  });

  it("renders the charts link in the CTA section", () => {
    renderLanding();
    const chartsLink = screen.getByTestId("charts-link");
    expect(chartsLink).toBeDefined();
    expect(chartsLink.getAttribute("href")).toBe("/charts");
  });

  it("shows loading skeleton while matches are being fetched", () => {
    (useTodayMatches as unknown as Mock).mockReturnValue({
      loadingMatches: true,
      leagueMatches: [],
      isLeagueMatchesAvailable: false,
    });
    renderLanding();
    expect(screen.getByTestId("today-matches")).toBeDefined();
    expect(screen.queryByText("Arsenal")).toBeNull();
  });

  it("shows no-data message when no matches are available", () => {
    (useTodayMatches as unknown as Mock).mockReturnValue({
      loadingMatches: false,
      leagueMatches: [],
      isLeagueMatchesAvailable: false,
    });
    renderLanding();
    expect(screen.getByText("matches.nodatamsg")).toBeInTheDocument();
  });

  it("renders MatchesGrid with today's matches when available", () => {
    renderLanding();
    expect(screen.getByText("Arsenal")).toBeInTheDocument();
    expect(screen.getByText("Barcelona")).toBeInTheDocument();
  });

  it("renders the today matches heading", () => {
    renderLanding();
    expect(screen.getByText("home.todaymatches")).toBeInTheDocument();
  });
});
