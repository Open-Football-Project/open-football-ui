import {
  TwoTeamsStatistics,
  IndicatorResult,
  useLiveIndicators,
  buildLiveIndicatorsDonutsSvgString,
  LIVE_MATCH_DONUTS_SVG_W,
  LIVE_MATCH_DONUTS_SVG_H,
} from "@matchinsights/core";
import { FaXTwitter } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import { useCallback, useState } from "react";
import { svgToPng } from "../../../converter/svg-png-converter/svg-png-converter";
import { LiveMatchPieChart } from "./pie-chart/LiveMatchPieChart";
import {
  LIVE_MATCH_INDICATORS_BRAND,
  LIVE_MATCH_INDICATORS_DONUT,
  LIVE_MATCH_INDICATORS_VERDICT_THRESHOLDS,
} from "./pie-chart/constants";

const DONUT_TRKEYS = {
  veredictDominating: "indicators.verdict.dominating",
  veredictAhead: "indicators.verdict.ahead",
  veredictEven: "indicators.verdict.even",
  veredictDominated: "indicators.verdict.dominating",
  veredictNoData: "indicators.verdict.no_data",
} as const;

type TFunction = (key: string, opts?: Record<string, string>) => string;

interface MatchLiveIndicatorsProps {
  liveStats: TwoTeamsStatistics | undefined;
  homeTeamName: string;
  awayTeamName: string;
}

const formatIndicatorLine = (
  indicator: IndicatorResult,
  homeTeamName: string,
  awayTeamName: string,
  t: TFunction,
): string =>
  `${indicator.emoji} ${t(indicator.label)}: ${homeTeamName} ${indicator.homePercent}% · ${awayTeamName} ${indicator.awayPercent}%`;

const buildShareText = (
  homeTeamName: string,
  awayTeamName: string,
  momentum: IndicatorResult,
  control: IndicatorResult,
  goalThreat: IndicatorResult,
  t: TFunction,
): string =>
  [
    `⚽ ${homeTeamName} vs ${awayTeamName} — ${t("indicators.live_insights")}`,
    formatIndicatorLine(momentum, homeTeamName, awayTeamName, t),
    formatIndicatorLine(control, homeTeamName, awayTeamName, t),
    formatIndicatorLine(goalThreat, homeTeamName, awayTeamName, t),
    ``,
    `#Football #LiveFootball #Futballero`,
  ].join("\n");

const MatchLiveIndicators = ({
  liveStats,
  homeTeamName,
  awayTeamName,
}: MatchLiveIndicatorsProps) => {
  const { t } = useTranslation();
  const { control, momentum, goalThreat, hasData } =
    useLiveIndicators(liveStats);
  const [downloading, setDownloading] = useState(false);

  const handleShare = () => {
    const text = buildShareText(
      homeTeamName,
      awayTeamName,
      momentum,
      control,
      goalThreat,
      t,
    );
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const handleDownload = useCallback(async () => {
    if (!hasData || downloading) return;
    setDownloading(true);
    try {
      const svgString = buildLiveIndicatorsDonutsSvgString(
        homeTeamName,
        awayTeamName,
        momentum,
        control,
        goalThreat,
        hasData,
        t,
        LIVE_MATCH_INDICATORS_DONUT,
        LIVE_MATCH_INDICATORS_BRAND,
        LIVE_MATCH_INDICATORS_VERDICT_THRESHOLDS,
        DONUT_TRKEYS,
      );
      const doc = new DOMParser().parseFromString(svgString, "image/svg+xml");
      const svgEl = doc.documentElement as unknown as SVGSVGElement;
      const filename = `${homeTeamName}-vs-${awayTeamName}-live.png`
        .replace(/\s+/g, "-")
        .toLowerCase();
      await svgToPng(
        svgEl,
        filename,
        LIVE_MATCH_DONUTS_SVG_W,
        LIVE_MATCH_DONUTS_SVG_H,
      );
    } finally {
      setDownloading(false);
    }
  }, [
    hasData,
    downloading,
    homeTeamName,
    awayTeamName,
    momentum,
    control,
    goalThreat,
    t,
  ]);

  return (
    <div className="bg-brand-card rounded-lg p-4 ring-1 ring-gray-500">
      <div className="flex items-start gap-2 sm:gap-4">
        <LiveMatchPieChart
          indicator={momentum}
          homeTeamName={homeTeamName}
          awayTeamName={awayTeamName}
          hasData={hasData}
        />
        <div className="w-px self-stretch bg-brand-darkBg" />
        <LiveMatchPieChart
          indicator={control}
          homeTeamName={homeTeamName}
          awayTeamName={awayTeamName}
          hasData={hasData}
        />
        <div className="w-px self-stretch bg-brand-darkBg" />
        <LiveMatchPieChart
          indicator={goalThreat}
          homeTeamName={homeTeamName}
          awayTeamName={awayTeamName}
          hasData={hasData}
        />
      </div>

      <div className="flex justify-center gap-3 mt-4 pt-3 border-t border-brand-darkBg">
        <button
          onClick={handleShare}
          disabled={!hasData}
          className="flex items-center gap-2 bg-brand-gray hover:bg-neutral-800 text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <FaXTwitter className="w-3.5 h-3.5" />
          {t("indicators.share_on_x")}
        </button>
        <button
          onClick={handleDownload}
          disabled={!hasData || downloading}
          className="flex items-center gap-2 bg-brand-yellow text-brand-darkBg text-xs font-semibold px-4 py-2 rounded-full hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {downloading
            ? "…"
            : t("indicators.download_png", { defaultValue: "Download PNG" })}
        </button>
      </div>
    </div>
  );
};

export default MatchLiveIndicators;
