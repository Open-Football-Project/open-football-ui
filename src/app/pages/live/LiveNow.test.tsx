import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import LiveNow from "./LiveNow";
import { BannerProps } from "../../common-props/BannerProps";

const mocks = vi.hoisted(() => ({
  useLiveNowStatus: vi.fn(),
  seo: vi.fn(({ children }: any) => <>{children}</>),
}));

vi.mock("open-football-project-core", async () => {
  const actual = await vi.importActual("open-football-project-core");
  return {
    ...actual,
    useLiveNowStatus: mocks.useLiveNowStatus,
  };
});

vi.mock("../../components/general/sub-header/SubHeader", () => ({
  default: ({ title }: { title: string }) => (
    <div data-testid="subheader">{title}</div>
  ),
}));

vi.mock("../../components/general/no-data/NoData", () => ({
  default: ({ loading, image, imageAlt }: { loading?: boolean; image?: string; imageAlt?: string }) => (
    <div data-testid="nodata">
      No data-{loading ? "loading" : "not-loading"}-{image ?? "no-image"}-{imageAlt ?? "no-alt"}
    </div>
  ),
}));

vi.mock("../../components/general/controls/Controls", () => ({
  default: (props: any) => (
    <div data-testid="controls">
      <button onClick={() => props.setDrop0("France")}>Change Country</button>
      <button onClick={() => props.setDrop1("123")}>Change League</button>
    </div>
  ),
}));

vi.mock("../../components/general/logo/Logo", () => ({
  default: ({ src }: { src: string }) => (
    <img data-testid="logo" alt="logo" src={src} />
  ),
}));

vi.mock("../../components/live-matches/LiveMatches", () => ({
  LiveMatches: ({ matches }: { matches: any[] }) => (
    <div data-testid="live-matches">Live Matches ({matches.length})</div>
  ),
}));

vi.mock("../../main/seo/Seo", () => ({
  default: (props: any) => mocks.seo(props),
}));

describe("LiveNow Component", () => {
  const mockApiService = {} as any;
  const bannerProps: BannerProps = {
    bannersService: {} as any,
    storage: {} as any,
    countryApiHost: "http://localhost",
  };

  it("renders NoData when there are no leagues", () => {
    mocks.useLiveNowStatus.mockReturnValue({
      selectedCountry: null,
      setSelectedCountry: vi.fn(),
      selectedLeagueId: null,
      setSelectedLeagueId: vi.fn(),
      countries: [],
      leagues: [],
      selectedLeague: null,
      selectedLeagueMatches: [],
    });

    render(<LiveNow apiService={mockApiService} bannerProps={bannerProps} />);

    expect(screen.getByTestId("subheader")).toHaveTextContent(
      "livepage.subheadertitle"
    );
    expect(screen.getByTestId("nodata")).toHaveTextContent("loading");
    expect(screen.getByTestId("nodata").textContent).not.toContain("no-image");
  });

  it("renders Controls and message when leagues exist but no league selected", () => {
    mocks.useLiveNowStatus.mockReturnValue({
      selectedCountry: "England",
      setSelectedCountry: vi.fn(),
      selectedLeagueId: null,
      setSelectedLeagueId: vi.fn(),
      countries: ["England", "France"],
      leagues: [
        { leagueId: 1, leagueName: "Premier Lg." },
        { leagueId: 2, leagueName: "La Liga" },
      ],
      selectedLeague: null,
      selectedLeagueMatches: [],
    });

    render(<LiveNow apiService={mockApiService} bannerProps={bannerProps} />);

    expect(screen.getByTestId("controls")).toBeInTheDocument();
    expect(
      screen.getByText(/Select a league to view matches/i)
    ).toBeInTheDocument();
  });

  it("renders selected league info and LiveMatches when a league is selected", () => {
    mocks.useLiveNowStatus.mockReturnValue({
      selectedCountry: "England",
      setSelectedCountry: vi.fn(),
      selectedLeagueId: 1,
      setSelectedLeagueId: vi.fn(),
      countries: ["England"],
      leagues: [
        {
          leagueId: 1,
          leagueName: "Premier League",
          leagueLogo: "logo.png",
          leagueCountry: "England",
        },
      ],
      selectedLeague: {
        leagueId: 1,
        leagueName: "Premier League",
        leagueLogo: "logo.png",
        leagueCountry: "England",
      },
      selectedLeagueMatches: [{ id: 1, home: "Team A", away: "Team B" }],
    });

    render(<LiveNow apiService={mockApiService} bannerProps={bannerProps} />);

    expect(screen.getByTestId("logo")).toHaveAttribute("src", "logo.png");
    expect(screen.getByText("Premier Lg.")).toBeInTheDocument();
    expect(screen.getByText("England")).toBeInTheDocument();
    expect(screen.getByTestId("live-matches")).toHaveTextContent(
      "Live Matches (1)"
    );
  });

  it("calls setSelectedCountry and setSelectedLeagueId when dropdowns change", () => {
    const mockSetCountry = vi.fn();
    const mockSetLeagueId = vi.fn();

    mocks.useLiveNowStatus.mockReturnValue({
      selectedCountry: "England",
      setSelectedCountry: mockSetCountry,
      selectedLeagueId: null,
      setSelectedLeagueId: mockSetLeagueId,
      countries: ["England", "France"],
      leagues: [
        { leagueId: 1, leagueName: "Premier League" },
        { leagueId: 2, leagueName: "La Liga" },
      ],
      selectedLeague: null,
      selectedLeagueMatches: [],
    });

    render(<LiveNow apiService={mockApiService} bannerProps={bannerProps} />);

    fireEvent.click(screen.getByText("Change Country"));
    fireEvent.click(screen.getByText("Change League"));

    expect(mockSetCountry).toHaveBeenCalledWith("France");
    expect(mockSetLeagueId).toHaveBeenCalledWith(123);
  });

  it("passes fixtureId from route params to useLiveNowStatus and LiveMatches", () => {
    const mockUseLiveNowStatus = vi.fn().mockReturnValue({
      selectedCountry: "England",
      setSelectedCountry: vi.fn(),
      selectedLeagueId: 1,
      setSelectedLeagueId: vi.fn(),
      countries: ["England"],
      leagues: [
        {
          leagueId: 1,
          leagueName: "Premier League",
          leagueLogo: "logo.png",
          leagueCountry: "England",
        },
      ],
      selectedLeague: {
        leagueId: 1,
        leagueName: "Premier League",
        leagueLogo: "logo.png",
        leagueCountry: "England",
      },
      selectedLeagueMatches: [{ id: 1 }],
    });

    mocks.useLiveNowStatus.mockImplementation(mockUseLiveNowStatus);

    render(
      <MemoryRouter initialEntries={["/1234"]}>
        <Routes>
          <Route path="/:fixtureId" element={<LiveNow apiService={{}} bannerProps={bannerProps} />} />
        </Routes>
      </MemoryRouter>
    );

    expect(mockUseLiveNowStatus).toHaveBeenCalledWith(
      "https://futballero.com",
      "0",
      "1234"
    );

    expect(screen.getByTestId("live-matches")).toBeInTheDocument();
    expect(screen.getByTestId("live-matches")).toHaveTextContent(
      "Live Matches (1)"
    );
  });
});

describe("LiveNow, Seo in empty state", () => {
  const mockApiService = {} as any;
  const bannerProps: BannerProps = {
    bannersService: {} as any,
    storage: {} as any,
    countryApiHost: "http://localhost",
  };

  it("renders Seo with noindex when no leagues are available", () => {
    mocks.seo.mockClear();
    mocks.useLiveNowStatus.mockReturnValue({
      selectedCountry: null,
      setSelectedCountry: vi.fn(),
      selectedLeagueId: null,
      setSelectedLeagueId: vi.fn(),
      countries: [],
      leagues: [],
      selectedLeague: null,
      selectedLeagueMatches: [],
    });

    render(<LiveNow apiService={mockApiService} bannerProps={bannerProps} />);

    expect(mocks.seo.mock.calls[0][0]).toMatchObject({ robots: "noindex, nofollow" });
  });
});
