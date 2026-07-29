import { useState } from "react";
import { useTranslation } from "react-i18next";
import Logo from "../../../general/logo/Logo";

interface TiePredictionProps {
  t1: string;
  t1logo?: string;
  t2: string;
  t2logo?: string;
  onPredict: (winner: string | null) => void;
}

const parseScore = (value: string): number | null => (value === "" ? null : Number(value));

const resolveWinner = (
  t1: string,
  t2: string,
  t1Score: number | null,
  t2Score: number | null,
): string | null => {
  if (t1Score === null || t2Score === null) return null;
  if (t1Score > t2Score) return t1;
  if (t2Score > t1Score) return t2;
  return null;
};

const TiePrediction = ({ t1, t1logo, t2, t2logo, onPredict }: TiePredictionProps) => {
  const { t } = useTranslation();
  const [t1Value, setT1Value] = useState("");
  const [t2Value, setT2Value] = useState("");

  const winner = resolveWinner(t1, t2, parseScore(t1Value), parseScore(t2Value));

  const handleChange = (side: "t1" | "t2", raw: string) => {
    const digitsOnly = raw.replace(/[^0-9]/g, "");
    const nextT1Value = side === "t1" ? digitsOnly : t1Value;
    const nextT2Value = side === "t2" ? digitsOnly : t2Value;

    if (side === "t1") setT1Value(digitsOnly);
    else setT2Value(digitsOnly);

    onPredict(resolveWinner(t1, t2, parseScore(nextT1Value), parseScore(nextT2Value)));
  };

  const teamRow = (name: string, logo: string | undefined, value: string, side: "t1" | "t2") => (
    <div className="flex items-center justify-between gap-2 min-w-0">
      <div className="flex items-center gap-2 min-w-0">
        <Logo src={logo} customImageClass="w-4 h-4" name={name} />
        <span
          className={`truncate text-xs uppercase font-semibold ${
            winner === name ? "text-brand-yellow" : "text-brand-white"
          }`}
        >
          {name}
        </span>
      </div>
      <input
        data-testid={`tie-prediction-input-${side}`}
        type="text"
        inputMode="numeric"
        maxLength={2}
        value={value}
        onChange={(e) => handleChange(side, e.target.value)}
        className="w-8 text-center bg-brand-card/40 border border-brand-yellow/20 rounded text-brand-yellow font-bold focus:outline-none focus:border-brand-yellow py-0.5"
      />
    </div>
  );

  return (
    <div
      className="
        bg-brand-darkBg
        rounded-xl
        px-3 py-2.5
        shadow-sm
        w-full
        flex flex-col gap-1.5
      "
    >
      {teamRow(t1, t1logo, t1Value, "t1")}
      {teamRow(t2, t2logo, t2Value, "t2")}

      {winner && (
        <p data-testid="tie-prediction-winner" className="text-[11px] text-brand-white/60 text-center mt-1">
          {t("knockout.predictedWinner", { defaultValue: "Predicted winner" })}: {winner}
        </p>
      )}
    </div>
  );
};

export default TiePrediction;
