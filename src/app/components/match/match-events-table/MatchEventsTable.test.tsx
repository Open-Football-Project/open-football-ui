/// <reference types="@testing-library/jest-dom/vitest" />
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import MatchEventsTable from "./MatchEventsTable";
import { MatchEvent } from "open-football-project-core";

vi.mock("../../../assets/some-logo.png", () => ({
  default: "mock-logo.png",
}));

vi.mock("../../../converter/svg-png-converter/svg-png-converter", () => ({
  svgToPng: vi.fn().mockResolvedValue(undefined),
}));

describe("EventsTable", () => {
  const baseProps = {
    homeTeamName: "Home FC",
    homeTeamLogo: "home-logo.png",
    awayTeamName: "Away FC",
    awayTeamLogo: "away-logo.png",
  };

  const mockEvents: MatchEvent[] = [
    {
      eventType: "Goal",
      eventDetails: "goal",
      playerName: "Player A",
      teamName: "Home FC",
      timeElapsed: 12,
    },
    {
      eventType: "Yellow Card",
      eventDetails: "yellow card",
      playerName: "Player B",
      teamName: "Away FC",
      timeElapsed: 45,
    },
    {
      eventType: "var",
      eventDetails: "No goal",
      playerName: "",
      teamName: "Home FC",
      timeElapsed: 70,
    },
  ];

  it("renders team names and logos", () => {
    render(<MatchEventsTable {...baseProps} events={mockEvents} />);

    expect(screen.getByText("Home FC")).toBeInTheDocument();
    expect(screen.getByText("Away FC")).toBeInTheDocument();

    const homeLogo = screen.getByAltText("Home FC") as HTMLImageElement;
    const awayLogo = screen.getByAltText("Away FC") as HTMLImageElement;

    expect(homeLogo.src).toContain("home-logo.png");
    expect(awayLogo.src).toContain("away-logo.png");
  });

  it("renders all events", () => {
    render(<MatchEventsTable {...baseProps} events={mockEvents} />);

    expect(screen.getByTestId("homePlayer")).toHaveTextContent("P. A");
    expect(screen.getByTestId("awayPlayer")).toHaveTextContent("P. B");
    expect(screen.getByTestId("homeDetail")).toHaveTextContent("No goal");
  });

  it("sorts events by elapsed time (descending)", () => {
    render(<MatchEventsTable {...baseProps} events={mockEvents} />);

    const eventTimes = screen
      .getAllByText(/'/)
      .map((node) => node.textContent?.replace("'", ""))
      .map(Number);

    expect(eventTimes).toEqual([70, 45, 12]);
  });

  it("renders correct icons for event types", () => {
    render(<MatchEventsTable {...baseProps} events={mockEvents} />);

    const goalIcons = document.querySelectorAll("svg");
    expect(goalIcons.length).toBeGreaterThan(0);
  });

  it("renders '-' when elapsed time is missing", () => {
    const eventsWithMissingTime = [
      {
        eventType: "Goal",
        eventDetails: "goal",
        playerName: "Player X",
        teamName: "Home FC",
      },
    ] as MatchEvent[];

    render(<MatchEventsTable {...baseProps} events={eventsWithMissingTime} />);

    expect(screen.getByText("-")).toBeInTheDocument();
  });
});

describe("MatchEventsTable social sharing", () => {
  const mockOpen = vi.fn();

  const baseProps = {
    homeTeamName: "Home FC",
    homeTeamLogo: "home-logo.png",
    awayTeamName: "Away FC",
    awayTeamLogo: "away-logo.png",
  };

  const mockEvents: MatchEvent[] = [
    {
      eventType: "Goal",
      eventDetails: "goal",
      playerName: "Player A",
      teamName: "Home FC",
      timeElapsed: 12,
    },
    {
      eventType: "Yellow Card",
      eventDetails: "yellow card",
      playerName: "Player B",
      teamName: "Away FC",
      timeElapsed: 45,
    },
    {
      eventType: "var",
      eventDetails: "No goal",
      playerName: "",
      teamName: "Home FC",
      timeElapsed: 70,
    },
  ];

  beforeEach(() => {
    vi.stubGlobal("open", mockOpen);
  });

  afterEach(() => {
    mockOpen.mockReset();
    vi.unstubAllGlobals();
  });

  const getShareUrl = (): string => mockOpen.mock.calls[0][0] as string;

  it("renders share and download buttons", () => {
    render(<MatchEventsTable {...baseProps} events={mockEvents} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2);
  });

  it("share button opens twitter with team names and footballproject.org", () => {
    render(<MatchEventsTable {...baseProps} events={mockEvents} />);
    fireEvent.click(screen.getAllByRole("button")[0]);

    expect(mockOpen).toHaveBeenCalledWith(
      expect.stringContaining("twitter.com/intent/tweet"),
      "_blank",
      "noopener,noreferrer",
    );
    const text = decodeURIComponent(getShareUrl().split("text=")[1]);
    expect(text).toContain("Home FC");
    expect(text).toContain("Away FC");
    expect(text).toContain("footballproject.org");
  });

  it("share text only includes goals and cards, not VAR", () => {
    render(<MatchEventsTable {...baseProps} events={mockEvents} />);
    fireEvent.click(screen.getAllByRole("button")[0]);

    const text = decodeURIComponent(getShareUrl().split("text=")[1]);
    expect(text).toContain("P. A");
    expect(text).toContain("P. B");
    expect(text).not.toContain("No goal");
  });

  it("download button calls svgToPng with correct filename", async () => {
    const { svgToPng } =
      await import("../../../converter/svg-png-converter/svg-png-converter");
    render(<MatchEventsTable {...baseProps} events={mockEvents} />);
    fireEvent.click(screen.getAllByRole("button")[1]);

    await waitFor(() => {
      expect(vi.mocked(svgToPng)).toHaveBeenCalledWith(
        expect.anything(),
        expect.stringContaining("home-fc-vs-away-fc"),
        expect.any(Number),
        expect.any(Number),
      );
    });
  });

  it("download button shows loading state while in progress", async () => {
    const { svgToPng } =
      await import("../../../converter/svg-png-converter/svg-png-converter");
    vi.mocked(svgToPng).mockReturnValue(new Promise(() => {}));

    render(<MatchEventsTable {...baseProps} events={mockEvents} />);
    fireEvent.click(screen.getAllByRole("button")[1]);

    expect(screen.getByText("…")).toBeInTheDocument();
  });

  it("download button is disabled while downloading", async () => {
    const { svgToPng } =
      await import("../../../converter/svg-png-converter/svg-png-converter");
    vi.mocked(svgToPng).mockReturnValue(new Promise(() => {}));

    render(<MatchEventsTable {...baseProps} events={mockEvents} />);
    const downloadBtn = screen.getAllByRole("button")[1];
    fireEvent.click(downloadBtn);

    expect(downloadBtn).toBeDisabled();
  });
});
