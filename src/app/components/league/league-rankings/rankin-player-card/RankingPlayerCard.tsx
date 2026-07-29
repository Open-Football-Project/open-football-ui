import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { trackEvent, AnalyticsEvent } from "../../../../utils/analytics/analytics";
import { useTranslation } from "react-i18next";
import {
  LeagueRankingPlayer,
  buildPlayerCardSvgString,
  getPlayerCardSvgH,
  PLAYER_CARD_SVG_W,
  PlayerCardSvgData,
  PlayerSvgLabel,
  PlayerSvgLabels,
  obscurePlayerName,
} from "@matchinsights/core";
import profile from "../../../../assets/images/player.png";
import { svgToPng } from "../../../../converter/svg-png-converter/svg-png-converter";
import { DownloadOrQuiz } from "../../../general/download-or-quiz/DownloadOrQuiz";

interface RankingPlayerCardProps {
  player: LeagueRankingPlayer;
}

const RankingPlayerCard = ({ player }: RankingPlayerCardProps) => {
  const { t } = useTranslation();
  const [downloading, setDownloading] = useState(false);
  const [downloadingQuiz, setDownloadingQuiz] = useState(false);

  const buildData = useCallback(
    (): PlayerCardSvgData => ({
      playerName: player.playerName,
      playerPhoto: player.playerPhoto || profile,
      playerAge: player.playerAge,
      playerTeamName: player.playerTeamName,
      playerTeamLogo: player.playerTeamLogo,
      goals: player.playerTotalGoals,
      assists: player.playerTotalAssists,
      yellowCards: player.playerTotalYellowCards,
      redCards: player.playerTotalRedCards,
      appearances: player.playerTotalAppearances,
    }),
    [player],
  );

  const buildLabels = useCallback(
    (): PlayerSvgLabels =>
      new Map([
        [PlayerSvgLabel.AGE, t("common.age")],
        [PlayerSvgLabel.GOALS, t("common.goals")],
        [PlayerSvgLabel.ASSISTS, t("common.assists")],
        [PlayerSvgLabel.YELLOW_CARDS, t("common.y_cards")],
        [PlayerSvgLabel.RED_CARDS, t("common.r_cards")],
        [PlayerSvgLabel.APPEARANCES, t("common.appearences")],
      ]),
    [t],
  );

  const handleDownload = useCallback(async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      const data = buildData();
      const svgString = buildPlayerCardSvgString(data, buildLabels());
      const doc = new DOMParser().parseFromString(svgString, "image/svg+xml");
      const svgEl = doc.documentElement as unknown as SVGSVGElement;
      const filename = `${player.playerName.replace(/\s+/g, "-").toLowerCase()}-card.png`;
      await svgToPng(
        svgEl,
        filename,
        PLAYER_CARD_SVG_W,
        getPlayerCardSvgH(data),
      );
    } finally {
      setDownloading(false);
    }
  }, [player, downloading, buildData, buildLabels]);

  const handleQuizDownload = useCallback(async () => {
    if (downloadingQuiz) return;
    setDownloadingQuiz(true);
    try {
      const data: PlayerCardSvgData = {
        ...buildData(),
        playerPhoto: profile,
        playerName: obscurePlayerName(player.playerName),
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
  }, [player, downloadingQuiz, buildData, buildLabels]);

  return (
    <div
      key={player.playerName}
      className="m-auto w-60 cursor-pointer overflow-hidden transform transition duration-500 ease-in-out hover:shadow-2xl md:w-60"
    >
      <div className="block w-full bg-brand-darkBg rounded-lg ">
        <div className="relative w-full h-60 flex items-center justify-center bg-brand-darkBg rounded-lg">
          <img
            src={player.playerPhoto || profile}
            alt={player.playerName}
            className="h-auto max-h-40 w-auto object-contain transition-transform duration-500 ease-in-out hover:scale-105 rounded-lg"
          />
          <DownloadOrQuiz
            downloading={downloading}
            downloadingQuiz={downloadingQuiz}
            handleDownload={handleDownload}
            handleQuizDownload={handleQuizDownload}
          />
        </div>

        <div className="w-full p-4 text-center">
          <p className="text-xs font-semibold uppercase leading-5 text-brand-yellow">
            {player.playerName}
          </p>

          {player.playerAge !== undefined && (
            <p className="text-xs font-medium text-brand-white">
              {t("common.age")}: {player.playerAge}
            </p>
          )}

          <div className="flex flex-col items-center mt-2 mb-3">
            <img
              src={player.playerTeamLogo}
              alt={player.playerTeamName}
              className="h-8 w-8 mb-1 object-contain"
            />
            <p className="text-xs font-medium text-brand-white">
              {player.playerTeamName}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-brand-white text-left mt-2 mb-3">
            <p data-testid="goals">
              {t("common.goals")}:{" "}
              <span className="font-semibold text-brand-yellow">
                {player.playerTotalGoals}
              </span>
            </p>
            <p data-testid="assists">
              {t("common.assists")}:{" "}
              <span className="font-semibold text-brand-yellow">
                {player.playerTotalAssists}
              </span>
            </p>
            <p data-testid="y-cards">
              {t("common.y_cards")}:{" "}
              <span className="font-semibold text-brand-yellow">
                {player.playerTotalYellowCards}
              </span>
            </p>
            <p data-testid="r-cards">
              {t("common.r_cards")}:{" "}
              <span className="font-semibold text-brand-yellow">
                {player.playerTotalRedCards}
              </span>
            </p>
            <p data-testid="appearences">
              {t("common.appearences")}:{" "}
              <span className="font-semibold text-brand-yellow">
                {player.playerTotalAppearances}
              </span>
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <Link
              onClick={() => trackEvent(AnalyticsEvent.TEAM_OPENED, { team_id: String(player.playerTeamId) })}
              to={`/team/${player.playerTeamId}`}
              className={`
              mt-3 inline-flex items-center justify-center
              text-[10px] sm:text-xs font-semibold
              rounded-full shadow-md transition-all duration-300
              px-3 py-1 min-w-[80px]
              text-white bg-brand-aqua/80 hover:bg-brand-blueintense
            `}
            >
              {t("common.view_team")}
            </Link>
            <Link
              onClick={() => trackEvent(AnalyticsEvent.PLAYER_OPENED, { player_id: String(player.playerId) })}
              to={`/player/${player.playerId}`}
              className={`
              mt-3 inline-flex items-center justify-center
              text-[10px] sm:text-xs font-semibold
              rounded-full shadow-md transition-all duration-300
              px-3 py-1 min-w-[80px]
              text-white bg-brand-aqua/80 hover:bg-brand-blueintense
            `}
            >
              {t("common.view_player")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RankingPlayerCard;
