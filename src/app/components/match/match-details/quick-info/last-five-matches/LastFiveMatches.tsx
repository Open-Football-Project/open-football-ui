import { useTranslation } from "react-i18next";
import { TeamForm } from "@matchinsights/core";
import NoData from "../../../..//general/no-data/NoData";
import { LastFiveMatchesSkeleton } from "../../../../general/skeleton/Skeleton";

interface LastFiveMatchesProps {
  loading: boolean;
  lastFiveResults?: TeamForm;
  isHome: boolean;
}

const LastFiveMatches = ({
  isHome,
  loading,
  lastFiveResults,
}: LastFiveMatchesProps) => {
  const { t } = useTranslation();

  const colorMap: Record<string, string> = {
    W: "bg-brand-success",
    D: "bg-brand-yellow",
    L: "bg-brand-red",
  };

  if (loading) return <NoData loading={loading} skeleton={<LastFiveMatchesSkeleton />} />;
  if (!loading && !lastFiveResults) return <NoData />;

  const renderRow = (data: string[]) => (
    <li>
      <div className="flex flex-wrap gap-1">
        {data.length === 0 ? (
          <span className="text-xs text-brand-white">
            {t(`common.no_data`)}
          </span>
        ) : (
          data.map((result, idx) => (
            <span
              key={idx}
              className={`w-4 h-4 flex items-center justify-center font-bold text-xs text-black ${colorMap[result]}`}
            >
              {t(`common.${result}`)}
            </span>
          ))
        )}
      </div>
    </li>
  );

  return (
    <ul>
      {renderRow(
        isHome
          ? lastFiveResults?.homeTeamLastFive ?? []
          : lastFiveResults?.awayTeamLastFive ?? []
      )}
    </ul>
  );
};

export default LastFiveMatches;
