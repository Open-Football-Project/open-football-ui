/// <reference types="@testing-library/jest-dom" />
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import TeamFixtureComponent from "./TeamFixtureComponent";
import { mockTeamFixture } from "@matchinsights/core";
import { svgToPng } from "../../../converter/svg-png-converter/svg-png-converter";

vi.mock("../../../converter/svg-png-converter/svg-png-converter", () => ({
  svgToPng: vi.fn(),
}));

vi.mock("@matchinsights/core", async () => {
  const actual = await vi.importActual("@matchinsights/core");
  return {
    ...actual,
    buildFixtureSvgString: vi.fn().mockReturnValue("<svg/>"),
    getFixtureSvgH: vi.fn().mockReturnValue(500),
    FIXTURE_SVG_W: 620,
    teamFixtureMatchesToFixtureRound: vi.fn().mockReturnValue({
      name: "Previous Matches",
      days: [{ date: "2025-09-15", matches: [] }],
    }),
  };
});

describe("TeamFixtureComponent", () => {
  let apiService: any;

  beforeEach(() => {
    vi.clearAllMocks();
    apiService = {
      fixtureService: {
        fetchTeamFixture: vi.fn(),
      },
      chartsService: {
        fetchFixtureIndicators: vi.fn().mockResolvedValue({}),
        fetchOddsFixtures: vi.fn().mockResolvedValue([]),
      },
      playerService: {
        fetchTodayPlayersFixtureIds: vi.fn().mockResolvedValue([]),
      },
    };
  });

  const renderComponent = (teamName = "") =>
    render(
      <MemoryRouter>
        <TeamFixtureComponent
          teamId={1}
          apiService={apiService}
          teamName={teamName}
        />
      </MemoryRouter>,
    );

  it("renders fixtures on success", async () => {
    apiService.fixtureService.fetchTeamFixture.mockResolvedValue(
      mockTeamFixture,
    );

    renderComponent();

    expect(
      await screen.findByText(mockTeamFixture.previous[0].awayTeamName),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(mockTeamFixture.upcoming[1].homeTeamName),
    ).toBeInTheDocument();
  });

  it("links to match detail page", async () => {
    apiService.fixtureService.fetchTeamFixture.mockResolvedValue(
      mockTeamFixture,
    );

    renderComponent();

    const links = await screen.findAllByRole("link");
    expect(links.length).toEqual(
      mockTeamFixture.previous.length + mockTeamFixture.upcoming.length,
    );
  });
});

describe("TeamFixtureComponent – share on X", () => {
  let apiService: any;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("open", vi.fn());
    apiService = {
      fixtureService: {
        fetchTeamFixture: vi
          .fn()
          .mockResolvedValue(mockTeamFixture),
      },
      chartsService: {
        fetchFixtureIndicators: vi.fn().mockResolvedValue({}),
        fetchOddsFixtures: vi.fn().mockResolvedValue([]),
      },
      playerService: {
        fetchTodayPlayersFixtureIds: vi.fn().mockResolvedValue([]),
      },
    };
  });

  it("renders a Share button for each panel", async () => {
    render(
      <MemoryRouter>
        <TeamFixtureComponent
          teamId={1}
          apiService={apiService}
          teamName="Manchester United"
        />
      </MemoryRouter>,
    );

    const shareButtons = await screen.findAllByRole("button", {
      name: /share/i,
    });
    expect(shareButtons).toHaveLength(2);
  });

  it("opens a twitter intent URL when Share is clicked on previous panel", async () => {
    render(
      <MemoryRouter>
        <TeamFixtureComponent
          teamId={1}
          apiService={apiService}
          teamName="Manchester United"
        />
      </MemoryRouter>,
    );

    const shareButtons = await screen.findAllByRole("button", {
      name: /share/i,
    });
    fireEvent.click(shareButtons[0]);

    expect(window.open).toHaveBeenCalledWith(
      expect.stringContaining("twitter.com/intent/tweet"),
      "_blank",
      "noopener,noreferrer",
    );
  });

  it("includes team name and finished score in previous tweet text", async () => {
    render(
      <MemoryRouter>
        <TeamFixtureComponent
          teamId={1}
          apiService={apiService}
          teamName="Manchester United"
        />
      </MemoryRouter>,
    );

    const shareButtons = await screen.findAllByRole("button", {
      name: /share/i,
    });
    fireEvent.click(shareButtons[0]);

    const url = vi.mocked(window.open).mock.calls[0][0] as string;
    const text = decodeURIComponent(url.split("text=")[1]);
    expect(text).toContain("Manchester United");
    expect(text).toContain("Manchester United 1-3 Liverpool");
    expect(text).toContain("futballero.com");
  });

  it("includes upcoming matches as 'vs' lines in next tweet text", async () => {
    render(
      <MemoryRouter>
        <TeamFixtureComponent
          teamId={1}
          apiService={apiService}
          teamName="Manchester United"
        />
      </MemoryRouter>,
    );

    const shareButtons = await screen.findAllByRole("button", {
      name: /share/i,
    });
    fireEvent.click(shareButtons[1]);

    const url = vi.mocked(window.open).mock.calls[0][0] as string;
    const text = decodeURIComponent(url.split("text=")[1]);
    expect(text).toContain("Manchester United vs Arsenal");
    expect(text).toContain("futballero.com");
  });
});

describe("TeamFixtureComponent – download", () => {
  let apiService: any;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(svgToPng).mockResolvedValue(undefined);
    apiService = {
      fixtureService: {
        fetchTeamFixture: vi
          .fn()
          .mockResolvedValue(mockTeamFixture),
      },
      chartsService: {
        fetchFixtureIndicators: vi.fn().mockResolvedValue({}),
        fetchOddsFixtures: vi.fn().mockResolvedValue([]),
      },
      playerService: {
        fetchTodayPlayersFixtureIds: vi.fn().mockResolvedValue([]),
      },
    };
  });

  it("renders a Download button for each panel", async () => {
    render(
      <MemoryRouter>
        <TeamFixtureComponent
          teamId={1}
          apiService={apiService}
          teamName="Manchester United"
        />
      </MemoryRouter>,
    );

    const downloadButtons = await screen.findAllByRole("button", {
      name: /download/i,
    });
    expect(downloadButtons).toHaveLength(2);
  });

  it("calls svgToPng with correct filename for previous panel", async () => {
    render(
      <MemoryRouter>
        <TeamFixtureComponent
          teamId={1}
          apiService={apiService}
          teamName="Manchester United"
        />
      </MemoryRouter>,
    );

    const downloadButtons = await screen.findAllByRole("button", {
      name: /download/i,
    });
    fireEvent.click(downloadButtons[0]);

    await waitFor(() =>
      expect(svgToPng).toHaveBeenCalledWith(
        expect.any(Object),
        expect.stringContaining("manchester-united"),
        620,
        500,
      ),
    );
  });

  it("calls svgToPng independently for each panel", async () => {
    render(
      <MemoryRouter>
        <TeamFixtureComponent
          teamId={1}
          apiService={apiService}
          teamName="Manchester United"
        />
      </MemoryRouter>,
    );

    const downloadButtons = await screen.findAllByRole("button", {
      name: /download/i,
    });

    fireEvent.click(downloadButtons[1]);

    await waitFor(() => expect(svgToPng).toHaveBeenCalledOnce());

    expect(svgToPng).not.toHaveBeenCalledTimes(2);
  });
});
