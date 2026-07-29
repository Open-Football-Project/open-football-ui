import { useTranslation } from "react-i18next";
import { OddsWinnerFeeling } from "@matchinsights/core";
import NoData from "../../../../general/no-data/NoData";
import { OddsFeelingSkeleton } from "../../../../general/skeleton/Skeleton";
import ArrowStatusTile from "../../../../general/status-tile/ArrowStatusTile";

interface OddsWinnerFeelingProps {
  loading: boolean;
  winnerFeeling: OddsWinnerFeeling | null;
  homeTeam: string;
  awayTeam: string;
}

const OddsWinnerFeelingComponent = ({
  loading,
  winnerFeeling,
  homeTeam,
  awayTeam,
}: OddsWinnerFeelingProps) => {
  const isUp = (status?: string) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("strong")) return true;
    return false;
  };

  const isFlat = (status?: string) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("data") || s.length === 0) return true;
    return false;
  };

  if (loading) return <NoData loading={loading} skeleton={<OddsFeelingSkeleton />} />;
  if (!loading && !winnerFeeling) return <NoData />;

  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-2 py-4">
      <ArrowStatusTile
        isUp={isUp(winnerFeeling?.home)}
        status={homeTeam}
        isFlat={isFlat(winnerFeeling?.home ?? "")}
      />
      <ArrowStatusTile
        isUp={isUp(winnerFeeling?.away)}
        status={awayTeam}
        isFlat={isFlat(winnerFeeling?.away)}
      />
      <ArrowStatusTile
        isUp={isUp(winnerFeeling?.draw)}
        status={t("common.draw")}
        isFlat={isFlat(winnerFeeling?.draw)}
      />
    </div>
  );
};

export default OddsWinnerFeelingComponent;
