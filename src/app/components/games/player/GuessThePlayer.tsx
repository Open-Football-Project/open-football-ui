import profile from "../../../../app/assets/images/player.png";

import { useCallback, useState } from "react";
import { FaXTwitter, FaDownload } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import {
  buildPlayerTriviaSvg,
  GuessThePlayerGameData,
  GuessThePlayerGameHint,
  SVGItemKind,
  translateCountry,
  translateLeague,
} from "@matchinsights/core";
import { useDownloadTrivia } from "../../../special-hooks/download-trivia/download-trivia";
import { BannerProps } from "../../../common-props/BannerProps";
import CountryBanners from "../../general/banners/country-banners/CountryBanners";
import { trackEvent, AnalyticsEvent } from "../../../utils/analytics/analytics";

interface GuessThePlayerProps {
  teamName: string;
  game: GuessThePlayerGameData;
  newGame: () => void;
  bannerProps: BannerProps;
}

const GuessThePlayer = ({ game, newGame, teamName, bannerProps }: GuessThePlayerProps) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [wrongGuess, setWrongGuess] = useState(true);

  const handleSelect = (option: string) => {
    setSelected(option);
    const correct = option === game.playerName;
    trackEvent(AnalyticsEvent.QUIZ_ANSWERED, { game_type: "player", result: correct ? "correct" : "wrong" });
    if (correct) {
      setRevealed(true);
      setWrongGuess(false);
    } else {
      setWrongGuess(true);
      setRevealed(false);
    }
  };

  const { t } = useTranslation();

  const getTrophyHintYear = (value: string | null | undefined) => {
    if (value) return `(${value})`;
    return "";
  };

  const getTransferHintYear = (value: number | null | undefined) => {
    if (value) return `(${value})`;
    return "";
  };

  const buildHintDescription = (
    hint: GuessThePlayerGameHint,
    trfYear?: boolean,
  ): string => {
    if (hint.hintKey === "TRANSFER") {
      return `${t("common.trf_from")} ${
        hint.transferFromTeam ?? t("common.unknown")
      } ${t("common.trf_to")} ${hint.transferToTeam ?? t("common.unknown")} ${
        trfYear ? getTransferHintYear(hint.transferYear) : ""
      }`;
    }
    return `${translateLeague(
      hint.trophyLeague ?? t("common.unknown"),
      t,
    )} ${getTrophyHintYear(hint.trophySeason)}`;
  };

  const teamTag = teamName.replace(/\s+/g, "");

  const getSvgData = useCallback(
    () =>
      buildPlayerTriviaSvg({
        title: t("quiz.player_quiz"),
        subtitle: `${t("common.position")}: ${t(`playerposition.${game.playerPosition.toLowerCase()}`, { defaultValue: game.playerPosition })}`,
        hints: game.hints.map((hint) => {
          if (hint.hintKey === "TRANSFER") {
            return {
              kind: SVGItemKind.Transfer,
              label: t("quiz.transfer"),
              description: `${t("common.trf_from")} ${hint.transferFromTeam ?? t("common.unknown")} ${t("common.trf_to")} ${hint.transferToTeam ?? t("common.unknown")}${hint.transferYear ? ` (${hint.transferYear})` : ""}`,
              fromTeamLogo: hint.transferFromLogo ?? undefined,
              toTeamLogo: hint.transferToLogo ?? undefined,
            };
          }
          return {
            kind: SVGItemKind.Trophy,
            label: t("quiz.trophy"),
            description: `${translateLeague(hint.trophyLeague ?? t("common.unknown"), t)}${hint.trophySeason ? ` (${hint.trophySeason})` : ""}`,
            countryName: translateCountry(hint.trophyCountry ?? "", t),
          };
        }),
        options: game.options,
        filename: `player-quiz-${game.playerPosition.toLowerCase()}.png`,
      }),
    [game, t],
  );

  const { download, downloading } = useDownloadTrivia(getSvgData);

  const handleAskTwitter = () => {
    const currentUrl =
      typeof window !== "undefined" ? window.location.href : "";

    const formatHint = (hint: GuessThePlayerGameHint) => {
      if (hint.hintKey === "TRANSFER") {
        return `💼 ${buildHintDescription(hint, true)}`.trim();
      }
      return `🏆 ${buildHintDescription(hint)}`.trim();
    };

    const header = `🤔 ${t("quiz.player_quiz")} — ${t("common.position")}: ${t(
      `playerposition.${game.playerPosition.toLowerCase()}`,
      { defaultValue: game.playerPosition },
    )}\n`;
    const text = encodeURIComponent(
      `${header}${game.hints
        .map(formatHint)
        .join("\n")}\n\n${currentUrl}\n\n#${teamTag}`,
    );

    const url = `https://twitter.com/intent/tweet?text=${text}`;
    window.open(url, "_blank");
  };

  return (
    <div
      className="bg-brand-card ring-1 ring-gray-500 border border-brand-yellow rounded-2xl p-6 text-brand-white shadow-lg transition hover:shadow-xl hover:border-brand-orange
  flex flex-col items-center text-center w-full max-w-5xl md:max-w-6xl xl:max-w-7xl 2xl:max-w-8xl mx-auto"
    >
      <CountryBanners bannerProps={bannerProps} />
      <div className="flex flex-col md:flex-row items-center justify-center gap-12 xl:gap-16 2xl:gap-20 w-full">
        <div className="flex flex-col items-center w-full md:w-2/5 xl:w-2/5 2xl:w-1/3">
          <div className="flex flex-row flex-wrap justify-center gap-3 w-full mt-2">
            <button
              onClick={handleAskTwitter}
              className="flex items-center justify-center gap-2 text-xs md:text-sm xl:text-base border border-brand-yellow text-brand-yellow rounded-xl py-2 px-4 bg-brand-darkBg hover:bg-brand-yellow hover:text-brand-darkBg transition"
            >
              <FaXTwitter className="w-4 h-4 md:w-5 md:h-5 xl:w-6 xl:h-6" />
              {t("common.ask_help")}
            </button>

            <button
              onClick={download}
              disabled={downloading}
              className="flex items-center justify-center gap-2 text-xs md:text-sm xl:text-base border border-brand-yellow text-brand-yellow rounded-xl py-2 px-4 bg-brand-darkBg hover:bg-brand-yellow hover:text-brand-darkBg transition disabled:opacity-50"
            >
              <FaDownload className="w-4 h-4 md:w-5 md:h-5 xl:w-6 xl:h-6" />
              {downloading ? "…" : t("common.download")}
            </button>

            <button
              onClick={newGame}
              className="text-xs md:text-sm xl:text-base bg-brand-yellow text-brand-darkBg font-semibold rounded-xl py-2 px-4 hover:bg-brand-orange transition"
            >
              {t("quiz.new_quiz")}
            </button>
          </div>

          <div className="relative mt-8 w-20 h-20 md:w-48 md:h-48 xl:w-56 xl:h-56 2xl:w-64 2xl:h-64 rounded-full border border-brand-yellow overflow-hidden flex items-center justify-center bg-brand-darkBg">
            {revealed ? (
              <img
                src={game.playerPhoto || profile}
                alt={game.playerName}
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={profile}
                alt={t("common.unknown")}
                className="w-full h-full object-cover opacity-80"
              />
            )}
            {!revealed && (
              <span className="absolute text-black text-4xl md:text-5xl xl:text-6xl 2xl:text-7xl font-bold">
                ?
              </span>
            )}
          </div>

          <div className="mt-3 text-center w-full">
            <p className="font-semibold text-xs md:text-sm xl:text-base uppercase text-brand-dona">
              {t("common.position")}:
              <span className="ml-1 text-brand-aqua">
                {t(`playerposition.${game.playerPosition.toLowerCase()}`, {
                  defaultValue: game.playerPosition,
                })}
              </span>
            </p>

            {selected && wrongGuess && !revealed && (
              <p className="mt-2 text-xs md:text-sm xl:text-base text-brand-red font-semibold animate-pulse">
                ❌ {t("quiz.wrong_opt")}
              </p>
            )}

            {!wrongGuess && revealed && (
              <p className="text-sm md:text-base xl:text-lg mt-2 font-bold text-brand-success">
                🎉{" "}
                <Link
                  to={`/player/${game.playerId}`}
                  className="hover:text-brand-orange underline underline-offset-2 transition-colors"
                >
                  {game.playerName}
                </Link>
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col items-start text-left w-full md:w-3/5 xl:w-3/5 2xl:w-2/3 gap-3">
          <h4 className="text-xs md:text-sm xl:text-base text-brand-rose font-semibold uppercase">
            {t("quiz.hints")}
          </h4>

          {game.hints.length === 0 ? (
            <p className="text-xs md:text-sm xl:text-base mt-2 uppercase text-brand-lightGray">
              {t("common.nationality")}: {game.playerNationality}
            </p>
          ) : (
            <ul className="text-xs md:text-sm xl:text-base text-brand-lightGray space-y-2 w-full">
              {game.hints.map((hint, index) => (
                <li
                  key={index}
                  className="bg-brand-darkBg/60 rounded-2xl p-3 flex flex-col gap-2 border border-brand-yellow/20"
                >
                  <div className="flex flex-col gap-2 text-white text-xs md:text-sm xl:text-base uppercase tracking-wide">
                    {hint.hintKey === "TROPHY" && hint.trophyCountry && (
                      <div className="flex items-start gap-2">
                        <span className="text-lg md:text-xl xl:text-xl leading-none">
                          🏆
                        </span>
                        <p className="text-xs md:text-sm font-semibold text-brand-aqua">
                          {translateCountry(hint.trophyCountry, t)}
                        </p>
                      </div>
                    )}

                    {hint.hintKey === "TRANSFER" &&
                      hint.transferFromLogo &&
                      hint.transferToLogo && (
                        <div className="flex items-center gap-2 flex-wrap">
                          <img
                            src={hint.transferFromLogo}
                            alt={t("common.from_team")}
                            className="w-6 md:w-7 xl:w-8 h-6 md:h-7 xl:h-8 rounded-full object-contain border border-brand-yellow/50 bg-brand-darkBg"
                          />
                          <span className="text-brand-yellow text-sm md:text-base xl:text-lg">
                            ➡️
                          </span>
                          <img
                            src={hint.transferToLogo}
                            alt={t("common.to_team")}
                            className="w-6 md:w-7 xl:w-8 h-6 md:h-7 xl:h-8 rounded-full object-contain border border-brand-yellow/50 bg-brand-darkBg"
                          />
                          {hint.transferYear && (
                            <span className="font-semibold text-brand-rose ml-2 whitespace-nowrap text-xs md:text-sm xl:text-sm">
                              {t("common.year")}: {hint.transferYear}
                            </span>
                          )}
                        </div>
                      )}

                    <div className="flex items-start gap-2">
                      <span className="text-base md:text-lg xl:text-xl leading-none">
                        💡
                      </span>
                      <p className="leading-relaxed break-words">
                        <span className="text-xs font-semibold text-brand-white">
                          {t(`quiz.${hint.hintKey.toLowerCase()}`)}:
                        </span>
                        <span className="text-xs ml-1 font-semibold text-brand-yellowa break-words">
                          {buildHintDescription(hint)}
                        </span>
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {!revealed && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 w-full mt-8">
          {game.options.map((option) => (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              className={`text-xs md:text-sm xl:text-base rounded-xl py-2 px-3 font-medium transition-all duration-200 
              ${
                selected === option
                  ? option === game.playerName
                    ? "bg-brand-yellow text-brand-darkBg border border-brand-yellow"
                    : "bg-brand-darkBg border border-brand-danger text-brand-danger"
                  : "bg-brand-roseint border border-brand-yellow/40 hover:bg-brand-orangeo text-brand-white"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default GuessThePlayer;
