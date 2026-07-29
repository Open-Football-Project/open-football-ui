import { BetMarketInfo, ChartPanel, ChartPanelType } from "open-football-project-core";

type TranslateFn = (key: string, options?: { defaultValue?: string }) => string;

const NUMERIC_LABEL_PATTERN = /^\d+(-\d+)?$/;

export const translateOutcomeLabel = (label: string, t: TranslateFn): string => {
  if (NUMERIC_LABEL_PATTERN.test(label)) return label;

  const key = label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  return t(`charts.marketOutcomes.${key}`, { defaultValue: label });
};

export const marketToPanel = (
  market: BetMarketInfo,
  homeTeamName: string,
  awayTeamName: string,
  t: TranslateFn,
): ChartPanel => ({
  type: ChartPanelType.Odds,
  points: [],
  homeTeamName,
  awayTeamName,
  id: market.id,
  title: market.name,
  lines: Object.entries(market.history).map(([label, points]) => ({
    label: translateOutcomeLabel(label, t),
    points,
  })),
});
