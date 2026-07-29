import NoData from "../../../../general/no-data/NoData";
import { TinyCardGroupSkeleton } from "../../../../general/skeleton/Skeleton";
import { LastFiveMatchesEvents } from "open-football-project-core";
import TinyCard from "../../../../general/tiny-card/TinyCard";
import { useTranslation } from "react-i18next";

interface MatchEventsProps {
  loading: boolean;
  events: LastFiveMatchesEvents | undefined;
}

const MatchEvents = ({ loading, events }: MatchEventsProps) => {
  const { t } = useTranslation();
  if (loading)
    return (
      <div className="flex justify-center items-center w-full h-full">
        <NoData loading={loading} skeleton={<TinyCardGroupSkeleton />} />
      </div>
    );

  if (!loading && !events)
    return (
      <div className="flex justify-center items-center w-full h-full">
        <NoData />
      </div>
    );

  return (
    <div className="flex flex-col lg:flex-row justify-center gap-6 w-full px-4 sm:px-6 py-2">
      <TinyCard
        title={t("common.goals")}
        key="Goals"
        sections={[
          {
            component: (
              <div
                data-testid="goal-events"
                className="flex flex-col gap-3 text-sm sm:text-base font-semibold text-brand-white leading-relaxed"
              >
                <p>
                  <span className="text-brand-white text-xs uppercase">
                    {t("common.first_half")}:
                  </span>{" "}
                  <span className="text-xs text-brand-yellow uppercase">
                    {events?.firstHalfGoals}
                  </span>
                </p>
                <p>
                  <span className="text-brand-white text-xs uppercase">
                    {t("common.second_half")}:
                  </span>{" "}
                  <span className="text-xs text-brand-yellow uppercase">
                    {events?.secondHalfGoals}
                  </span>
                </p>
                <p>
                  <span className="text-brand-white text-xs uppercase">
                    {t("common.extra_time")}:
                  </span>{" "}
                  <span className="text-xs text-brand-yellow uppercase">
                    {events?.extraTimeGoals}
                  </span>
                </p>
                <p>
                  <span className="text-brand-white text-xs uppercase">
                    {t("common.penalties")}:
                  </span>{" "}
                  <span className="text-xs text-brand-yellow uppercase">
                    {events?.penalties}
                  </span>
                </p>
              </div>
            ),
          },
        ]}
      />

      <TinyCard
        key="Yellow Cards"
        title={t("common.yellow_cards")}
        sections={[
          {
            component: (
              <div
                data-testid="ycard-events"
                className="flex flex-col gap-3 text-sm sm:text-base font-semibold text-brand-white leading-relaxed"
              >
                <p>
                  <span className="text-brand-white text-xs uppercase">
                    {t("common.first_half")}:
                  </span>{" "}
                  <span className="text-xs text-brand-yellow uppercase">
                    {events?.firstHalfYellowCards}
                  </span>
                </p>
                <p>
                  <span className="text-brand-white text-xs uppercase">
                    {t("common.second_half")}:
                  </span>{" "}
                  <span className="text-xs text-brand-yellow uppercase">
                    {events?.secondHalfYellowCards}
                  </span>
                </p>
                <p>
                  <span className="text-brand-white text-xs uppercase">
                    {t("common.extra_time")}:
                  </span>{" "}
                  <span className="text-xs text-brand-yellow uppercase">
                    {events?.extraTimeYellowCards}
                  </span>
                </p>
              </div>
            ),
          },
        ]}
      />

      <TinyCard
        key="Red Cards"
        title={t("common.red_cards")}
        sections={[
          {
            component: (
              <div
                data-testid="rcards-events"
                className="flex flex-col gap-3 text-sm sm:text-base font-semibold text-brand-white leading-relaxed"
              >
                <p>
                  <span className="text-brand-white text-xs uppercase">
                    {t("common.first_half")}:
                  </span>{" "}
                  <span className="text-xs text-brand-yellow uppercase">
                    {events?.firstHalfRedCards}
                  </span>
                </p>
                <p>
                  <span className="text-brand-white text-xs uppercase">
                    {t("common.second_half")}:
                  </span>{" "}
                  <span className="text-xs text-brand-yellow uppercase">
                    {events?.secondHalfRedCards}
                  </span>
                </p>
                <p>
                  <span className="text-brand-white text-xs uppercase">
                    {t("common.extra_time")}:
                  </span>{" "}
                  <span className="text-xs text-brand-yellow uppercase">
                    {events?.extraTimeRedCards}
                  </span>
                </p>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
};

export default MatchEvents;
