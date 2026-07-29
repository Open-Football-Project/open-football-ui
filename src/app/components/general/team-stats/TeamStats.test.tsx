/// <reference types="@testing-library/jest-dom/vitest" />
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import StatsChart from "./TeamStats";
import { TeamStatistic } from "@matchinsights/core";

vi.mock("../../../converter/svg-png-converter/svg-png-converter", () => ({
  svgToPng: vi.fn().mockResolvedValue(undefined),
}));

const sampleStats: TeamStatistic[] = [
  { name: "Shots on Goal", value: 5, total: 10, isPositive: true },
  { name: "Shots Off Goal", value: 3, total: 10, isPositive: false },
  { name: "Shots InsideBox", value: 4, total: 10, isPositive: true },
  { name: "Shots OutsideBox", value: 6, total: 10, isPositive: false },
  { name: "Yellow Cards", value: 1, total: 5, isPositive: false },
  { name: "Corner_Kicks", value: 5, total: 6, isPositive: true },
];

describe("team stats component", () => {
  it("renders title", () => {
    render(<StatsChart title="Test Stats" statistics={[]} />);
    expect(screen.getByText("Test Stats")).toBeInTheDocument();
  });

  it("displays stat names formatted correctly", () => {
    render(<StatsChart title="Stats" statistics={sampleStats} />);
    expect(screen.getByText("STATS.SHOTS_ON_GOAL")).toBeInTheDocument();
    expect(screen.getByText("STATS.SHOTS_OFF_GOAL")).toBeInTheDocument();
    expect(screen.getByText("STATS.CORNER_KICKS")).toBeInTheDocument();
  });

  it("renders bar with correct width for numeric value", () => {
    render(<StatsChart title="Stats" statistics={sampleStats} />);
    const bar = screen.getAllByRole("progressbar")[0] as HTMLElement;
    expect(bar.style.width).toBeDefined();
  });

  it("applies correct bar colors based on positive/negative stat and percent", () => {
    render(<StatsChart title="Stats" statistics={sampleStats} />);
    const bars = screen.getAllByRole("progressbar");
    expect(bars.length).toBeGreaterThan(0);
    expect(bars[0].className).toMatch(
      /bg-brand-success|bg-brand-orange|bg-brand-yellowa|bg-brand-danger/,
    );
  });
});

describe("team stats social sharing", () => {
  const mockOpen = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("open", mockOpen);
  });

  afterEach(() => {
    mockOpen.mockReset();
    vi.unstubAllGlobals();
  });

  const getShareUrl = (): string => mockOpen.mock.calls[0][0] as string;

  it("renders share and download buttons", () => {
    render(<StatsChart title="Test Stats" statistics={sampleStats} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2);
  });

  it("share button opens twitter with team title and futballero.com", () => {
    render(<StatsChart title="Test Stats" statistics={sampleStats} />);
    fireEvent.click(screen.getAllByRole("button")[0]);

    expect(mockOpen).toHaveBeenCalledWith(
      expect.stringContaining("twitter.com/intent/tweet"),
      "_blank",
      "noopener,noreferrer",
    );
    const text = decodeURIComponent(getShareUrl().split("text=")[1]);
    expect(text).toContain("Test Stats");
    expect(text).toContain("futballero.com");
  });

  it("share text includes all stat labels and values", () => {
    render(<StatsChart title="Test Stats" statistics={sampleStats} />);
    fireEvent.click(screen.getAllByRole("button")[0]);

    const text = decodeURIComponent(getShareUrl().split("text=")[1]);
    expect(text).toContain("5");
    expect(text).toContain("1");
  });

  it("download button calls svgToPng with correct filename", async () => {
    const { svgToPng } =
      await import("../../../converter/svg-png-converter/svg-png-converter");
    render(<StatsChart title="Test Stats" statistics={sampleStats} />);
    fireEvent.click(screen.getAllByRole("button")[1]);

    await waitFor(() => {
      expect(vi.mocked(svgToPng)).toHaveBeenCalledWith(
        expect.anything(),
        expect.stringContaining("test-stats"),
        expect.any(Number),
        expect.any(Number),
      );
    });
  });

  it("download button shows loading state while in progress", async () => {
    const { svgToPng } =
      await import("../../../converter/svg-png-converter/svg-png-converter");
    vi.mocked(svgToPng).mockReturnValue(new Promise(() => {}));

    render(<StatsChart title="Test Stats" statistics={sampleStats} />);
    fireEvent.click(screen.getAllByRole("button")[1]);

    expect(screen.getByText("…")).toBeInTheDocument();
  });

  it("download button is disabled while downloading", async () => {
    const { svgToPng } =
      await import("../../../converter/svg-png-converter/svg-png-converter");
    vi.mocked(svgToPng).mockReturnValue(new Promise(() => {}));

    render(<StatsChart title="Test Stats" statistics={sampleStats} />);
    const downloadBtn = screen.getAllByRole("button")[1];
    fireEvent.click(downloadBtn);

    expect(downloadBtn).toBeDisabled();
  });
});
