import { Fragment, useEffect, useRef, useState } from "react";
import { LiveChartPoint, spreadMinutesToX, resolveLabelOverlap } from "@matchinsights/core";

const PADDING_X = 20;
const PADDING_Y = 30;
const PLOT_AREA_H = 220;
const TIME_AXIS_H = 30;
const SVG_H = PLOT_AREA_H + TIME_AXIS_H;
const MAX_MATCH_MINUTES = 130;
const MIN_PIXELS_PER_MINUTE = 15;
const MIN_SVG_W = PADDING_X * 2 + MAX_MATCH_MINUTES * MIN_PIXELS_PER_MINUTE;
const CENTER_Y = PLOT_AREA_H / 2;
const MIN_LABEL_GAP = 10;
const LATEST_LINE_LENGTH = 40;

interface PercentageChartBrandColor {
  home: string;
  away: string;
  darkBg: string;
  divider: string;
  axisLabel?: string;
}

interface PercentageChartProps {
  points: LiveChartPoint[];
  brand: PercentageChartBrandColor;
  homeTeamName: string;
  awayTeamName: string;
}

const valueToY = (value: number): number => {
  const usableHeight = PLOT_AREA_H - PADDING_Y * 2;
  return CENTER_Y - ((value - 50) / 50) * (usableHeight / 2);
};

const uniqueMinutes = (points: LiveChartPoint[]): number[] => [
  ...new Set(points.map((point) => point.minute)),
];

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

export const PercentageChart = ({ points, brand, homeTeamName, awayTeamName }: PercentageChartProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [visible, setVisible] = useState({ home: true, away: true });
  const axisLabelColor = brand.axisLabel ?? brand.divider;
  const hasPoints = points.length > 0;

  const svgW = Math.max(MIN_SVG_W, containerWidth);
  const pixelsPerMinute = (svgW - PADDING_X * 2) / MAX_MATCH_MINUTES;
  const minuteToX = (minute: number): number => PADDING_X + minute * pixelsPerMinute;

  const toPathD = (chartPoints: LiveChartPoint[], toValue: (value: number) => number): string =>
    spreadMinutesToX(chartPoints, pixelsPerMinute, PADDING_X)
      .map(
        ({ point, x }, index) =>
          `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${valueToY(toValue(point.value)).toFixed(2)}`,
      )
      .join(" ");

  const positionedPoints = spreadMinutesToX(points, pixelsPerMinute, PADDING_X);
  const latest = positionedPoints.length > 0 ? positionedPoints[positionedPoints.length - 1] : undefined;

  const latestLabels = latest
    ? resolveLabelOverlap(
        [
          ...(visible.home
            ? [
                {
                  key: "home",
                  x: latest.x,
                  targetY: valueToY(latest.point.value),
                  y: valueToY(latest.point.value),
                  value: latest.point.value,
                  color: brand.home,
                },
              ]
            : []),
          ...(visible.away
            ? [
                {
                  key: "away",
                  x: latest.x,
                  targetY: valueToY(100 - latest.point.value),
                  y: valueToY(100 - latest.point.value),
                  value: 100 - latest.point.value,
                  color: brand.away,
                },
              ]
            : []),
        ],
        MIN_LABEL_GAP,
      )
    : [];

  useEffect(() => {
    const updateWidth = () => setContainerWidth(scrollRef.current?.clientWidth ?? 0);
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  return (
    <div>
      <div ref={scrollRef} className="w-full overflow-x-auto">
        <svg
          width={svgW}
          height={SVG_H}
          viewBox={`0 0 ${svgW} ${SVG_H}`}
          className="block"
          data-testid="percentage-chart"
        >
          <rect
            data-testid="percentage-chart-background"
            width={svgW}
            height={SVG_H}
            fill={brand.darkBg}
          />
          <line
            x1={PADDING_X}
            y1={CENTER_Y}
            x2={svgW - PADDING_X}
            y2={CENTER_Y}
            stroke={brand.divider}
            strokeWidth={1}
          />
          {uniqueMinutes(points).map((minute) => {
            const x = minuteToX(minute);
            return (
              <line
                key={minute}
                data-testid="percentage-chart-tick"
                x1={x}
                y1={PADDING_Y}
                x2={x}
                y2={PLOT_AREA_H - PADDING_Y}
                stroke={brand.divider}
                strokeWidth={1}
              />
            );
          })}
          {hasPoints && visible.home && (
            <path
              data-testid="percentage-chart-path-home"
              d={toPathD(points, (value) => value)}
              fill="none"
              stroke={brand.home}
              strokeWidth={2}
              style={{ transition: "d 0.6s ease" }}
            />
          )}
          {hasPoints && visible.away && (
            <path
              data-testid="percentage-chart-path-away"
              d={toPathD(points, (value) => 100 - value)}
              fill="none"
              stroke={brand.away}
              strokeWidth={2}
              style={{ transition: "d 0.6s ease" }}
            />
          )}
          <text x={PADDING_X} y={20} fontSize={10} fill={brand.home} fontFamily="sans-serif">
            {homeTeamName}
          </text>
          <text
            x={PADDING_X}
            y={PLOT_AREA_H - 10}
            fontSize={10}
            fill={brand.away}
            fontFamily="sans-serif"
          >
            {awayTeamName}
          </text>
          {latestLabels.map((label) => (
            <Fragment key={label.key}>
              <polyline
                data-testid={`percentage-chart-latest-line-${label.key}`}
                points={`${label.x.toFixed(2)},${label.targetY.toFixed(2)} ${(
                  label.x + LATEST_LINE_LENGTH
                ).toFixed(2)},${label.targetY.toFixed(2)}`}
                stroke={label.color}
                strokeDasharray="4 2"
                fill="none"
              />
              <text
                data-testid={`percentage-chart-latest-label-${label.key}`}
                x={(label.x + LATEST_LINE_LENGTH + 4).toFixed(2)}
                y={label.y.toFixed(2)}
                fontSize={8}
                fill={label.color}
                fontFamily="sans-serif"
              >
                {label.value.toFixed(0)}
              </text>
            </Fragment>
          ))}
          {uniqueMinutes(points).map((minute) => (
            <text
              key={minute}
              data-testid="percentage-chart-tick-label"
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
      <div className="flex gap-2 mt-2">
        <TogglePill
          label={homeTeamName}
          color={brand.home}
          active={visible.home}
          onToggle={() => setVisible((current) => ({ ...current, home: !current.home }))}
        />
        <TogglePill
          label={awayTeamName}
          color={brand.away}
          active={visible.away}
          onToggle={() => setVisible((current) => ({ ...current, away: !current.away }))}
        />
      </div>
    </div>
  );
};
