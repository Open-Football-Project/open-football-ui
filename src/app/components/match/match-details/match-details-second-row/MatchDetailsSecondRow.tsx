import {
  ApiService,
  useSeasonStats,
  useLastFiveMatchesEvents,
} from "open-football-project-core";
import MatchDetailsSlider, {
  SliderItem,
} from "../match-details-slider/MatchDetailsSlider";
import MatchEvents from "../summaries/match-events/MatchEvents";
import TeamStats from "../../../general/team-stats/TeamStats";
import { useTranslation } from "react-i18next";

interface MatchDetailsSecondRowProps {
  apiService: ApiService;
  homeTeamId: number;
  homeTeam: string;
  awayTeamId: number;
  awayTeam: string;
  leagueId: number;
}

interface DisplayingItem {
  isAvailable: boolean;
  item: SliderItem;
}

export const MatchDetailsSecondRow = ({
  apiService,
  homeTeamId,
  homeTeam,
  awayTeamId,
  awayTeam,
  leagueId,
}: MatchDetailsSecondRowProps) => {
  const {
    loadingAwayEvents,
    awayEventsSummary,
    loadingHomeEvents,
    homeEventsSummary,
    isAwayEventsAvailable,
    isHomeEventsAvailable,
  } = useLastFiveMatchesEvents(apiService, homeTeamId, awayTeamId);

  const { loadingSeasonStats, seasonStats, isSeasonStatsAvailable } =
    useSeasonStats(apiService, homeTeamId, awayTeamId, leagueId);

  const { t } = useTranslation();

  const backupSlider: DisplayingItem[] = [
    {
      isAvailable: isHomeEventsAvailable,
      item: {
        isLoading: loadingHomeEvents,
        title: `${homeTeam} ${t("common.last_five_summary")}`,
        component: (
          <MatchEvents loading={loadingHomeEvents} events={homeEventsSummary} />
        ),
      },
    },
    {
      isAvailable: isAwayEventsAvailable,
      item: {
        isLoading: loadingAwayEvents,
        title: `${awayTeam} ${t("common.last_five_summary")}`,
        component: (
          <MatchEvents loading={loadingAwayEvents} events={awayEventsSummary} />
        ),
      },
    },
  ];
  return (
    <>
      {!loadingSeasonStats && isSeasonStatsAvailable && (
        <div className="w-full my-4 ">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-1/2">
              <TeamStats
                logo={seasonStats?.teamA?.teamLogo}
                title={`${t("common.season_summary")}`}
                statistics={seasonStats?.teamA?.statistics ?? []}
              />
            </div>
            <div className="w-full lg:w-1/2">
              <TeamStats
                logo={seasonStats?.teamB?.teamLogo}
                title={`${t("common.season_summary")}`}
                statistics={seasonStats?.teamB?.statistics ?? []}
              />
            </div>
          </div>
        </div>
      )}

      {!loadingSeasonStats && !isSeasonStatsAvailable && (
        <MatchDetailsSlider
          key={`scond-row-slider-${homeTeamId}-${awayTeamId}`}
          items={backupSlider
            .filter((it) => it.isAvailable)
            .map((availableItem) => availableItem.item)}
        />
      )}
    </>
  );
};
