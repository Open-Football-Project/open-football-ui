import { useState } from "react";
import { useTranslation } from "react-i18next";
import { BracketNode, LEAGUE_CUP_ROUNDS } from "@matchinsights/core";
import NoData from "../../../general/no-data/NoData";
import TieCard from "../tie-card/TieCard";
import TiePrediction from "../tie-prediction/TiePrediction";

interface BracketTreeProps {
  root: BracketNode | null;
}

type Predictions = Map<BracketNode, string | null>;

const collectNodesByRound = (root: BracketNode): Map<string, BracketNode[]> => {
  const columns = new Map<string, BracketNode[]>();
  const queue: BracketNode[] = [root];

  while (queue.length > 0) {
    const node = queue.shift()!;
    const column = columns.get(node.roundKey) ?? [];
    column.push(node);
    columns.set(node.roundKey, column);

    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }

  return columns;
};


const resolvedWinnerName = (node: BracketNode | undefined, predictions: Predictions): string | null => {
  if (!node?.tie) return null;

  const { t1, t2, aggregate } = node.tie;
  if (aggregate) {
    if (aggregate.t1Score > aggregate.t2Score) return t1;
    if (aggregate.t2Score > aggregate.t1Score) return t2;
    return null;
  }

  return predictions.get(node) ?? null;
};

const BracketTree = ({ root }: BracketTreeProps) => {
  const { t } = useTranslation();
  const [predictions, setPredictions] = useState<Predictions>(new Map());

  if (!root) return <NoData />;

  const columns = collectNodesByRound(root);
  const roundKeys = [...columns.keys()].sort(
    (a, b) => LEAGUE_CUP_ROUNDS.indexOf(a) - LEAGUE_CUP_ROUNDS.indexOf(b)
  );
  const pendingLabel = t("knockout.pending", { defaultValue: "TBD" });

  const predictTie = (node: BracketNode) => (winner: string | null) =>
    setPredictions((prev) => new Map(prev).set(node, winner));

  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="flex items-start gap-6 min-w-max px-2">
        {roundKeys.map((roundKey) => (
          <div
            key={roundKey}
            data-testid={`bracket-column-${roundKey}`}
            className="flex flex-col gap-4 min-w-[220px]"
          >
            <h3 className="text-center uppercase text-sm font-bold text-brand-yellow">
              {t(`fixtures.${roundKey}`, { defaultValue: roundKey })}
            </h3>

            {columns.get(roundKey)!.map((node, index) => {
              const key = `${roundKey}-${index}`;

              if (!node.tie) {
                return (
                  <div
                    key={key}
                    data-testid="bracket-tie-pending"
                    className="
                      min-h-[80px]
                      flex flex-col items-center justify-center gap-1
                      rounded-xl
                      border border-dashed border-brand-white/20
                      bg-brand-darkBg/50
                      px-3 py-2.5
                      text-center text-xs text-brand-white/40
                    "
                  >
                    <span data-testid="bracket-tie-pending-left">
                      {resolvedWinnerName(node.left, predictions) ?? pendingLabel}
                    </span>
                    <span data-testid="bracket-tie-pending-right">
                      {resolvedWinnerName(node.right, predictions) ?? pendingLabel}
                    </span>
                  </div>
                );
              }

              return node.tie.aggregate ? (
                <TieCard key={key} tie={node.tie} />
              ) : (
                <TiePrediction
                  key={key}
                  t1={node.tie.t1}
                  t1logo={node.tie.t1logo}
                  t2={node.tie.t2}
                  t2logo={node.tie.t2logo}
                  onPredict={predictTie(node)}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BracketTree;
