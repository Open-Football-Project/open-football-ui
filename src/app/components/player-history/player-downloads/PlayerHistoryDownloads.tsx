import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  getFormattedDate,
  translateCountry,
  translateLeague,
  PlayerTransferInfo,
  PlayerTrophyInfo,
  SVGItemKind,
  SVGTransferOrTrophyItem,
  PlayerSvgStrategy,
  TransfersSvgStrategy,
  TrophiesSvgStrategy,
  QuizMixSvgStrategy,
  buildPlayerHistorySvgString,
  getPlayerHistorySvgDimensions,
} from "@matchinsights/core";

import { svgToPng } from "../../../converter/svg-png-converter/svg-png-converter";
import playerSilhouette from "../../../assets/images/player.png";

interface PlayerHistoryDownloadsProps {
  playerName: string;
  playerPhoto: string;
  transfers: PlayerTransferInfo[];
  trophies: PlayerTrophyInfo[];
}

function playerSvgDownload(
  strategy: PlayerSvgStrategy,
  items: SVGTransferOrTrophyItem[],
  playerName: string,
) {
  const [downloading, setDownloading] = useState(false);

  const download = useCallback(async () => {
    if (downloading) return;
    const rows = strategy.filterItems(items);
    if (!rows.length) return;
    setDownloading(true);
    try {
      const svgString = buildPlayerHistorySvgString(
        strategy,
        items,
        playerName,
      );
      const { width, height } = getPlayerHistorySvgDimensions(
        strategy,
        rows.length,
      );
      const doc = new DOMParser().parseFromString(svgString, "image/svg+xml");
      const svgEl = doc.documentElement as unknown as SVGSVGElement;
      await svgToPng(svgEl, strategy.getFilename(playerName), width, height);
    } finally {
      setDownloading(false);
    }
  }, [strategy, items, playerName, downloading]);

  return { download, downloading };
}

export default function PlayerHistoryDownloads({
  playerName,
  playerPhoto,
  transfers,
  trophies,
}: PlayerHistoryDownloadsProps) {
  const { t } = useTranslation();

  const allItems: SVGTransferOrTrophyItem[] = useMemo(
    () => [
      ...transfers.map(
        (trans): SVGTransferOrTrophyItem => ({
          kind: SVGItemKind.Transfer,
          date: trans.date ? getFormattedDate(trans.date, "dd MMM yyyy") : "—",
          fromTeamName: trans.fromTeamName,
          fromTeamLogo: trans.fromTeamLogo ?? undefined,
          toTeamName: trans.toTeamName,
          toTeamLogo: trans.toTeamLogo ?? undefined,
        }),
      ),
      ...trophies
        .filter((tr) => tr.league && tr.season && tr.place)
        .map(
          (tr): SVGTransferOrTrophyItem => ({
            kind: SVGItemKind.Trophy,
            leagueName: translateLeague(tr.league, t),
            countryName: translateCountry(tr.country, t),
            place: tr.place,
            season: tr.season!,
          }),
        ),
    ],
    [transfers, trophies, t],
  );

  const transfersStrategy = useMemo(
    () =>
      new TransfersSvgStrategy({
        title: t("playerhistory.downloadTransfersTitle"),
        photoUrl: playerPhoto,
      }),
    [t, playerPhoto],
  );

  const trophiesStrategy = useMemo(
    () =>
      new TrophiesSvgStrategy({
        title: t("playerhistory.downloadTrophiesTitle"),
        photoUrl: playerPhoto,
      }),
    [t, playerPhoto],
  );

  const quizStrategy = useMemo(
    () =>
      new QuizMixSvgStrategy({
        title: t("playerhistory.downloadQuizTitle"),
        photoUrl: playerSilhouette,
        transferLabel: t("quiz.transfer"),
        trophyLabel: t("quiz.trophy"),
      }),
    [t],
  );

  const { download: downloadTransfers, downloading: downloadingTransfers } =
    playerSvgDownload(transfersStrategy, allItems, playerName);

  const { download: downloadTrophies, downloading: downloadingTrophies } =
    playerSvgDownload(trophiesStrategy, allItems, playerName);

  const { download: downloadQuiz, downloading: downloadingQuiz } =
    playerSvgDownload(quizStrategy, allItems, playerName);

  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-2 items-stretch justify-center py-2">
      <DownloadButton
        onClick={downloadTransfers}
        downloading={downloadingTransfers}
        disabled={!transfers.length}
        label={t("playerhistory.downloadTransfers")}
      />
      <DownloadButton
        onClick={downloadTrophies}
        downloading={downloadingTrophies}
        disabled={!trophies.length}
        label={t("playerhistory.downloadTrophies")}
        variant="orange"
      />
      <DownloadButton
        onClick={downloadQuiz}
        downloading={downloadingQuiz}
        disabled={!allItems.length}
        label={t("playerhistory.downloadQuiz")}
        variant="quiz"
      />
    </div>
  );
}

interface DownloadButtonProps {
  onClick: () => void;
  downloading: boolean;
  disabled: boolean;
  label: string;
  variant?: "default" | "orange" | "quiz";
}

const ButtonVariant: Record<
  NonNullable<DownloadButtonProps["variant"]>,
  string
> = {
  default: "bg-brand-yellow text-black",
  orange: "bg-brand-orange text-white",
  quiz: "bg-brand-rose text-white",
};

function DownloadButton({
  onClick,
  downloading,
  disabled,
  label,
  variant = "default",
}: DownloadButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || downloading}
      className={`w-full sm:w-auto sm:min-w-[10rem] px-6 py-3 text-sm font-semibold rounded-2xl shadow-md hover:shadow-lg hover:opacity-90 transition-all duration-200 disabled:opacity-50 ${ButtonVariant[variant]}`}
    >
      {downloading ? "\u2026" : label}
    </button>
  );
}
