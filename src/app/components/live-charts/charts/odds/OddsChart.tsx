import { Fragment, useEffect, useRef, useState } from "react";
import { BetOddsPoint, spreadMinutesToX, resolveLabelOverlap } from "open-football-project-core";

const PADDING_X = 20;
const PADDING_Y = 30;
const PLOT_AREA_H = 220;
const TIME_AXIS_H = 30;
const SVG_H = PLOT_AREA_H + TIME_AXIS_H;
const MAX_MATCH_MINUTES = 130;
const MIN_PIXELS_PER_MINUTE = 15;
const MIN_SVG_W = PADDING_X * 2 + MAX_MATCH_MINUTES * MIN_PIXELS_PER_MINUTE;
const RANGE_PADDING_RATIO = 0.1;
const FLAT_RANGE_PADDING = 0.05;
const MIN_LABEL_GAP = 10;
const LATEST_LINE_LENGTH = 40;
const BASELINE_Y = PLOT_AREA_H / 2;
const MAX_DEFAULT_VISIBLE_LINES = 4;

interface OddsChartLine {
  label: string;
  points: BetOddsPoint[];
}

interface OddsChartBrandColor {
  darkBg: string;
  divider: string;
  axisLabel?: string;
}

interface OddsChartProps {
  lines: OddsChartLine[];
  colors: string[];
  brand: OddsChartBrandColor;
}

interface TogglePillProps {
  label: string;
  color: string;
  active: boolean;
  onToggle: () => void;
}

const TogglePill = ({ label, color, active, onToggle }: TogglePillProps) => (
  <button
    type="button"
    aria-pressed={active}
    onClick={onToggle}
    style={{ backgroundColor: color, opacity: active ? 1 : 0.4 }}
    className="px-3 py-1 rounded-full text-xs font-semibold text-white"
  >
    {label}
  </button>
);

const uniqueMinutes = (lines: OddsChartLine[]): number[] => [
  ...new Set(lines.flatMap((line) => line.points.map((point) => point.minute))),
];

const yDomain = (logValues: number[]): [number, number] => {
  const min = Math.min(...logValues);
  const max = Math.max(...logValues);
  const range = max - min;
  const pad = range === 0 ? FLAT_RANGE_PADDING : range * RANGE_PADDING_RATIO;
  return [min - pad, max + pad];
};

export const OddsChart = ({ lines, colors, brand }: OddsChartProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [visible, setVisible] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(lines.map((line, index) => [line.label, index < MAX_DEFAULT_VISIBLE_LINES])),
  );
  const axisLabelColor = brand.axisLabel ?? brand.divider;

  const svgW = Math.max(MIN_SVG_W, containerWidth);
  const pixelsPerMinute = (svgW - PADDING_X * 2) / MAX_MATCH_MINUTES;
  const minuteToX = (minute: number): number => PADDING_X + minute * pixelsPerMinute;

  useEffect(() => {
    const updateWidth = () => setContainerWidth(scrollRef.current?.clientWidth ?? 0);
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const allLogValues = lines.flatMap((line) =>
    line.points.map((point) => Math.log(parseFloat(point.odd))),
  );

  const usableHeight = PLOT_AREA_H - PADDING_Y * 2;
  const [yMin, yMax] = allLogValues.length > 0 ? yDomain(allLogValues) : [0, 1];

  const valueToY = (odd: string): number => {
    const value = Math.log(parseFloat(odd));
    return PADDING_Y + ((yMax - value) / (yMax - yMin)) * usableHeight;
  };

  const toPathD = (points: BetOddsPoint[]): string =>
    spreadMinutesToX(points, pixelsPerMinute, PADDING_X)
      .map(
        ({ point, x }, index) =>
          `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${valueToY(point.odd).toFixed(2)}`,
      )
      .join(" ");

  const latestLabels = resolveLabelOverlap(
    lines.flatMap((line, index) => {
      if (line.points.length === 0 || !visible[line.label]) return [];
      const positioned = spreadMinutesToX(line.points, pixelsPerMinute, PADDING_X);
      const last = positioned[positioned.length - 1];
      const targetY = valueToY(last.point.odd);
      return [
        {
          index,
          x: last.x,
          targetY,
          y: targetY,
          value: last.point.odd,
          color: colors[index % colors.length],
        },
      ];
    }),
    MIN_LABEL_GAP,
  );

  return (
    <div>
      <div ref={scrollRef} className="w-full overflow-x-auto">
        <svg
          width={svgW}
          height={SVG_H}
          viewBox={`0 0 ${svgW} ${SVG_H}`}
          className="block"
          data-testid="odds-chart"
        >
          <rect
            data-testid="odds-chart-background"
            width={svgW}
            height={SVG_H}
            fill={brand.darkBg}
          />
          <line
            data-testid="odds-chart-baseline"
            x1={PADDING_X}
            y1={BASELINE_Y}
            x2={svgW - PADDING_X}
            y2={BASELINE_Y}
            stroke={brand.divider}
            strokeWidth={1}
          />
          {uniqueMinutes(lines).map((minute) => (
            <line
              key={minute}
              data-testid="odds-chart-tick"
              x1={minuteToX(minute)}
              y1={PADDING_Y}
              x2={minuteToX(minute)}
              y2={PLOT_AREA_H - PADDING_Y}
              stroke={brand.divider}
              strokeWidth={1}
            />
          ))}
          {lines.map((line, index) => {
            if (line.points.length === 0 || !visible[line.label]) return null;
            return (
              <path
                key={line.label}
                data-testid={`odds-chart-path-${index}`}
                d={toPathD(line.points)}
                fill="none"
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                style={{ transition: "d 0.6s ease" }}
              />
            );
          })}
          {latestLabels.map((label) => (
            <Fragment key={label.index}>
              <polyline
                data-testid={`odds-chart-latest-line-${label.index}`}
                points={`${label.x.toFixed(2)},${label.targetY.toFixed(2)} ${(
                  label.x + LATEST_LINE_LENGTH
                ).toFixed(2)},${label.targetY.toFixed(2)}`}
                stroke={label.color}
                strokeDasharray="4 2"
                fill="none"
              />
              <text
                data-testid={`odds-chart-latest-label-${label.index}`}
                x={(label.x + LATEST_LINE_LENGTH + 4).toFixed(2)}
                y={label.y.toFixed(2)}
                fontSize={8}
                fill={label.color}
                fontFamily="sans-serif"
              >
                {label.value}
              </text>
            </Fragment>
          ))}
          {uniqueMinutes(lines).map((minute) => (
            <text
              key={minute}
              data-testid="odds-chart-tick-label"
              x={minuteToX(minute)}
              y={PLOT_AREA_H + 22}
              textAnchor="middle"
              fontSize={8}
              fill={axisLabelColor}
              fontFamily="sans-serif"
            >
              {minute}&apos;
            </text>
          ))}
        </svg>
      </div>
      <div className="flex gap-2 mt-2 flex-wrap">
        {lines.map((line, index) => (
          <TogglePill
            key={line.label}
            label={line.label}
            color={colors[index % colors.length]}
            active={visible[line.label]}
            onToggle={() =>
              setVisible((current) => ({
                ...current,
                [line.label]: !current[line.label],
              }))
            }
          />
        ))}
      </div>
    </div>
  );
};
