import { useTranslation } from "react-i18next";
import { IndicatorResult } from "open-football-project-core";

import {
  LIVE_MATCH_INDICATORS_CHART_COLORS as CHART_COLORS,
  LIVE_MATCH_INDICATORS_DONUT as DONUT,
  LIVE_MATCH_INDICATORS_VERDICT_COLORS as VERDICT_COLORS,
  LIVE_MATCH_INDICATORS_VERDICT_THRESHOLDS as VERDICT_THRESHOLDS,
} from "./constants";

interface IndicatorPieChartProps {
  indicator: IndicatorResult;
  homeTeamName: string;
  awayTeamName: string;
  hasData: boolean;
}

const toVerdictTextColor = (homePercent: number, hasData: boolean): string => {
  if (!hasData) return VERDICT_COLORS.contested;
  if (homePercent >= VERDICT_THRESHOLDS.leading)
    return VERDICT_COLORS.homeLeading;
  if (homePercent <= VERDICT_THRESHOLDS.trailing)
    return VERDICT_COLORS.awayLeading;
  return VERDICT_COLORS.contested;
};

const toVerdictLabel = (
  homePercent: number,
  homeTeamName: string,
  awayTeamName: string,
  hasData: boolean,
  t: (key: string, opts?: Record<string, string>) => string,
): string => {
  if (!hasData) return t("indicators.verdict.no_data");
  if (homePercent >= VERDICT_THRESHOLDS.dominating)
    return t("indicators.verdict.dominating", { team: homeTeamName });
  if (homePercent >= VERDICT_THRESHOLDS.leading)
    return t("indicators.verdict.ahead", { team: homeTeamName });
  if (homePercent > VERDICT_THRESHOLDS.trailing)
    return t("indicators.verdict.even");
  if (homePercent > VERDICT_THRESHOLDS.dominated)
    return t("indicators.verdict.ahead", { team: awayTeamName });
  return t("indicators.verdict.dominating", { team: awayTeamName });
};

const toHomeDashLength = (homePercent: number, hasData: boolean): number =>
  hasData ? (homePercent / 100) * DONUT.circumference : 0;

export const LiveMatchPieChart = ({
  indicator,
  homeTeamName,
  awayTeamName,
  hasData,
}: IndicatorPieChartProps) => {
  const { t } = useTranslation();

  const homeDash = toHomeDashLength(indicator.homePercent, hasData);
  const verdict = toVerdictLabel(
    indicator.homePercent,
    homeTeamName,
    awayTeamName,
    hasData,
    t,
  );
  const verdictTextColor = toVerdictTextColor(indicator.homePercent, hasData);

  return (
    <div className="flex flex-col items-center gap-1 flex-1 min-w-0">
      <span className="text-[10px] sm:text-[11px] font-semibold text-brand-lightGray text-center leading-tight">
        {indicator.emoji} {t(indicator.label)}
      </span>

      <svg viewBox="0 0 100 100" className="w-20 h-20 sm:w-24 sm:h-24">
        <circle
          cx={DONUT.center}
          cy={DONUT.center}
          r={DONUT.radius}
          fill="none"
          stroke={CHART_COLORS.track}
          strokeWidth={DONUT.strokeWidth}
        />
        <circle
          cx={DONUT.center}
          cy={DONUT.center}
          r={DONUT.radius}
          fill="none"
          stroke={CHART_COLORS.awayTeam}
          strokeWidth={DONUT.strokeWidth}
        />
        <circle
          cx={DONUT.center}
          cy={DONUT.center}
          r={DONUT.radius}
          fill="none"
          stroke={CHART_COLORS.homeTeam}
          strokeWidth={DONUT.strokeWidth}
          strokeDasharray={`${homeDash} ${DONUT.circumference}`}
          transform={`rotate(-90 ${DONUT.center} ${DONUT.center})`}
          style={{ transition: "stroke-dasharray 0.6s ease" }}
        />
        <line
          x1="38"
          y1="51"
          x2="62"
          y2="51"
          stroke={CHART_COLORS.divider}
          strokeWidth="1"
        />
        <text
          x={DONUT.center}
          y="46"
          textAnchor="middle"
          fontSize="10"
          fill={CHART_COLORS.homeTeam}
          fontWeight="bold"
        >
          {Math.round(indicator.homePercent)}%
        </text>
        <text
          x={DONUT.center}
          y="62"
          textAnchor="middle"
          fontSize="10"
          fill={CHART_COLORS.awayTeam}
          fontWeight="bold"
        >
          {Math.round(indicator.awayPercent)}%
        </text>
      </svg>

      <span
        className={`text-[9px] sm:text-[10px] font-bold text-center leading-tight ${verdictTextColor}`}
      >
        {verdict}
      </span>

      <div className="flex justify-between w-full px-1 gap-2 mt-0.5">
        <div className="flex items-center gap-1 min-w-0">
          <div className="w-2 h-2 rounded-full bg-brand-orange flex-shrink-0" />
          <span className="text-[9px] sm:text-[10px] text-white truncate">
            {homeTeamName}
          </span>
        </div>
        <div className="flex items-center gap-1 min-w-0 justify-end">
          <span className="text-[9px] sm:text-[10px] text-white truncate">
            {awayTeamName}
          </span>
          <div className="w-2 h-2 rounded-full bg-brand-aqualight flex-shrink-0" />
        </div>
      </div>
    </div>
  );
};
