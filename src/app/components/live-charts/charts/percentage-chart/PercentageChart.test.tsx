import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PercentageChart } from "./PercentageChart";

const points = [
  { minute: 5, value: 80, capturedAt: "2026-06-24T15:05:00Z" },
  { minute: 30, value: 35, capturedAt: "2026-06-24T15:30:00Z" },
  { minute: 60, value: 50, capturedAt: "2026-06-24T16:00:00Z" },
];

const brand = {
  home: "#f97316",
  away: "#ffc61a",
  darkBg: "#1e1e1e",
  divider: "#333333",
};

const homeTeamName = "Arsenal";
const awayTeamName = "Chelsea";

describe("PercentageChart", () => {
  it("draws a horizontal center line at value 50, matching MomentumOscillatorChart's pattern", () => {
    const { container } = render(
      <PercentageChart
        points={points}
        brand={brand}
        homeTeamName={homeTeamName}
        awayTeamName={awayTeamName}
      />,
    );

    const line = container.querySelector("line");
    expect(line).toHaveAttribute("y1", "110");
    expect(line).toHaveAttribute("y2", "110");
  });

  it("shows dashed reference lines and value labels at the latest point, pushed apart when they collide", () => {
    render(
      <PercentageChart
        points={[{ minute: 60, value: 50, capturedAt: "2026-06-24T16:00:00Z" }]}
        brand={brand}
        homeTeamName={homeTeamName}
        awayTeamName={awayTeamName}
      />,
    );

    const homeLabel = screen.getByTestId("percentage-chart-latest-label-home");
    const awayLabel = screen.getByTestId("percentage-chart-latest-label-away");
    const homeY = Number(homeLabel.getAttribute("y"));
    const awayY = Number(awayLabel.getAttribute("y"));
    expect(Math.abs(awayY - homeY)).toBeGreaterThanOrEqual(10);
  });

  it("spreads points sharing a minute across distinct x positions instead of collapsing them", () => {
    render(
      <PercentageChart
        points={[
          { minute: 30, value: 60, capturedAt: "2026-06-24T15:30:00Z" },
          { minute: 30, value: 40, capturedAt: "2026-06-24T15:30:05Z" },
        ]}
        brand={brand}
        homeTeamName={homeTeamName}
        awayTeamName={awayTeamName}
      />,
    );

    expect(screen.getByTestId("percentage-chart-path-home")).toHaveAttribute(
      "d",
      "M 470.00 94.00 L 477.50 126.00",
    );
  });

  it("renders an svg with the expected viewBox", () => {
    render(
      <PercentageChart
        points={points}
        brand={brand}
        homeTeamName={homeTeamName}
        awayTeamName={awayTeamName}
      />,
    );

    const svg = screen.getByTestId("percentage-chart");
    expect(svg).toHaveAttribute("viewBox", "0 0 1990 250");
  });

  it("renders no paths when there are 0 points", () => {
    render(
      <PercentageChart
        points={[]}
        brand={brand}
        homeTeamName={homeTeamName}
        awayTeamName={awayTeamName}
      />,
    );

    expect(screen.queryByTestId("percentage-chart-path-home")).not.toBeInTheDocument();
    expect(screen.queryByTestId("percentage-chart-path-away")).not.toBeInTheDocument();
  });

  it("renders a home path and an away path connecting all points in order", () => {
    render(
      <PercentageChart
        points={points}
        brand={brand}
        homeTeamName={homeTeamName}
        awayTeamName={awayTeamName}
      />,
    );

    const toCommands = (d: string) => d.trim().split(" ").filter((c) => c === "M" || c === "L");
    expect(toCommands(screen.getByTestId("percentage-chart-path-home").getAttribute("d")!)).toEqual([
      "M",
      "L",
      "L",
    ]);
    expect(toCommands(screen.getByTestId("percentage-chart-path-away").getAttribute("d")!)).toEqual([
      "M",
      "L",
      "L",
    ]);
  });

  it("derives the away line as the complement of the home value (100 - value)", () => {
    render(
      <PercentageChart
        points={[{ minute: 5, value: 80, capturedAt: "2026-06-24T15:05:00Z" }]}
        brand={brand}
        homeTeamName={homeTeamName}
        awayTeamName={awayTeamName}
      />,
    );

    // PADDING_X=20, pixelsPerMinute=15 -> x = 20 + 5*15 = 95
    // CENTER_Y=110, usableHeight=160 -> y = 110 - ((value-50)/50)*80
    // home value=80 -> y=62.00; away value=100-80=20 -> y=158.00
    expect(screen.getByTestId("percentage-chart-path-home")).toHaveAttribute(
      "d",
      "M 95.00 62.00",
    );
    expect(screen.getByTestId("percentage-chart-path-away")).toHaveAttribute(
      "d",
      "M 95.00 158.00",
    );
  });

  it("uses the injected brand colors for background, divider, home line and away line", () => {
    const { container } = render(
      <PercentageChart
        points={points}
        brand={brand}
        homeTeamName={homeTeamName}
        awayTeamName={awayTeamName}
      />,
    );

    const rect = screen.getByTestId("percentage-chart-background");
    const line = container.querySelector("line");

    expect(rect).toHaveAttribute("fill", brand.darkBg);
    expect(line).toHaveAttribute("stroke", brand.divider);
    expect(screen.getByTestId("percentage-chart-path-home")).toHaveAttribute("stroke", brand.home);
    expect(screen.getByTestId("percentage-chart-path-away")).toHaveAttribute("stroke", brand.away);
  });

  it("colors the home team name with the home color and the away team name with the away color", () => {
    const { container } = render(
      <PercentageChart
        points={points}
        brand={brand}
        homeTeamName={homeTeamName}
        awayTeamName={awayTeamName}
      />,
    );

    const texts = container.querySelectorAll("text");
    expect(texts[0]).toHaveTextContent(homeTeamName);
    expect(texts[0]).toHaveAttribute("fill", brand.home);
    expect(texts[1]).toHaveTextContent(awayTeamName);
    expect(texts[1]).toHaveAttribute("fill", brand.away);
  });

  it("draws a time-axis gridline and label for each captured point's minute", () => {
    render(
      <PercentageChart
        points={points}
        brand={brand}
        homeTeamName={homeTeamName}
        awayTeamName={awayTeamName}
      />,
    );

    const ticks = screen.getAllByTestId("percentage-chart-tick");
    const tickLabels = screen.getAllByTestId("percentage-chart-tick-label");
    expect(ticks).toHaveLength(points.length);
    expect(tickLabels).toHaveLength(points.length);
    expect(tickLabels[0]).toHaveTextContent("5'");
  });

  it("renders a toggle pill for each team, both active by default", () => {
    render(
      <PercentageChart
        points={points}
        brand={brand}
        homeTeamName={homeTeamName}
        awayTeamName={awayTeamName}
      />,
    );

    expect(screen.getByRole("button", { name: homeTeamName })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: awayTeamName })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("clicking the home team's pill hides only the home line", () => {
    render(
      <PercentageChart
        points={points}
        brand={brand}
        homeTeamName={homeTeamName}
        awayTeamName={awayTeamName}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: homeTeamName }));

    expect(screen.queryByTestId("percentage-chart-path-home")).not.toBeInTheDocument();
    expect(screen.getByTestId("percentage-chart-path-away")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: homeTeamName })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("clicking the away team's pill hides only the away line", () => {
    render(
      <PercentageChart
        points={points}
        brand={brand}
        homeTeamName={homeTeamName}
        awayTeamName={awayTeamName}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: awayTeamName }));

    expect(screen.queryByTestId("percentage-chart-path-away")).not.toBeInTheDocument();
    expect(screen.getByTestId("percentage-chart-path-home")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: awayTeamName })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("clicking a pill twice restores that line", () => {
    render(
      <PercentageChart
        points={points}
        brand={brand}
        homeTeamName={homeTeamName}
        awayTeamName={awayTeamName}
      />,
    );

    const homeToggle = screen.getByRole("button", { name: homeTeamName });
    fireEvent.click(homeToggle);
    fireEvent.click(homeToggle);

    expect(screen.getByTestId("percentage-chart-path-home")).toBeInTheDocument();
    expect(homeToggle).toHaveAttribute("aria-pressed", "true");
  });
});
