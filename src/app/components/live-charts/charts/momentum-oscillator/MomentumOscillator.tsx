import { useEffect, useRef, useState } from "react";
import {
  LiveChartPoint,
  MomentumOscillatorBrandColor,
  spreadMinutesToX,
} from "@matchinsights/core";

const PADDING_X = 20;
const PADDING_Y = 30;
const PLOT_AREA_H = 220;
const TIME_AXIS_H = 30;
const SVG_H = PLOT_AREA_H + TIME_AXIS_H;
const MAX_MATCH_MINUTES = 130;
const MIN_PIXELS_PER_MINUTE = 15;
const MIN_SVG_W = PADDING_X * 2 + MAX_MATCH_MINUTES * MIN_PIXELS_PER_MINUTE;
const CENTER_Y = PLOT_AREA_H / 2;
const LATEST_LINE_LENGTH = 40;

interface MomentumOscillatorChartProps {
  points: LiveChartPoint[];
  brand: MomentumOscillatorBrandColor;
  homeTeamName: string;
  awayTeamName: string;
}

const valueToY = (value: number): number => {
  const usableHeight = PLOT_AREA_H - PADDING_Y * 2;
  return CENTER_Y - (value / 100) * (usableHeight / 2);
};

const uniqueMinutes = (points: LiveChartPoint[]): number[] => [
  ...new Set(points.map((point) => point.minute)),
];

export const MomentumOscillatorChart = ({
  points,
  brand,
  homeTeamName,
  awayTeamName,
}: MomentumOscillatorChartProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const axisLabelColor = brand.axisLabel ?? brand.divider;

  const svgW = Math.max(MIN_SVG_W, containerWidth);
  const pixelsPerMinute = (svgW - PADDING_X * 2) / MAX_MATCH_MINUTES;
  const minuteToX = (minute: number): number => PADDING_X + minute * pixelsPerMinute;

  const toPathD = (chartPoints: LiveChartPoint[]): string =>
    spreadMinutesToX(chartPoints, pixelsPerMinute, PADDING_X)
      .map(
        ({ point, x }, index) =>
          `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${valueToY(point.value).toFixed(2)}`,
      )
      .join(" ");

  const positionedPoints = spreadMinutesToX(points, pixelsPerMinute, PADDING_X);
  const latest = positionedPoints.length > 0 ? positionedPoints[positionedPoints.length - 1] : undefined;
  const latestColor = latest && latest.point.value < 0 ? brand.negative : brand.positive;

  useEffect(() => {
    const updateWidth = () => setContainerWidth(scrollRef.current?.clientWidth ?? 0);
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  return (
    <div ref={scrollRef} className="w-full overflow-x-auto">
      <svg
        width={svgW}
        height={SVG_H}
        viewBox={`0 0 ${svgW} ${SVG_H}`}
        className="block"
        data-testid="momentum-oscillator-chart"
      >
        <defs>
          <clipPath id="momentum-positive-clip">
            <rect x={0} y={0} width={svgW} height={CENTER_Y} />
          </clipPath>
          <clipPath id="momentum-negative-clip">
            <rect x={0} y={CENTER_Y} width={svgW} height={PLOT_AREA_H - CENTER_Y} />
          </clipPath>
        </defs>
        <rect
          data-testid="momentum-oscillator-background"
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
              data-testid="momentum-oscillator-tick"
              x1={x}
              y1={PADDING_Y}
              x2={x}
              y2={PLOT_AREA_H - PADDING_Y}
              stroke={brand.divider}
              strokeWidth={1}
            />
          );
        })}
        {points.length > 0 && (
          <>
            <path
              data-testid="momentum-oscillator-path-positive"
              d={toPathD(points)}
              fill="none"
              stroke={brand.positive}
              strokeWidth={2}
              clipPath="url(#momentum-positive-clip)"
              style={{ transition: "d 0.6s ease" }}
            />
            <path
              data-testid="momentum-oscillator-path-negative"
              d={toPathD(points)}
              fill="none"
              stroke={brand.negative}
              strokeWidth={2}
              clipPath="url(#momentum-negative-clip)"
              style={{ transition: "d 0.6s ease" }}
            />
          </>
        )}
        <text x={PADDING_X} y={20} fontSize={10} fill={brand.positive} fontFamily="sans-serif">
          {homeTeamName}
        </text>
        <text
          x={PADDING_X}
          y={PLOT_AREA_H - 10}
          fontSize={10}
          fill={brand.negative}
          fontFamily="sans-serif"
        >
          {awayTeamName}
        </text>
        {latest && (
          <>
            <polyline
              data-testid="momentum-oscillator-latest-line"
              points={`${latest.x.toFixed(2)},${valueToY(latest.point.value).toFixed(2)} ${(
                latest.x + LATEST_LINE_LENGTH
              ).toFixed(2)},${valueToY(latest.point.value).toFixed(2)}`}
              stroke={latestColor}
              strokeDasharray="4 2"
              fill="none"
            />
            <text
              data-testid="momentum-oscillator-latest-label"
              x={(latest.x + LATEST_LINE_LENGTH + 4).toFixed(2)}
              y={valueToY(latest.point.value).toFixed(2)}
              fontSize={8}
              fill={latestColor}
              fontFamily="sans-serif"
            >
              {latest.point.value}
            </text>
          </>
        )}
        {uniqueMinutes(points).map((minute) => (
          <text
            key={minute}
            data-testid="momentum-oscillator-tick-label"
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
  );
};
