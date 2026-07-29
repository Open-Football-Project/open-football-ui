import {
  TeamForm,
  TeamsRestStatus,
  TeamsScorePerformance,
} from "open-football-project-core";

import LastFiveMatches from "../../quick-info/last-five-matches/LastFiveMatches";

import TeamsScorePerformanceComponent from "../../quick-info/teams-score-performance/TeamsScorePerformance";
import TeamsRestStatusComponent from "../../quick-info/teams-rest-status/TeamRestStatus";
import TinyCard from "../../../../general/tiny-card/TinyCard";
import { useTranslation } from "react-i18next";

interface TopLeftSlideProps {
  lastFiveLoading: boolean;
  lastFiveResults?: TeamForm;
  isLastFiveAvailable?: boolean;
  loadingPerformance: boolean;
  performance?: TeamsScorePerformance;
  isPerformanceAvailable?: boolean;
  loadingRestStatus: boolean;
  restStatus?: TeamsRestStatus;
  isRestStatusAvailable?: boolean;
  homeTeam: string;
  awayTeam: string;
}

export const TopLeftSlide = ({
  lastFiveLoading,
  lastFiveResults,
  isLastFiveAvailable,
  loadingPerformance,
  performance,
  isPerformanceAvailable,
  loadingRestStatus,
  restStatus,
  isRestStatusAvailable,
  homeTeam,
  awayTeam,
}: TopLeftSlideProps) => {
  const { t } = useTranslation();
  return (
    <div className="w-full flex flex-col lg:flex-row gap-2">
      {isLastFiveAvailable && (
        <TinyCard
          title={t("common.last_five_results")}
          cardId={`last-five-card`}
          sections={[
            {
              label: homeTeam,
              component: (
                <LastFiveMatches
                  isHome={true}
                  loading={lastFiveLoading}
                  lastFiveResults={lastFiveResults}
                />
              ),
            },
            {
              label: awayTeam,
              component: (
                <LastFiveMatches
                  isHome={false}
                  loading={lastFiveLoading}
                  lastFiveResults={lastFiveResults}
                />
              ),
            },
          ]}
        />
      )}

      {isPerformanceAvailable && (
        <TinyCard
          title={t("common.performance")}
          cardId={`performance-card`}
          sections={[
            {
              label: homeTeam,
              component: (
                <TeamsScorePerformanceComponent
                  isHome={true}
                  loading={loadingPerformance}
                  performance={performance}
                />
              ),
            },
            {
              label: awayTeam,
              component: (
                <TeamsScorePerformanceComponent
                  isHome={false}
                  loading={loadingPerformance}
                  performance={performance}
                />
              ),
            },
          ]}
        />
      )}

      {isRestStatusAvailable && (
        <TinyCard
          title={t("common.rest_status")}
          cardId={`rest-card`}
          sections={[
            {
              label: homeTeam,
              component: (
                <TeamsRestStatusComponent
                  loading={loadingRestStatus}
                  isHome={true}
                  restStatus={restStatus}
                />
              ),
            },
            {
              label: awayTeam,
              component: (
                <TeamsRestStatusComponent
                  loading={loadingRestStatus}
                  isHome={false}
                  restStatus={restStatus}
                />
              ),
            },
          ]}
        />
      )}
    </div>
  );
};
