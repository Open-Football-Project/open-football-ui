import { useState } from "react";
import {
  TeamStatistic,
  buildTeamStatsSvgString,
  getTeamStatsSvgH,
  TEAM_STATS_SVG_W,
  SITE_DOMAIN,
} from "open-football-project-core";
import { useTranslation } from "react-i18next";
import { svgToPng } from "../../../converter/svg-png-converter/svg-png-converter";
import { SocialSharing } from "../social-sharing/SocialSharing";

interface StatChartProps {
  title: string;
  statistics: TeamStatistic[];
  logo?: string;
}

const TeamStats = ({ title, statistics, logo }: StatChartProps) => {
  const { t } = useTranslation();
  const [downloading, setDownloading] = useState(false);
  const getBarColor = (percent: number, isPositve: boolean) => {
    if (isPositve && percent <= 20) return "bg-brand-danger";
    if (isPositve && percent > 20 && percent <= 50) return "bg-brand-yellowa";
    if (isPositve && percent > 50) return "bg-brand-success";

    if (!isPositve && percent <= 20) return "bg-brand-success";
    if (!isPositve && percent > 20 && percent <= 50) return "bg-brand-yellowa";
    if (!isPositve && percent > 50) return "bg-brand-danger";

    return "bg-brand-aqua";
  };

  const displayedName = (statName: string): string => {
    if (statName.includes("_")) {
      return statName.replace("_", " ").trim().toUpperCase();
    }
    return statName.trim();
  };

  const widthPercent = (stat: TeamStatistic) =>
    `${Math.min((stat.value / stat.total) * 100, 100)}%`;

  const translationKey = (statDisplayed: string) =>
    statDisplayed.trim().toLowerCase().replace(/\s+/g, "_");

  const statLabel = (statName: string): string =>
    t(`stats.${translationKey(displayedName(statName))}`).toUpperCase();

  const handleShare = () => {
    const lines = [
      `📊 ${title}`,
      ...statistics.map((stat) => `${statLabel(stat.name)}: ${stat.value}`),
      SITE_DOMAIN,
    ];
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(lines.join("\n"))}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      const svgString = buildTeamStatsSvgString({
        title,
        statistics,
        logo,
        statLabel,
      });
      const doc = new DOMParser().parseFromString(svgString, "image/svg+xml");
      const svgEl = doc.documentElement as unknown as SVGSVGElement;
      const filename = `footballproject-${title.replace(/\s+/g, "-").toLowerCase()}-stats.png`;
      await svgToPng(
        svgEl,
        filename,
        TEAM_STATS_SVG_W,
        getTeamStatsSvgH(statistics.length),
      );
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="bg-brand-navbar p-2 rounded-lg w-full">
      <div className="flex-1 flex items-left justify-start gap-1 min-w-[80px] mb-8">
        {logo && (
          <img
            src={logo}
            alt={title}
            className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
          />
        )}
        <span className="truncate font-semibold text-sm sm:text-lg">
          {title}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {statistics.map((stat, idx) => {
          return (
            <div
              data-testid={`${title}-stat-${idx}`}
              key={stat.name}
              className="flex flex-col mb-2"
            >
              <div className="flex justify-between mb-1">
                <span className="text-[12px] text-brand-white truncate">
                  {statLabel(stat.name)}
                </span>
                <span className="text-xs font-bold text-brand-yellow">
                  {stat.value}
                </span>
              </div>
              <div className="w-full h-2 bg-brand-darkBg rounded">
                <div
                  role="progressbar"
                  className={`h-2 rounded ${getBarColor(
                    Number(widthPercent(stat).replace("%", "")),
                    stat.isPositive,
                  )}`}
                  style={{ width: widthPercent(stat) }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 pt-3 border-t border-brand-darkBg">
        <SocialSharing
          handleShare={handleShare}
          handleDownload={handleDownload}
          downloading={downloading}
        />
      </div>
    </div>
  );
};

export default TeamStats;
