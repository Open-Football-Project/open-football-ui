import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { ChartPanel, ChartPanelType } from "@matchinsights/core";
import { MomentumOscillatorChart } from "../../charts/momentum-oscillator/MomentumOscillator";
import { PercentageChart } from "../../charts/percentage-chart/PercentageChart";
import { OddsChart } from "../../charts/odds/OddsChart";
import {
  MOMENTUM_OSCILLATOR_BRAND,
  PERCENTAGE_CHART_COLORS,
  ODDS_CHART_COLORS,
} from "../constants";

interface Props {
  panel: ChartPanel;
}

const PanelCard = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className="bg-brand-card rounded-lg p-4 ring-1 ring-gray-500">
    <h3 className="text-white text-sm font-semibold mb-3">{title}</h3>
    {children}
  </div>
);

const IndicatorsPanel = ({ panel }: Props) => {
  const { t } = useTranslation();

  const percentageChart = () => (
    <PercentageChart
      points={panel.points}
      brand={{
        ...PERCENTAGE_CHART_COLORS,
        darkBg: MOMENTUM_OSCILLATOR_BRAND.darkBg,
        divider: MOMENTUM_OSCILLATOR_BRAND.divider,
        axisLabel: MOMENTUM_OSCILLATOR_BRAND.axisLabel,
      }}
      homeTeamName={panel.homeTeamName}
      awayTeamName={panel.awayTeamName}
    />
  );

  switch (panel.type) {
    case ChartPanelType.Momentum: {
      const title = t("charts.momentum_caption", { defaultValue: "Live Momentum" });
      return (
        <PanelCard title={title}>
          <MomentumOscillatorChart
            points={panel.points}
            brand={MOMENTUM_OSCILLATOR_BRAND}
            homeTeamName={panel.homeTeamName}
            awayTeamName={panel.awayTeamName}
          />
        </PanelCard>
      );
    }
    case ChartPanelType.Control: {
      const title = t("charts.control_caption", { defaultValue: "Live Control" });
      return <PanelCard title={title}>{percentageChart()}</PanelCard>;
    }
    case ChartPanelType.GoalThreat: {
      const title = t("charts.goal_threat_caption", { defaultValue: "Live Goal Threat" });
      return <PanelCard title={title}>{percentageChart()}</PanelCard>;
    }
    case ChartPanelType.Odds: {
      const title = t(`charts.markets.${panel.title}`, { defaultValue: panel.title });
      return (
        <PanelCard title={title}>
          <OddsChart
            lines={panel.lines ?? []}
            colors={ODDS_CHART_COLORS}
            brand={{
              darkBg: MOMENTUM_OSCILLATOR_BRAND.darkBg,
              divider: MOMENTUM_OSCILLATOR_BRAND.divider,
              axisLabel: MOMENTUM_OSCILLATOR_BRAND.axisLabel,
            }}
          />
        </PanelCard>
      );
    }
  }
};

export default IndicatorsPanel;
