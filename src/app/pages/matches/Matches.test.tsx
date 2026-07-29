import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Matches from "./Matches";
import { BannerProps } from "../../common-props/BannerProps";

const mocks = vi.hoisted(() => ({
  useMatchesStatus: vi.fn(),
}));

vi.mock("@matchinsights/core", async () => {
  const actual = await vi.importActual("@matchinsights/core");
  return {
    ...actual,
    useMatchesStatus: mocks.useMatchesStatus,
  };
});

vi.mock("../../components/general/sub-header/SubHeader", () => ({
  default: ({ title }: { title: string }) => (
    <div data-testid="subheader">{title}</div>
  ),
}));

vi.mock("../../components/general/controls/Controls", () => ({
  default: (props: any) => (
    <div data-testid="controls" onClick={() => props.setDrop0("France")}>
      Controls Component
    </div>
  ),
}));

vi.mock("../../components/general/no-data/NoData", () => ({
  default: ({ loading }: { loading?: boolean }) => (
    <div data-testid={loading ? "loading" : "nodata"}>
      {loading ? "Loading..." : "No data"}
    </div>
  ),
}));

vi.mock("../../components/match/matches-grid/MatchesGrid", () => ({
  default: ({ leagueMatches }: { leagueMatches: any[] }) => (
    <div data-testid="matches-grid">Matches Grid ({leagueMatches.length})</div>
  ),
}));

vi.mock("./matches-status/matches-status", () => ({
  useMatchesStatus: vi.fn(),
}));

vi.mock("../../main/seo/Seo", () => {
  return {
    default: ({ children }: any) => <>{children}</>,
  };
});

vi.mock("../../main/seo/breadcrumb/Breadcrumb", () => ({
  default: () => null,
}));

describe("Matches Component", () => {
  const mockApiService = {} as any;
  const bannerProps: BannerProps = {
    bannersService: {} as any,
    storage: {} as any,
    countryApiHost: "http://localhost",
  };
  const mockSetCountry = vi.fn();
  const mockSetTimeRange = vi.fn();
  const mockSetDate = vi.fn();

  it("renders loading state", () => {
    mocks.useMatchesStatus.mockReturnValue({
      loadingMatches: true,
      selectedCountry: null,
      setSelectedCountry: mockSetCountry,
      selectedDate: null,
      setSelectedDate: mockSetDate,
      countries: [],
      leagueMatches: [],
      isLeagueMatchesAvailable: false,
      selectedTimeRange: 8,
      setSelectedTimeRange: mockSetTimeRange,
      timeRangeOptions: [{ from: 0, to: 23, name: "None" }],
    });

    render(<Matches apiService={mockApiService} bannerProps={bannerProps} />);

    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("renders NoData when no leagues and not loading", () => {
    mocks.useMatchesStatus.mockReturnValue({
      loadingMatches: false,
      selectedCountry: null,
      setSelectedCountry: vi.fn(),
      selectedDate: null,
      setSelectedDate: vi.fn(),
      countries: [],
      leagueMatches: [],
      isLeagueMatchesAvailable: false,
      selectedTimeRange: 8,
      setSelectedTimeRange: mockSetTimeRange,
      timeRangeOptions: [{ from: 0, to: 23, name: "None" }],
    });

    render(<Matches apiService={mockApiService} bannerProps={bannerProps} />);

    expect(screen.getByTestId("nodata")).toBeInTheDocument();
  });

  it("renders MatchesGrid when leagues exist", () => {
    mocks.useMatchesStatus.mockReturnValue({
      loadingMatches: false,
      selectedCountry: "Spain",
      setSelectedCountry: vi.fn(),
      selectedDate: null,
      setSelectedDate: vi.fn(),
      countries: ["Spain"],
      leagueMatches: [{ id: 1, name: "La Liga" }],
      isLeagueMatchesAvailable: true,
      selectedTimeRange: 8,
      setSelectedTimeRange: mockSetTimeRange,
      timeRangeOptions: [{ from: 0, to: 23, name: "None" }],
    });

    render(<Matches apiService={mockApiService} bannerProps={bannerProps} />);

    expect(screen.getByTestId("matches-grid")).toHaveTextContent(
      "Matches Grid (1)"
    );
  });

  it("calls setSelectedCountry when Controls triggers change", () => {
    const mockSetCountry = vi.fn();

    mocks.useMatchesStatus.mockReturnValue({
      loadingMatches: false,
      selectedCountry: "England",
      setSelectedCountry: mockSetCountry,
      selectedDate: null,
      setSelectedDate: vi.fn(),
      countries: ["England", "France"],
      leagueMatches: [{ id: 1, name: "La Liga" }],
      isLeagueMatchesAvailable: true,
      selectedTimeRange: 8,
      setSelectedTimeRange: mockSetTimeRange,
      timeRangeOptions: [{ from: 0, to: 23, name: "None" }],
    });

    render(<Matches apiService={mockApiService} bannerProps={bannerProps} />);

    fireEvent.click(screen.getByTestId("controls"));
    expect(mockSetCountry).toHaveBeenCalledWith("France");
  });
});
