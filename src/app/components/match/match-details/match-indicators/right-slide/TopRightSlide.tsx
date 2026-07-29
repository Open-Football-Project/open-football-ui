import { OddsWinnerFeeling, IndicatorResult } from "open-football-project-core";
import OddsWinnerFeelingComponent from "../../quick-info/odds-winner-feeling/OddsWinnerFeeling";
import TinyCard from "../../../../general/tiny-card/TinyCard";
import { LiveMatchPieChart } from "../../../live-indicators/pie-chart/LiveMatchPieChart";
import { useTranslation } from "react-i18next";

interface TopRightSlideProps {
  homeTeam: string;
  awayTeam: string;
  loadingOddsFeeling?: boolean;
  oddsFeeling?: OddsWinnerFeeling | null;
  isOddsFeelingAvailable?: boolean;
  h2hIndicator?: IndicatorResult;
  isH2HAvailable?: boolean;
}

export const TopRightSlide = ({
  homeTeam,
  awayTeam,
  loadingOddsFeeling = false,
  oddsFeeling = null,
  isOddsFeelingAvailable,
  h2hIndicator,
  isH2HAvailable,
}: TopRightSlideProps) => {
  const { t } = useTranslation();
  return (
    <div className="w-full flex flex-col lg:flex-row gap-2">
      {isOddsFeelingAvailable && (
        <TinyCard
          title={t("common.winner_feeling")}
          cardId="winner-feeling-card"
          sections={[
            {
              component: (
                <OddsWinnerFeelingComponent
                  loading={loadingOddsFeeling}
                  homeTeam={homeTeam}
                  awayTeam={awayTeam}
                  winnerFeeling={oddsFeeling}
                />
              ),
            },
          ]}
        />
      )}
      {isH2HAvailable && h2hIndicator && (
        <TinyCard
          cardId="h2h-history"
          sections={[
            {
              component: (
                <LiveMatchPieChart
                  indicator={h2hIndicator}
                  homeTeamName={homeTeam}
                  awayTeamName={awayTeam}
                  hasData={true}
                />
              ),
            },
          ]}
        />
      )}
    </div>
  );
};
