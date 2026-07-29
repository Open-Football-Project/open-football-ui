import NoData from "../../../../general/no-data/NoData";
import { TinyCardSkeleton } from "../../../../general/skeleton/Skeleton";
import { PositionAndPoints } from "@matchinsights/core";
import TinyCard from "../../../../general/tiny-card/TinyCard";

interface RanksAndPointsProps {
  positionAndPoints: PositionAndPoints[];
  loading: boolean;
}

export const RanksAndPoints = ({
  positionAndPoints,
  loading,
}: RanksAndPointsProps) => {
  if (loading) return <NoData loading={loading} skeleton={<TinyCardSkeleton />} />;

  if (!loading && (!positionAndPoints || positionAndPoints.length === 0))
    return <NoData />;

  return (
    <div className="flex flex-col gap-2 w-full">
      {positionAndPoints.map((result, idx) => (
        <TinyCard
          key={idx}
          cardId={`${result.description}-${idx}`}
          sections={[
            {
              component: (
                <div className="flex flex-col text-xs uppercase text-brand-bluelight">
                  <p className="flex gap-2 items-center">
                    <span className="font-semibold">Pos:</span>
                    <span className="text-xs uppercase text-brand-yellow">
                      {result.position}
                    </span>
                  </p>
                  <p className="flex gap-2 items-center">
                    <span className="font-semibold">Pts:</span>
                    <span className="text-xs uppercase text-brand-yellow">
                      {result.points}
                    </span>
                  </p>
                </div>
              ),
            },
          ]}
        />
      ))}
    </div>
  );
};
