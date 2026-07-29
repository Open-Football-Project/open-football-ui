import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { OddsChart } from "./OddsChart";

const brand = {
  darkBg: "#1e1e1e",
  divider: "#333333",
};

describe("OddsChart", () => {
  it("draws a plain horizontal baseline for visual parity with the other chart types", () => {
    render(<OddsChart lines={[]} colors={[]} brand={brand} />);

    const baseline = screen.getByTestId("odds-chart-baseline");
    expect(baseline).toHaveAttribute("y1", "110");
    expect(baseline).toHaveAttribute("y2", "110");
  });

  it("shows a dashed reference line and value label at each visible line's latest point", () => {
    render(
      <OddsChart
        lines={[
          {
            label: "Home",
            points: [
              { minute: 5, odd: "1.50", capturedAt: "t" },
              { minute: 30, odd: "1.60", capturedAt: "t2" },
            ],
          },
        ]}
        colors={["#111111"]}
        brand={brand}
      />,
    );

    expect(screen.getByTestId("odds-chart-latest-line-0")).toHaveAttribute(
      "points",
      "470.00,43.33 510.00,43.33",
    );
    const label = screen.getByTestId("odds-chart-latest-label-0");
    expect(label).toHaveTextContent("1.60");
    expect(label).toHaveAttribute("y", "43.33");
    expect(label).toHaveAttribute("fill", "#111111");
  });

  it("renders an svg with the expected viewBox", () => {
    render(
      <OddsChart
        lines={[
          {
            label: "Home",
            points: [{ minute: 5, odd: "1.50", capturedAt: "2026-06-24T15:05:00Z" }],
          },
        ]}
        colors={["#111111"]}
        brand={brand}
      />,
    );

    const svg = screen.getByTestId("odds-chart");
    expect(svg).toHaveAttribute("viewBox", "0 0 1990 250");
  });

  it("renders no paths and no toggle pills when there are no lines", () => {
    render(<OddsChart lines={[]} colors={[]} brand={brand} />);

    expect(screen.queryByTestId("odds-chart-path-0")).not.toBeInTheDocument();
    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });

  it("skips the path for a line with 0 points but still renders its toggle pill", () => {
    render(
      <OddsChart
        lines={[
          { label: "Home", points: [] },
          {
            label: "Away",
            points: [{ minute: 5, odd: "2.00", capturedAt: "2026-06-24T15:05:00Z" }],
          },
        ]}
        colors={["#111111", "#222222"]}
        brand={brand}
      />,
    );

    expect(screen.queryByTestId("odds-chart-path-0")).not.toBeInTheDocument();
    expect(screen.getByTestId("odds-chart-path-1")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Home" })).toBeInTheDocument();
  });

  it("renders one path per line, colored from the colors array by index", () => {
    render(
      <OddsChart
        lines={[
          {
            label: "Home",
            points: [{ minute: 5, odd: "1.50", capturedAt: "2026-06-24T15:05:00Z" }],
          },
          {
            label: "Away",
            points: [{ minute: 5, odd: "2.50", capturedAt: "2026-06-24T15:05:00Z" }],
          },
        ]}
        colors={["#111111", "#222222"]}
        brand={brand}
      />,
    );

    expect(screen.getByTestId("odds-chart-path-0")).toHaveAttribute("stroke", "#111111");
    expect(screen.getByTestId("odds-chart-path-1")).toHaveAttribute("stroke", "#222222");
  });

  it("cycles the colors array when there are more lines than colors", () => {
    render(
      <OddsChart
        lines={[
          { label: "A", points: [{ minute: 5, odd: "1.50", capturedAt: "t" }] },
          { label: "B", points: [{ minute: 5, odd: "2.50", capturedAt: "t" }] },
          { label: "C", points: [{ minute: 5, odd: "3.50", capturedAt: "t" }] },
        ]}
        colors={["#111111", "#222222"]}
        brand={brand}
      />,
    );

    expect(screen.getByTestId("odds-chart-path-0")).toHaveAttribute("stroke", "#111111");
    expect(screen.getByTestId("odds-chart-path-1")).toHaveAttribute("stroke", "#222222");
    expect(screen.getByTestId("odds-chart-path-2")).toHaveAttribute("stroke", "#111111");
  });

  it("uses the injected brand colors for background and divider", () => {
    const { container } = render(
      <OddsChart
        lines={[
          {
            label: "Home",
            points: [
              { minute: 5, odd: "1.50", capturedAt: "t" },
              { minute: 30, odd: "1.60", capturedAt: "t" },
            ],
          },
        ]}
        colors={["#111111"]}
        brand={brand}
      />,
    );

    expect(screen.getByTestId("odds-chart-background")).toHaveAttribute("fill", brand.darkBg);
    expect(container.querySelector("line")).toHaveAttribute("stroke", brand.divider);
  });

  it("draws a time-axis gridline and label for every unique minute across all lines", () => {
    render(
      <OddsChart
        lines={[
          {
            label: "Home",
            points: [
              { minute: 5, odd: "1.50", capturedAt: "t" },
              { minute: 30, odd: "1.60", capturedAt: "t" },
            ],
          },
          {
            label: "Away",
            points: [{ minute: 60, odd: "2.50", capturedAt: "t" }],
          },
        ]}
        colors={["#111111", "#222222"]}
        brand={brand}
      />,
    );

    const ticks = screen.getAllByTestId("odds-chart-tick");
    const tickLabels = screen.getAllByTestId("odds-chart-tick-label");
    expect(ticks).toHaveLength(3);
    expect(tickLabels).toHaveLength(3);
    expect(tickLabels[0]).toHaveTextContent("5'");
  });

  it("defaults lines beyond the first 4 to hidden, so they don't overflow the pill row", () => {
    render(
      <OddsChart
        lines={[
          { label: "Home", points: [{ minute: 5, odd: "1.50", capturedAt: "t" }] },
          { label: "Draw", points: [{ minute: 5, odd: "3.00", capturedAt: "t" }] },
          { label: "Away", points: [{ minute: 5, odd: "5.00", capturedAt: "t" }] },
          { label: "Over", points: [{ minute: 5, odd: "1.90", capturedAt: "t" }] },
          { label: "Under", points: [{ minute: 5, odd: "1.90", capturedAt: "t" }] },
        ]}
        colors={["#111111", "#222222", "#333333", "#444444", "#555555"]}
        brand={brand}
      />,
    );

    expect(screen.getByRole("button", { name: "Home" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Draw" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Away" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Over" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Under" })).toHaveAttribute("aria-pressed", "false");
  });

  it("renders a toggle pill per line, all active by default", () => {
    render(
      <OddsChart
        lines={[
          { label: "Home", points: [{ minute: 5, odd: "1.50", capturedAt: "t" }] },
          { label: "Away", points: [{ minute: 5, odd: "2.50", capturedAt: "t" }] },
        ]}
        colors={["#111111", "#222222"]}
        brand={brand}
      />,
    );

    expect(screen.getByRole("button", { name: "Home" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Away" })).toHaveAttribute("aria-pressed", "true");
  });

  it("clicking a line's pill hides only that line's path", () => {
    render(
      <OddsChart
        lines={[
          { label: "Home", points: [{ minute: 5, odd: "1.50", capturedAt: "t" }] },
          { label: "Away", points: [{ minute: 5, odd: "2.50", capturedAt: "t" }] },
        ]}
        colors={["#111111", "#222222"]}
        brand={brand}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Home" }));

    expect(screen.queryByTestId("odds-chart-path-0")).not.toBeInTheDocument();
    expect(screen.getByTestId("odds-chart-path-1")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Home" })).toHaveAttribute("aria-pressed", "false");
  });

  it("clicking a pill twice restores that line", () => {
    render(
      <OddsChart
        lines={[{ label: "Home", points: [{ minute: 5, odd: "1.50", capturedAt: "t" }] }]}
        colors={["#111111"]}
        brand={brand}
      />,
    );

    const toggle = screen.getByRole("button", { name: "Home" });
    fireEvent.click(toggle);
    fireEvent.click(toggle);

    expect(screen.getByTestId("odds-chart-path-0")).toBeInTheDocument();
    expect(toggle).toHaveAttribute("aria-pressed", "true");
  });

  it("computes Y position in log space, so a wide-swinging line doesn't flatten a tighter one sharing the axis", () => {
    render(
      <OddsChart
        lines={[
          { label: "Home", points: [{ minute: 5, odd: "1.5", capturedAt: "t" }] },
          { label: "Draw", points: [{ minute: 5, odd: "3.0", capturedAt: "t" }] },
          { label: "Away", points: [{ minute: 5, odd: "15.0", capturedAt: "t" }] },
        ]}
        colors={["#111111", "#222222", "#333333"]}
        brand={brand}
      />,
    );

    // ln(1.5)=0.405465, ln(3.0)=1.098612, ln(15.0)=2.708050
    // range=2.302585, pad=0.2302585 -> log-domain [0.175206, 2.938309]
    // y = 30 + (2.938309 - ln(value)) / 2.763103 * 160
    // Home is the min -> boundary-point fraction (1+p)/(1+2p) = 1.1/1.2 -> y=176.67; Draw -> y=136.53; Away -> y=43.33
    expect(screen.getByTestId("odds-chart-path-0")).toHaveAttribute("d", "M 95.00 176.67");
    expect(screen.getByTestId("odds-chart-path-1")).toHaveAttribute("d", "M 95.00 136.53");
    expect(screen.getByTestId("odds-chart-path-2")).toHaveAttribute("d", "M 95.00 43.33");
  });

  it("keeps every line's Y domain fixed from all lines, regardless of visibility toggles", () => {
    render(
      <OddsChart
        lines={[
          {
            label: "Home",
            points: [
              { minute: 5, odd: "1.50", capturedAt: "t" },
              { minute: 30, odd: "1.60", capturedAt: "t" },
            ],
          },
          {
            label: "Away",
            points: [{ minute: 5, odd: "5.00", capturedAt: "t" }],
          },
        ]}
        colors={["#111111", "#222222"]}
        brand={brand}
      />,
    );

    // Domain from all lines regardless of visibility: ln(1.50)=0.405465, ln(1.60)=0.470004, ln(5.00)=1.609438
    // range=1.203973, pad=0.1203973 -> log-domain [0.285068, 1.729835]
    // Home minute 30 (ln 0.470004) -> y = 30 + (1.729835-0.470004)/1.444767*160 = 169.52
    expect(screen.getByTestId("odds-chart-path-0")).toHaveAttribute(
      "d",
      "M 95.00 176.67 L 470.00 169.52",
    );

    fireEvent.click(screen.getByRole("button", { name: "Away" }));

    // Away hidden but still counted in the domain -> Home's shape must not change
    expect(screen.getByTestId("odds-chart-path-0")).toHaveAttribute(
      "d",
      "M 95.00 176.67 L 470.00 169.52",
    );
  });

  it("falls back to a small fixed padding when the visible range is flat (all equal values)", () => {
    render(
      <OddsChart
        lines={[
          {
            label: "Flat",
            points: [
              { minute: 5, odd: "2.00", capturedAt: "t" },
              { minute: 30, odd: "2.00", capturedAt: "t" },
            ],
          },
        ]}
        colors={["#123456"]}
        brand={brand}
      />,
    );

    // range=0 -> fixed pad 0.05 -> domain [1.95, 2.05], both points at midline y=110.00
    expect(screen.getByTestId("odds-chart-path-0")).toHaveAttribute(
      "d",
      "M 95.00 110.00 L 470.00 110.00",
    );
  });
});
