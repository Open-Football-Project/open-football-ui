/// <reference types="@testing-library/jest-dom" />
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MutableRefObject } from "react";
import { MemoryRouter } from "react-router-dom";
import { LeagueFixtureComponent } from "./LeagueFixtureComponent";
import { ApiService, LeagueFixture, mockLeagueFixture } from "@matchinsights/core";
import { svgToPng } from "../../../converter/svg-png-converter/svg-png-converter";
import { useRovingTabIndex } from "../../../special-hooks/roving-tabindex/roving-tabindex";

vi.mock("../../../special-hooks/roving-tabindex/roving-tabindex", () => ({
  useRovingTabIndex: vi.fn(() => ({ onFocus: vi.fn(), handleKeyDown: vi.fn() })),
}));

vi.mock("../../../components/general/logo/Logo", () => ({
  default: ({ src }: { src: string }) => <img data-testid="logo" src={src} />,
}));

vi.mock("../../../components/general/no-data/NoData", () => ({
  default: ({ loading }: { loading?: boolean }) => (
    <div data-testid="no-data">{loading ? "Loading..." : "No Data"}</div>
  ),
}));

vi.mock("../../../converter/svg-png-converter/svg-png-converter", () => ({
  svgToPng: vi.fn(),
}));

vi.mock("@matchinsights/core", async () => {
  const actual = await vi.importActual("@matchinsights/core");
  return {
    ...actual,
    getFormattedDate: (date: string) => `FormattedDate(${date})`,
    getFormattedTime: (date: string) => `FormattedTime(${date})`,
    buildFixtureSvgString: vi.fn().mockReturnValue("<svg/>"),
    getFixtureSvgH: vi.fn().mockReturnValue(500),
    FIXTURE_SVG_W: 620,
  };
});

const downloadButton = () => screen.getByRole("button", { name: /download/i });
const shareButton = () => screen.getByRole("button", { name: /share/i });
const mockApiService = {
  chartsService: {
    fetchFixtureIndicators: vi.fn().mockResolvedValue({}),
    fetchOddsFixtures: vi.fn().mockResolvedValue([]),
  },
  playerService: {
    fetchTodayPlayersFixtureIds: vi.fn().mockResolvedValue([]),
  },
} as unknown as ApiService;

describe("LeagueFixtureComponent", () => {
  const fixture: LeagueFixture = mockLeagueFixture;

  it("renders loading state", () => {
    render(
      <LeagueFixtureComponent
        fixture={undefined}
        loading={true}
        apiService={mockApiService}
      />,
    );
    expect(screen.getByTestId("no-data")).toHaveTextContent("Loading...");
  });

  it("renders no-data state when no fixture and not loading", () => {
    render(
      <LeagueFixtureComponent
        fixture={undefined}
        loading={false}
        apiService={mockApiService}
      />,
    );
    expect(screen.getByTestId("no-data")).toHaveTextContent("No Data");
  });

  it("renders fixture with matches", () => {
    render(
      <MemoryRouter>
        <LeagueFixtureComponent
          fixture={fixture}
          loading={false}
          apiService={mockApiService}
        />
      </MemoryRouter>,
    );
    expect(
      screen.getByText(
        fixture.rounds[fixture.currentRoundIndex].days[0].matches[0]
          .awayTeamName,
      ),
    ).toBeInTheDocument();
  });

  it("navigates rounds with left and right buttons", () => {
    render(
      <MemoryRouter>
        <LeagueFixtureComponent
          fixture={fixture}
          loading={false}
          apiService={mockApiService}
        />
      </MemoryRouter>,
    );

    const select = screen.getByRole("combobox");
    const lastIdx = String(fixture.currentRoundIndex);

    expect(select).toHaveValue(lastIdx);

    fireEvent.click(screen.getByTestId("right-round"));
    expect(select).toHaveValue("0");

    fireEvent.click(screen.getByTestId("left-round"));
    expect(select).toHaveValue(lastIdx);
  });

  it("selects a round via the select control", () => {
    render(
      <MemoryRouter>
        <LeagueFixtureComponent
          fixture={fixture}
          loading={false}
          apiService={mockApiService}
        />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("round-0")).toBeInTheDocument();
    expect(screen.getByTestId("round-1")).toBeInTheDocument();

    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "1" } });

    fireEvent.click(screen.getByTestId("left-round"));
    expect(select).toHaveValue("0");
  });

  it("passes allFocusable ref with one entry per match in the current round to useRovingTabIndex", () => {
    let capturedRef: MutableRefObject<(HTMLElement | null)[]> | null = null;

    vi.mocked(useRovingTabIndex).mockImplementation((ref) => {
      capturedRef = ref as MutableRefObject<(HTMLElement | null)[]>;
      return { onFocus: vi.fn(), handleKeyDown: vi.fn() };
    });

    render(
      <MemoryRouter>
        <LeagueFixtureComponent
          fixture={fixture}
          loading={false}
          apiService={mockApiService}
        />
      </MemoryRouter>,
    );

    const totalMatches = fixture.rounds[fixture.currentRoundIndex].days
      .flatMap((d) => d.matches).length;

    expect(capturedRef!.current.length).toBe(totalMatches);
  });
});

describe("LeagueFixtureComponent – share on X", () => {
  const fixture: LeagueFixture = mockLeagueFixture;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("open", vi.fn());
  });

  it("renders a Share button", () => {
    render(
      <MemoryRouter>
        <LeagueFixtureComponent
          fixture={fixture}
          loading={false}
          leagueName="La Liga"
          apiService={mockApiService}
        />
      </MemoryRouter>,
    );
    expect(shareButton()).toBeInTheDocument();
  });

  it("opens a twitter intent URL when Share is clicked", () => {
    render(
      <MemoryRouter>
        <LeagueFixtureComponent
          fixture={fixture}
          loading={false}
          leagueName="La Liga"
          apiService={mockApiService}
        />
      </MemoryRouter>,
    );

    fireEvent.click(shareButton());

    expect(window.open).toHaveBeenCalledWith(
      expect.stringContaining("twitter.com/intent/tweet"),
      "_blank",
      "noopener,noreferrer",
    );
  });

  it("includes the league name and futballero.com in the tweet text", () => {
    render(
      <MemoryRouter>
        <LeagueFixtureComponent
          fixture={fixture}
          loading={false}
          leagueName="La Liga"
          apiService={mockApiService}
        />
      </MemoryRouter>,
    );

    fireEvent.click(shareButton());

    const url = vi.mocked(window.open).mock.calls[0][0] as string;
    const text = decodeURIComponent(url.split("text=")[1]);
    expect(text).toContain("La Liga");
    expect(text).toContain("futballero.com");
  });

  it("updates tweet text when navigating to a different round", () => {
    render(
      <MemoryRouter>
        <LeagueFixtureComponent
          fixture={fixture}
          loading={false}
          leagueName="La Liga"
          apiService={mockApiService}
        />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByTestId("right-round"));
    fireEvent.click(shareButton());

    const url = vi.mocked(window.open).mock.calls[0][0] as string;
    const text = decodeURIComponent(url.split("text=")[1]);
    expect(text).toContain(fixture.rounds[0].name);
  });
});

describe("LeagueFixtureComponent – download", () => {
  const fixture: LeagueFixture = mockLeagueFixture;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(svgToPng).mockResolvedValue(undefined);
  });

  it("renders a Download button", () => {
    render(
      <MemoryRouter>
        <LeagueFixtureComponent
          fixture={fixture}
          loading={false}
          leagueName="La Liga"
          apiService={mockApiService}
        />
      </MemoryRouter>,
    );
    expect(downloadButton()).toBeInTheDocument();
  });

  it("calls svgToPng with the correct filename on click", async () => {
    render(
      <MemoryRouter>
        <LeagueFixtureComponent
          fixture={fixture}
          loading={false}
          leagueName="La Liga"
          apiService={mockApiService}
        />
      </MemoryRouter>,
    );

    fireEvent.click(downloadButton());

    await waitFor(() =>
      expect(svgToPng).toHaveBeenCalledWith(
        expect.any(Object),
        "futballero-la-liga-fixtures.png",
        620,
        500,
      ),
    );
  });
});
