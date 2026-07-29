/// <reference types="@testing-library/jest-dom" />
import { describe, it, beforeEach, vi, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import MatchDetailComponent from "./MatchDetail";
import { BannerProps } from "../../common-props/BannerProps";

const mocks = vi.hoisted(() => ({
  useMatchDetail: vi.fn(),
  useHeadToHead: vi.fn(),
  useValueBets: vi.fn(),
  isUTCDateTodayLocal: vi.fn(),
  isUTCDateInFutureLocal: vi.fn(),
  seo: vi.fn(({ children }: any) => <>{children}</>),
}));

vi.mock("../../main/seo/Seo", () => ({
  default: (props: any) => mocks.seo(props),
}));

vi.mock("../../main/seo/breadcrumb/Breadcrumb", () => ({
  default: () => null,
}));

vi.mock("../../components/general/video-content/VideoContentComponent", () => ({
  default: ({ videos }: any) => (
    <div data-testid="video-content">{videos.map((v: any) => v.label).join(", ")}</div>
  ),
}));

vi.mock("../../components/general/banners/country-banners/CountryBanners", () => ({
  default: () => null,
}));

vi.mock("../../components/general/no-data/NoData", () => ({
  default: ({ loading, message }: any) => (
    <div data-testid="no-data">
      {loading ? "Loading" : message || "No Data"}
    </div>
  ),
}));

vi.mock("../../components/general/sub-header/SubHeader", () => ({
  default: () => <div data-testid="sub-header">SubHeader</div>,
}));

vi.mock(
  "../../components/match/match-details/details-main-info/DetailsMainInfo",
  () => ({
    DetailsMainInfo: () => (
      <div data-testid="details-main-info">DetailsMainInfo</div>
    ),
  })
);

vi.mock(
  "../../components/match/match-details/match-details-second-row/MatchDetailsSecondRow",
  () => ({
    MatchDetailsSecondRow: () => (
      <div data-testid="second-row-component">SecondRow</div>
    ),
  })
);

vi.mock(
  "../../components/match/match-details/match-details-third-row/MatchDetailsThirdRow",
  () => ({
    default: () => <div data-testid="third-row-component">ThirdRow</div>,
  })
);

vi.mock("../../components/match/match-detail-tabs/MatchDetailsTabs", () => ({
  default: () => <div data-testid="match-details-tabs">MatchDetailsTabs</div>,
}));

vi.mock(
  "../../components/match/match-details/value-bets/wrapper/BettingToolWrapper",
  () => ({
    default: () => <div data-testid="betting-tool-wrapper">BettingToolWrapper</div>,
  })
);

vi.mock(
  "../../components/match/match-details/match-indicators/MatchIndicators",
  () => ({
    MatchIndicators: () => <div data-testid="match-indicators">Indicators</div>,
  })
);

vi.mock("@matchinsights/core", async () => {
  const actual = await vi.importActual<typeof import("@matchinsights/core")>(
    "@matchinsights/core"
  );

  return {
    ...actual,
    useMatchDetail: mocks.useMatchDetail,
    useHeadToHead: mocks.useHeadToHead,
    useValueBets: mocks.useValueBets,
    isUTCDateTodayLocal: mocks.isUTCDateTodayLocal,
    isUTCDateInFutureLocal: mocks.isUTCDateInFutureLocal,
  };
});

import { MatchDetails } from "@matchinsights/core";

const mockApiService = {};

const mockMatchDetail: MatchDetails = {
  id: 1,
  homeTeam: { id: 10, name: "HomeTeam" },
  awayTeam: { id: 20, name: "AwayTeam" },
  date: "2025-10-27",
  venue: { name: "Stadium A" },
  league: { id: 5, name: "Premier League", season: 2025 },
  goals: { away: 1, home: 2 },
  score: { fulltime: { away: 1, home: 2 }, halftime: { home: 1, away: 1 } },
  statusLong: "Finished",
  isLiveNow: false,
  statusShort: "FT",
};

describe("MatchDetail Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.useMatchDetail.mockReturnValue({
      loadingMatchDetail: false,
      matchDetail: null,
      isMatcheDetailAvalable: false,
      isLineupsAvailable: false,
      isStatsAvailable: false,
      isEventsAvailable: false,
      isOddsAvailable: false,
      odds: [],
      loadingOdds: false,
    });

    mocks.useHeadToHead.mockReturnValue({
      h2hDetails: [],
      loadingH2hDetail: false,
      isHead2HeadAvailable: false,
    });

    mocks.useValueBets.mockReturnValue({
      valueBets: { markets: [] },
      loadingValueBets: false,
      isValueBetsAvailable: false,
    });

    mocks.isUTCDateTodayLocal.mockReturnValue(false);
    mocks.isUTCDateInFutureLocal.mockReturnValue(false);
  });

  const bannerProps: BannerProps = {
    bannersService: {} as any,
    storage: {} as any,
    countryApiHost: "http://localhost",
  };

  const renderComponent = () =>
    render(
      <MemoryRouter initialEntries={["/match/1"]}>
        <Routes>
          <Route
            path="/match/:id"
            element={
              <MatchDetailComponent
                apiService={mockApiService}
                bannerProps={bannerProps}
              />
            }
          />
        </Routes>
      </MemoryRouter>
    );

  it("renders loading state initially", () => {
    mocks.useMatchDetail.mockReturnValue({
      loadingMatchDetail: true,
      matchDetail: null,
      isMatcheDetailAvalable: false,
    });

    renderComponent();

    expect(screen.getByTestId("no-data")).toHaveTextContent("Loading");
  });

  it("renders 'not available' state when matchDetail is null", async () => {
    mocks.useMatchDetail.mockReturnValue({
      loadingMatchDetail: false,
      matchDetail: null,
      isMatcheDetailAvalable: false,
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/No Data/i)).toBeInTheDocument();
    });
  });

  it("renders match details when data is returned", async () => {
    mocks.useMatchDetail.mockReturnValue({
      loadingMatchDetail: false,
      matchDetail: mockMatchDetail,
      isMatcheDetailAvalable: true,
      isLineupsAvailable: false,
      isStatsAvailable: false,
      isEventsAvailable: false,
      isLiveNow: false,
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId("details-main-info")).toBeInTheDocument();
      expect(screen.getByTestId("second-row-component")).toBeInTheDocument();
    });
  });

  it("renders MatchDetailsTabs when stats or events exist", async () => {
    mocks.useMatchDetail.mockReturnValue({
      loadingMatchDetail: false,
      matchDetail: mockMatchDetail,
      isMatcheDetailAvalable: true,
      isLineupsAvailable: true,
      isStatsAvailable: true,
      isEventsAvailable: true,
      isLiveNow: false,
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId("match-details-tabs")).toBeInTheDocument();
    });
  });

  it("renders BettingToolWrapper when value bets are available and date is in the future", async () => {
    mocks.useMatchDetail.mockReturnValue({
      loadingMatchDetail: false,
      matchDetail: mockMatchDetail,
      isMatcheDetailAvalable: true,
    });

    mocks.useValueBets.mockReturnValue({
      valueBets: { markets: [{ betName: "Match Winner", fairOdds: [], bookmakers: [] }] },
      loadingValueBets: false,
      isValueBetsAvailable: true,
    });

    mocks.isUTCDateInFutureLocal.mockReturnValue(true);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId("betting-tool-wrapper")).toBeInTheDocument();
    });
  });

  it("renders third row when H2H data is available", async () => {
    mocks.useMatchDetail.mockReturnValue({
      loadingMatchDetail: false,
      matchDetail: mockMatchDetail,
      isMatcheDetailAvalable: true,
    });

    mocks.useHeadToHead.mockReturnValue({
      h2hDetails: [{}],
      loadingH2hDetail: false,
      isHead2HeadAvailable: true,
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId("third-row-component")).toBeInTheDocument();
    });
  });

  it("renders third row even when H2H is loading", async () => {
    mocks.useMatchDetail.mockReturnValue({
      loadingMatchDetail: false,
      matchDetail: mockMatchDetail,
      isMatcheDetailAvalable: true,
    });

    mocks.useHeadToHead.mockReturnValue({
      h2hDetails: [],
      loadingH2hDetail: true,
      isHead2HeadAvailable: true,
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId("third-row-component")).toBeInTheDocument();
    });
  });

  it("renders MatchIndicators when date is today", async () => {
    mocks.useMatchDetail.mockReturnValue({
      loadingMatchDetail: false,
      matchDetail: mockMatchDetail,
      isMatcheDetailAvalable: true,
    });

    mocks.isUTCDateTodayLocal.mockReturnValue(true);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId("match-indicators")).toBeInTheDocument();
    });
  });

  it("renders video content when match has videos", async () => {
    mocks.useMatchDetail.mockReturnValue({
      loadingMatchDetail: false,
      matchDetail: {
        ...mockMatchDetail,
        videos: [{ url: "https://youtube.com/embed/abc", label: "Match Highlights" }],
      },
      isMatcheDetailAvalable: true,
      isLineupsAvailable: false,
      isStatsAvailable: false,
      isEventsAvailable: false,
      isLiveNow: false,
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId("video-content")).toHaveTextContent("Match Highlights");
    });
  });

  it("does not render video content when match has no videos", async () => {
    mocks.useMatchDetail.mockReturnValue({
      loadingMatchDetail: false,
      matchDetail: mockMatchDetail,
      isMatcheDetailAvalable: true,
      isLineupsAvailable: false,
      isStatsAvailable: false,
      isEventsAvailable: false,
      isLiveNow: false,
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.queryByTestId("video-content")).not.toBeInTheDocument();
    });
  });
});

describe("MatchDetail, Seo in empty states", () => {
  const bannerProps: BannerProps = {
    bannersService: {} as any,
    storage: {} as any,
    countryApiHost: "http://localhost",
  };

  const renderComponent = () =>
    render(
      <MemoryRouter initialEntries={["/match/1"]}>
        <Routes>
          <Route path="/match/:id" element={<MatchDetailComponent apiService={mockApiService as any} bannerProps={bannerProps} />} />
        </Routes>
      </MemoryRouter>
    );

  beforeEach(() => {
    mocks.seo.mockClear();
    mocks.useHeadToHead.mockReturnValue({ h2hDetails: [], loadingH2hDetail: false, isHead2HeadAvailable: false });
    mocks.useValueBets.mockReturnValue({ valueBets: { markets: [] }, loadingValueBets: false, isValueBetsAvailable: false });
    mocks.isUTCDateTodayLocal.mockReturnValue(false);
    mocks.isUTCDateInFutureLocal.mockReturnValue(false);
  });

  it("renders Seo with noindex when match data is not available", () => {
    mocks.useMatchDetail.mockReturnValue({
      loadingMatchDetail: false,
      matchDetail: null,
      isMatcheDetailAvalable: false,
      isLineupsAvailable: false,
      isStatsAvailable: false,
      isEventsAvailable: false,
    });

    renderComponent();

    expect(mocks.seo.mock.calls[0][0]).toMatchObject({ robots: "noindex, nofollow" });
  });

  it("renders Seo with noindex while match data is loading", () => {
    mocks.useMatchDetail.mockReturnValue({
      loadingMatchDetail: true,
      matchDetail: null,
      isMatcheDetailAvalable: false,
      isLineupsAvailable: false,
      isStatsAvailable: false,
      isEventsAvailable: false,
    });

    renderComponent();

    expect(mocks.seo.mock.calls[0][0]).toMatchObject({ robots: "noindex, nofollow" });
  });
});
