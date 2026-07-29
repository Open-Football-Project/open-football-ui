import NoData from "../../../general/no-data/NoData";
import { TinyCardGroupSkeleton } from "../../../general/skeleton/Skeleton";
import TinyCard from "../../../general/tiny-card/TinyCard";
import { H2HDetails } from "@matchinsights/core";
import { getFormattedDate } from "@matchinsights/core";
import { useTranslation } from "react-i18next";

interface HeadToHeadProps {
  h2hDetails: H2HDetails | null;
  loading: boolean;
}

const HeadToHead = ({ h2hDetails, loading }: HeadToHeadProps) => {
  if (loading) {
    return <NoData loading={loading} skeleton={<TinyCardGroupSkeleton />} />;
  }

  if (!loading && !h2hDetails) {
    return <NoData />;
  }

  const { t } = useTranslation();

  return (
    <div className="flex flex-col lg:flex-row justify-center gap-6 w-full px-4 sm:px-6 py-2">
      <TinyCard
        key={`${h2hDetails?.date}-main`}
        title={t("common.main_info")}
        sections={[
          {
            component: (
              <div className="flex flex-col gap-4 p-4 sm:p-6 text-xs sm:text-xs font-semibold text-brand-white uppercase leading-relaxed">
                <p>
                  <span className="text-brand-yellow text-xs uppercasefont-bold">
                    {t("common.date")}:
                  </span>{" "}
                  {getFormattedDate(h2hDetails?.date ?? "")}
                </p>
                <p className="text-brand-success text-xs uppercase">
                  {t("common.winner")}:{" "}
                  <span className="text-brand-white text-xs uppercase font-bold">
                    {h2hDetails?.winner}
                  </span>
                </p>
              </div>
            ),
          },
        ]}
      />

      <TinyCard
        key={`${h2hDetails?.date}-league`}
        title={t("common.league_info")}
        sections={[
          {
            component: (
              <div className="flex flex-col gap-4 p-4 sm:p-6 text-xs sm:text-xs font-semibold text-brand-white uppercase leading-relaxed">
                <p>
                  <span className="text-brand-yellow text-xs uppercase font-bold">
                    {t("common.venue")}:
                  </span>{" "}
                  {h2hDetails?.venue.name}
                </p>
                <p>
                  <span className="text-brand-yellow text-xs uppercase font-bold">
                    {t("common.league")}:
                  </span>{" "}
                  {h2hDetails?.leagueName}
                </p>
                <p>
                  <span className="text-brand-yellow text-xs uppercase font-bold">
                    {t("common.season")}:
                  </span>{" "}
                  {h2hDetails?.season}
                </p>
                {h2hDetails?.round && (
                  <p>
                    <span className="text-brand-yellow text-xs uppercase font-bold">
                      {t("common.round")}:
                    </span>{" "}
                    {h2hDetails.round}
                  </p>
                )}
              </div>
            ),
          },
        ]}
      />

      <TinyCard
        key={`${h2hDetails?.date}-score`}
        title={t("common.score_info")}
        sections={[
          {
            component: (
              <div className="flex flex-col gap-4 p-4 sm:p-6 text-xs sm:text-xs uppercase font-semibold text-brand-white uppercase leading-relaxed">
                <p>
                  <span className="text-brand-lightGray text-xs uppercase font-bold">
                    {t("common.half_time")}:
                  </span>{" "}
                  {h2hDetails?.homeHalfTimeGoal} -{" "}
                  {h2hDetails?.awayHalfTimeGoal}
                </p>
                <p>
                  <span className="text-brand-lightGray text-xs uppercase font-bold">
                    {t("common.full_time")}:
                  </span>{" "}
                  {h2hDetails?.homeFullTimeGoal} -{" "}
                  {h2hDetails?.awayFullTimeGoal}
                </p>
                <p>
                  <span className="text-brand-lightGray text-xs uppercase font-bold">
                    {t("common.extra_time")}:
                  </span>{" "}
                  {h2hDetails?.homeExtraTimeGoal} -{" "}
                  {h2hDetails?.awayExtraTimeGoal}
                </p>
                <p>
                  <span className="text-brand-lightGray text-xs uppercase font-bold">
                    {t("common.penalties")}:
                  </span>{" "}
                  {h2hDetails?.homePenalty} - {h2hDetails?.awayPenalty}
                </p>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
};

export default HeadToHead;
