import { useTranslation } from "react-i18next";
import { Tie } from "open-football-project-core";
import Logo from "../../../general/logo/Logo";

interface TieCardProps {
  tie: Tie;
}

const legScoreLabel = (t1Score: number | null, t2Score: number | null, isFinished: boolean) =>
  isFinished ? `${t1Score} – ${t2Score}` : "–";

const TieCard = ({ tie }: TieCardProps) => {
  const { t } = useTranslation();
  const { t1, t1logo, t2, t2logo, legs, aggregate } = tie;
  const isTwoLegged = legs.length > 1;

  return (
    <div
      className="
        bg-brand-darkBg
        rounded-xl
        px-3 py-2.5
        shadow-sm
        w-full
        flex flex-col gap-2
        transition
        hover:bg-brand-darkBg/80
        hover:shadow-md
      "
    >
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2 min-w-0">
          <Logo src={t1logo} customImageClass="w-4 h-4" name={t1} />
          <span className="truncate text-xs uppercase font-semibold text-brand-white">{t1}</span>
        </div>
        <div className="flex items-center gap-2 min-w-0">
          <Logo src={t2logo} customImageClass="w-4 h-4" name={t2} />
          <span className="truncate text-xs uppercase font-semibold text-brand-white">{t2}</span>
        </div>
      </div>

      {isTwoLegged ? (
        <div className="flex flex-col gap-1 mt-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-medium text-brand-white/60">
              {t("knockout.leg1", { defaultValue: "Leg 1" })}
            </span>
            <span data-testid="tie-leg1-score" className="text-sm font-bold text-brand-white/80">
              {legScoreLabel(legs[0].t1Score, legs[0].t2Score, legs[0].isFinished)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-medium text-brand-white/60">
              {t("knockout.leg2", { defaultValue: "Leg 2" })}
            </span>
            <span data-testid="tie-leg2-score" className="text-sm font-bold text-brand-white/80">
              {legScoreLabel(legs[1].t1Score, legs[1].t2Score, legs[1].isFinished)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-brand-white/10">
            <span className="text-[11px] font-semibold text-brand-white/60">
              {t("knockout.aggregate", { defaultValue: "Aggregate" })}
            </span>
            <span data-testid="tie-aggregate-score" className="text-sm font-bold text-brand-yellow">
              {aggregate ? `${aggregate.t1Score} – ${aggregate.t2Score}` : "–"}
            </span>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center mt-1">
          <span data-testid="tie-single-score" className="text-sm font-bold text-brand-yellow">
            {legScoreLabel(legs[0].t1Score, legs[0].t2Score, legs[0].isFinished)}
          </span>
        </div>
      )}
    </div>
  );
};

export default TieCard;
