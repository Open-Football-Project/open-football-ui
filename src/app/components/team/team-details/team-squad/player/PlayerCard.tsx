import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaCaretRight } from "react-icons/fa6";
import {
  TeamPlayer,
  translatePlayerPosition,
  buildPlayerCardSvgString,
  getPlayerCardSvgH,
  PLAYER_CARD_SVG_W,
  PlayerCardSvgData,
  PlayerSvgLabel,
  PlayerSvgLabels,
  obscurePlayerName,
} from "@matchinsights/core";
import profile from "../../../../../assets/images/player.png";
import { svgToPng } from "../../../../../converter/svg-png-converter/svg-png-converter";
import { DownloadOrQuiz } from "../../../../general/download-or-quiz/DownloadOrQuiz";

interface PlayerCardProps {
  player: TeamPlayer;
  teamName?: string;
  teamLogo?: string;
}

export const PlayerCard = ({ player, teamName, teamLogo }: PlayerCardProps) => {
  const { t } = useTranslation();
  const [downloading, setDownloading] = useState(false);
  const [downloadingQuiz, setDownloadingQuiz] = useState(false);

  const SVGReportData = useCallback(
    (): PlayerCardSvgData => ({
      playerName: player.name,
      playerPhoto: player.photo || profile,
      playerAge: player.age,
      position: player.position || undefined,
      playerNumber: player.playerNumber,
      playerTeamName: teamName,
      playerTeamLogo: teamLogo,
    }),
    [player, teamName, teamLogo],
  );

  const buildLabels = useCallback(
    (): PlayerSvgLabels =>
      new Map([
        [PlayerSvgLabel.AGE, t("common.age")],
        [PlayerSvgLabel.POSITION, t("common.position")],
        [PlayerSvgLabel.PLAYER_NUMBER, t("common.number")],
      ]),
    [t],
  );

  const handleDownload = useCallback(async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      const data = SVGReportData();
      const svgString = buildPlayerCardSvgString(data, buildLabels());
      const doc = new DOMParser().parseFromString(svgString, "image/svg+xml");
      const svgEl = doc.documentElement as unknown as SVGSVGElement;
      const filename = `${player.name.replace(/\s+/g, "-").toLowerCase()}-card.png`;
      await svgToPng(
        svgEl,
        filename,
        PLAYER_CARD_SVG_W,
        getPlayerCardSvgH(data),
      );
    } finally {
      setDownloading(false);
    }
  }, [player, downloading, SVGReportData, buildLabels]);

  const handleQuizDownload = useCallback(async () => {
    if (downloadingQuiz) return;
    setDownloadingQuiz(true);
    try {
      const data: PlayerCardSvgData = {
        ...SVGReportData(),
        playerPhoto: profile,
        playerName: obscurePlayerName(player.name),
      };
      const svgString = buildPlayerCardSvgString(data, buildLabels());
      const doc = new DOMParser().parseFromString(svgString, "image/svg+xml");
      const svgEl = doc.documentElement as unknown as SVGSVGElement;
      await svgToPng(
        svgEl,
        "quiz-card.png",
        PLAYER_CARD_SVG_W,
        getPlayerCardSvgH(data),
      );
    } finally {
      setDownloadingQuiz(false);
    }
  }, [player, downloadingQuiz, SVGReportData, buildLabels]);

  return (
    <div
      key={player.name}
      className="
      m-auto w-60 cursor-pointer overflow-hidden
      transform transition duration-300
      hover:shadow-2xl
      focus-visible:ring-2 focus-visible:ring-brand-yellow
    "
    >
      <div className="block w-full bg-brand-darkBg rounded-lg">
        <div className="relative w-full h-60 flex items-center justify-center bg-brand-darkBg rounded-lg">
          <img
            src={player.photo || profile}
            alt={player.name}
            className="h-auto max-h-40 w-auto object-contain transition-transform duration-500 ease-in-out hover:scale-105 rounded-lg"
          />
          <DownloadOrQuiz
            downloading={downloading}
            downloadingQuiz={downloadingQuiz}
            handleDownload={handleDownload}
            handleQuizDownload={handleQuizDownload}
          />
        </div>
        <div className="w-full p-4">
          <p className="text-xs font-semibold uppercase leading-5 text-brand-yellow">
            {player.name}
          </p>
          {player.age !== undefined && (
            <p className="text-xs font-medium text-brand-orange">
              {t("common.age")}:
              <span className="ml-1 text-brand-aqualight"> {player.age}</span>
            </p>
          )}
          {player.position && (
            <p className="text-xs font-medium text-brand-orange">
              {t("common.position")}:
              <span className="ml-1 text-brand-aqualight">
                {translatePlayerPosition(player.position, t)}
              </span>
            </p>
          )}
          {player.playerNumber !== undefined && (
            <p className="text-xs font-medium text-brand-orange">
              {t("common.number")}:
              <span className="ml-1 text-brand-aqualight">
                {player.playerNumber}
              </span>
            </p>
          )}
          <div className="flex flex-row items-center justify-end flex-1 mt-2">
            <button
              className="p-2 flex items-center rounded-full justify-center text-brand-white hover:bg-brand-dona hover:text-brand-orange"
              title="Player Profile"
            >
              <FaCaretRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
