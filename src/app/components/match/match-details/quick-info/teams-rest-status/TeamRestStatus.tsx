import { useTranslation } from "react-i18next";
import { TeamsRestStatus } from "@matchinsights/core";
import NoData from "../../../../general/no-data/NoData";
import { ArrowStatusTileSkeleton } from "../../../../general/skeleton/Skeleton";
import ArrowStatusTile from "../../../../general/status-tile/ArrowStatusTile";

interface LastFiveMatchesProps {
  isHome: boolean;
  loading: boolean;
  restStatus?: TeamsRestStatus;
}

const TeamsRestStatusComponent = ({
  isHome,
  loading,
  restStatus,
}: LastFiveMatchesProps) => {
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
    if (s.includes("moderate") || s.includes("unknown") || s.length == 0)
      return true;
    return false;
  };

  if (loading) return <NoData loading={loading} skeleton={<ArrowStatusTileSkeleton />} />;

  if (!loading && !restStatus) return <NoData />;

  return isHome ? (
    <ArrowStatusTile
      status={t(`common.${translationKey(restStatus?.homeTeamStatus)}`)}
      isUp={isUp(restStatus?.homeTeamStatus)}
      isFlat={isFlat(restStatus?.homeTeamStatus ?? "")}
    />
  ) : (
    <ArrowStatusTile
      isUp={isUp(restStatus?.awayTeamStatus)}
      status={t(`common.${translationKey(restStatus?.awayTeamStatus)}`)}
      isFlat={isFlat(restStatus?.awayTeamStatus ?? "")}
    />
  );
};

export default TeamsRestStatusComponent;
