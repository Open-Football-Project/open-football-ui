import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MomentumOscillatorChart } from "./MomentumOscillator";
import { MomentumOscillatorBrandColor } from "@matchinsights/core";

const points = [
  { minute: 5, value: 20, capturedAt: "2026-06-24T15:05:00Z" },
  { minute: 30, value: -40, capturedAt: "2026-06-24T15:30:00Z" },
  { minute: 60, value: 0, capturedAt: "2026-06-24T16:00:00Z" },
];

const brand: MomentumOscillatorBrandColor = {
  positive: "#6faa54",
  negative: "#ff4848",
  darkBg: "#1e1e1e",
  divider: "#333333",
  branding: "#ffc61a",
};

const homeTeamName = "Arsenal";
const awayTeamName = "Chelsea";

describe("MomentumOscillatorChart", () => {
  it("shows a dashed reference line and value label at the latest point", () => {
    render(
      <MomentumOscillatorChart
        points={points}
        brand={brand}
        homeTeamName={homeTeamName}
        awayTeamName={awayTeamName}
      />,
    );

    expect(screen.getByTestId("momentum-oscillator-latest-line")).toHaveAttribute(
      "points",
      "920.00,110.00 960.00,110.00",
    );
    const label = screen.getByTestId("momentum-oscillator-latest-label");
    expect(label).toHaveTextContent("0");
    expect(label).toHaveAttribute("y", "110.00");
    expect(label).toHaveAttribute("fill", brand.positive);
  });

  it("spreads points sharing a minute across distinct x positions instead of collapsing them", () => {
    render(
      <MomentumOscillatorChart
        points={[
          { minute: 60, value: 50, capturedAt: "2026-06-24T16:00:00Z" },
          { minute: 60, value: -50, capturedAt: "2026-06-24T16:00:05Z" },
        ]}
        brand={brand}
        homeTeamName={homeTeamName}
        awayTeamName={awayTeamName}
      />,
    );

    expect(screen.getByTestId("momentum-oscillator-path-positive")).toHaveAttribute(
      "d",
      "M 920.00 70.00 L 927.50 150.00",
    );
  });

  it("renders an svg with the expected viewBox", () => {
    render(
      <MomentumOscillatorChart
        points={points}
        brand={brand}
        homeTeamName={homeTeamName}
        awayTeamName={awayTeamName}
      />,
    );

    const svg = screen.getByTestId("momentum-oscillator-chart");
    expect(svg).toHaveAttribute("viewBox", "0 0 1990 250");
  });

  it("draws a horizontal neutral line at the vertical center", () => {
    const { container } = render(
      <MomentumOscillatorChart
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

  it("renders no path when there are 0 points", () => {
    render(
      <MomentumOscillatorChart
        points={[]}
        brand={brand}
        homeTeamName={homeTeamName}
        awayTeamName={awayTeamName}
      />,
    );

    expect(
      screen.queryByTestId("momentum-oscillator-path-positive"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("momentum-oscillator-path-negative"),
    ).not.toBeInTheDocument();
  });

  it("renders a path connecting all points in order", () => {
    render(
      <MomentumOscillatorChart
        points={points}
        brand={brand}
        homeTeamName={homeTeamName}
        awayTeamName={awayTeamName}
      />,
    );

    const path = screen.getByTestId("momentum-oscillator-path-positive");
    const commands = path
      .getAttribute("d")!
      .trim()
      .split(" ")
      .filter((c) => c === "M" || c === "L");
    expect(commands).toEqual(["M", "L", "L"]);
  });

  it("uses the injected brand colors", () => {
    const { container } = render(
      <MomentumOscillatorChart
        points={points}
        brand={brand}
        homeTeamName={homeTeamName}
        awayTeamName={awayTeamName}
      />,
    );

    const rect = screen.getByTestId("momentum-oscillator-background");
    const line = container.querySelector("line");
    const positivePath = screen.getByTestId("momentum-oscillator-path-positive");
    const negativePath = screen.getByTestId("momentum-oscillator-path-negative");

    expect(rect).toHaveAttribute("fill", brand.darkBg);
    expect(line).toHaveAttribute("stroke", brand.divider);
    expect(positivePath).toHaveAttribute("stroke", brand.positive);
    expect(negativePath).toHaveAttribute("stroke", brand.negative);
  });

  it("colors the home team name with the positive color and the away team name with the negative color", () => {
    const { container } = render(
      <MomentumOscillatorChart
        points={points}
        brand={brand}
        homeTeamName={homeTeamName}
        awayTeamName={awayTeamName}
      />,
    );

    const texts = container.querySelectorAll("text");
    expect(texts[0]).toHaveTextContent(homeTeamName);
    expect(texts[0]).toHaveAttribute("fill", brand.positive);
    expect(texts[1]).toHaveTextContent(awayTeamName);
    expect(texts[1]).toHaveAttribute("fill", brand.negative);
  });

  it("draws a time-axis gridline and label for each captured point's minute", () => {
    render(
      <MomentumOscillatorChart
        points={points}
        brand={brand}
        homeTeamName={homeTeamName}
        awayTeamName={awayTeamName}
      />,
    );

    const ticks = screen.getAllByTestId("momentum-oscillator-tick");
    const tickLabels = screen.getAllByTestId("momentum-oscillator-tick-label");
    expect(ticks).toHaveLength(points.length);
    expect(tickLabels).toHaveLength(points.length);
    expect(tickLabels[0]).toHaveTextContent("5'");
  });

  it("draws only one gridline and label per minute when multiple points share the same minute", () => {
    const pointsWithDuplicateMinutes = [
      { minute: 45, value: 33, capturedAt: "2026-06-24T19:47:06Z" },
      { minute: 45, value: 17, capturedAt: "2026-06-24T19:50:06Z" },
      { minute: 45, value: -6, capturedAt: "2026-06-24T19:53:06Z" },
      { minute: 90, value: 85, capturedAt: "2026-06-24T20:53:06Z" },
      { minute: 90, value: 83, capturedAt: "2026-06-24T20:59:06Z" },
    ];

    render(
      <MomentumOscillatorChart
        points={pointsWithDuplicateMinutes}
        brand={brand}
        homeTeamName={homeTeamName}
        awayTeamName={awayTeamName}
      />,
    );

    expect(screen.getAllByTestId("momentum-oscillator-tick")).toHaveLength(2);
    expect(screen.getAllByTestId("momentum-oscillator-tick-label")).toHaveLength(2);
  });
});
