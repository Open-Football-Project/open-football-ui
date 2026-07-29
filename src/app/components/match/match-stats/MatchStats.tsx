import { TwoTeamsStatistics } from "@matchinsights/core";
import { useTranslation } from "react-i18next";
import NoData from "../../general/no-data/NoData";
import TeamStats from "../../general/team-stats/TeamStats";


interface LiveMatchStatsProps {
  statistics: TwoTeamsStatistics | undefined;
}

const MatchStats = ({ statistics }: LiveMatchStatsProps) => {
  if (!statistics) return <NoData />;

  const { teamA, teamB } = statistics as TwoTeamsStatistics;

  if (teamA?.statistics.length === 0 || teamB?.statistics.length === 0)
    return <NoData />;

  const { t } = useTranslation();

  return (
    <div className="w-full ">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/2">
          <TeamStats
            logo={teamA?.teamLogo}
            title={teamA?.teamName ?? t("team.home")}
            statistics={teamA?.statistics ?? []}
          />
        </div>
        <div className="w-full lg:w-1/2">
          <TeamStats
            logo={teamB?.teamLogo}
            title={teamB?.teamName ?? t("team.away")}
            statistics={teamB?.statistics ?? []}
          />
        </div>
      </div>
    </div>
  );
};

export default MatchStats;
