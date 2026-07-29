import { useTranslation } from "react-i18next";
import { TeamsScorePerformance } from "@matchinsights/core";
import NoData from "../../../../general/no-data/NoData";
import { ArrowStatusTileSkeleton } from "../../../../general/skeleton/Skeleton";
import ArrowStatusTile from "../../../../general/status-tile/ArrowStatusTile";

interface TeamsScorePerformanceProps {
  isHome: boolean;
  loading: boolean;
  performance?: TeamsScorePerformance;
}

const TeamsScorePerformanceComponent = ({
  isHome,
  loading,
  performance,
}: TeamsScorePerformanceProps) => {
  const { t } = useTranslation();

  const translationKey = (value?: string): string =>
    value?.toLowerCase().replace(/\s+/g, "_") ?? "";

  const isUp = (status?: string) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("good")) return true;
    return false;
  };

  const isFlat = (status?: string) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("data") || s.length === 0) return true;
    return false;
  };

  if (loading) return <NoData loading={loading} skeleton={<ArrowStatusTileSkeleton />} />;
  if (!loading && !performance) return <NoData />;

  return isHome ? (
    <ArrowStatusTile
      status={t(`common.${translationKey(performance?.homeTeamPerformance)}`)}
      isFlat={isFlat(performance?.homeTeamPerformance ?? "")}
      isUp={isUp(performance?.homeTeamPerformance)}
    />
  ) : (
    <ArrowStatusTile
      status={t(`common.${translationKey(performance?.awayTeamPerformance)}`)}
      isFlat={isFlat(performance?.awayTeamPerformance ?? "")}
      isUp={isUp(performance?.awayTeamPerformance)}
    />
  );
};

export default TeamsScorePerformanceComponent;
