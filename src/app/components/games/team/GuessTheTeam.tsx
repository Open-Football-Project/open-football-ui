import { useCallback, useState } from "react";
import { FaXTwitter, FaDownload } from "react-icons/fa6";
import {
  buildTeamTriviaSvg,
  cleanLeagueName,
  GuessTheTeamGameData,
  GuessTheTeamGameHint,
  leagueTranslationKey,
} from "@matchinsights/core";
import fclogo from "../../../../app/assets/images/fclogo.png";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDownloadTrivia } from "../../../special-hooks/download-trivia/download-trivia";
import { BannerProps } from "../../../common-props/BannerProps";
import CountryBanners from "../../general/banners/country-banners/CountryBanners";
import { trackEvent, AnalyticsEvent } from "../../../utils/analytics/analytics";

interface GuessTheTeamProps {
  game: GuessTheTeamGameData;
  newGame: () => void;
  leagueName: string;
  bannerProps: BannerProps;
}

const GuessTheTeam = ({ game, newGame, leagueName, bannerProps }: GuessTheTeamProps) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [wrongGuess, setWrongGuess] = useState(true);

  const { t } = useTranslation();

  const leagueNameLabel = cleanLeagueName(
    t(`league.${leagueTranslationKey(leagueName)}`, {
      defaultValue: leagueName,
    }),
  );

  const handleSelect = (option: string) => {
    setSelected(option);
    const correct = option === game.teamName;
    trackEvent(AnalyticsEvent.QUIZ_ANSWERED, { game_type: "team", result: correct ? "correct" : "wrong" });
    if (correct) {
      setRevealed(true);
      setWrongGuess(false);
    } else {
      setWrongGuess(true);
      setRevealed(false);
    }
  };

  const hintTraslation = (hint: GuessTheTeamGameHint): string => {
    return `${t(`quiz.${hint.description.toLowerCase()}`)}`;
  };

  const getSvgData = useCallback(
    () =>
      buildTeamTriviaSvg({
        title: `${t("quiz.team_quiz")} — ${leagueNameLabel}`,
        subtitle: `${t("common.founded")}: ${game.founded > 0 ? game.founded : "?"} • ${t("common.season")}: ${game.season}`,
        hints: game.hints.map((hint) => ({
          emoji: hint.hintKey === "PLAYER" ? "👟" : "🏟️",
          label: t(`quiz.${hint.description.toLowerCase()}`),
          value: hint.value,
        })),
        options: game.options,
        filename: `team-quiz-${String(game.season).replace("/", "-")}.png`,
      }),
    [game, t],
  );

  const { download, downloading } = useDownloadTrivia(getSvgData);

  const handleAskTwitter = () => {
    const currentUrl =
      typeof window !== "undefined" ? window.location.href : "";

    const formatHint = (hint: GuessTheTeamGameHint) => {
      if (hint.hintKey === "PLAYER") {
        return `👟 ${hintTraslation(hint)}: ${hint.value}`;
      }
      return `🏟️ ${hintTraslation(hint)}: ${hint.value}`;
    };

    const header = `🤔 ${t("quiz.team_quiz")} — ${t("common.founded")}: ${
      game.founded
    }, ${t("common.season")}: ${game.season}\n`;
    const text = encodeURIComponent(
      `${header}${game.hints
        .map(formatHint)
        .join(
          "\n",
        )}\n\n${currentUrl}\n\n#${leagueNameLabel} #${t("quiz.team_quiz").replace(/\s+/g, "")}`,
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
          <div className="flex flex-wrap justify-center gap-3 w-full mt-2">
            
            <button
              onClick={newGame}
              className="text-xs md:text-sm xl:text-sm bg-brand-yellow text-brand-darkBg font-semibold rounded-xl py-2 px-4 hover:bg-brand-orange transition"
            >
              {t("quiz.new_quiz")}
            </button>
            
            <button
              onClick={handleAskTwitter}
              className="flex items-center justify-center gap-2 text-xs md:text-sm xl:text-sm border border-brand-yellow text-brand-yellow rounded-xl py-2 px-4 bg-brand-darkBg hover:bg-brand-yellow hover:text-brand-darkBg transition"
            >
              <FaXTwitter className="w-4 h-4 md:w-5 md:h-5 xl:w-6 xl:h-6" />
              {t("common.ask_help")}
            </button>

            <button
              onClick={download}
              disabled={downloading}
              className="flex items-center justify-center gap-2 text-xs md:text-sm xl:text-sm border border-brand-yellow text-brand-yellow rounded-xl py-2 px-4 bg-brand-darkBg hover:bg-brand-yellow hover:text-brand-darkBg transition disabled:opacity-50"
            >
              <FaDownload className="w-4 h-4 md:w-5 md:h-5 xl:w-6 xl:h-6" />
              {downloading ? "…" : t("common.download")}
            </button>

          </div>

          <div className="relative mt-8 w-20 h-20 md:w-48 md:h-48 xl:w-56 xl:h-56 2xl:w-64 2xl:h-64 rounded-full border border-brand-yellow overflow-hidden flex items-center justify-center bg-brand-darkBg">
            {revealed ? (
              <img
                src={game.teamLogo || fclogo}
                alt={game.teamName}
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={fclogo}
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

          <div className="text-xs uppercase text-brand-yellow mt-3 w-full">
            <div className="flex flex-wrap gap-4 justify-center">
              <p className="font-semibold text-xs md:text-sm xl:text-base text-brand-dona">
                <span>{t("common.founded")}:</span>
                <span className="ml-1 text-brand-aqua">
                  {game.founded > 0 ? game.founded : t("common.unknown")}
                </span>
              </p>

              <p className="font-semibold text-xs md:text-sm xl:text-base text-brand-dona">
                <span>{t("common.season")}:</span>
                <span className="ml-1 text-brand-aqua">{game.season}</span>
              </p>
            </div>

            {selected && wrongGuess && !revealed && (
              <p className="mt-2 text-xs md:text-sm xl:text-base text-brand-red font-semibold animate-pulse">
                ❌ {t("quiz.wrong_opt")}
              </p>
            )}

            {!wrongGuess && revealed && (
              <Link to={`/team/${game.teamId}`}>
                <p className="text-sm md:text-base xl:text-lg mt-2 font-bold text-brand-success underline">
                  🎉 {game.teamName}
                </p>
              </Link>
            )}
          </div>
        </div>

        <div className="flex flex-col items-start text-left w-full md:w-3/5 xl:w-3/5 2xl:w-2/3 gap-3">
          <h4 className="text-xs md:text-sm xl:text-base text-brand-rose font-semibold uppercase">
            {t("quiz.hints")}
          </h4>
          {game.hints.length === 0 ? (
            <p className="text-xs md:text-sm xl:text-base uppercase text-brand-lightGray">
              {t("common.venue")} : {game.venue || t("common.unknown")}
            </p>
          ) : (
            <ul className="text-xs md:text-sm xl:text-base text-brand-lightGray space-y-2 w-full">
              {game.hints.map((hint, index) => (
                <li
                  key={index}
                  className="bg-brand-darkBg/60 rounded-2xl p-3 flex flex-col gap-2 border border-brand-yellow/20"
                >
                  <div className="flex items-start gap-2">
                    {hint.hintKey === "PLAYER" ? (
                      <span className="text-lg xl:text-xl 2xl:text-2xl leading-none">
                        👟
                      </span>
                    ) : (
                      <span className="text-lg xl:text-xl 2xl:text-2xl leading-none">
                        🏟️
                      </span>
                    )}
                    <p className="text-xs md:text-sm xl:text-base leading-relaxed break-words">
                      <span className="text-xs uppercase font-semibold text-brand-yellowa">
                        {hintTraslation(hint)}:
                      </span>
                      <span className="ml-1 text-xs uppercase text-white">{hint.value}</span>
                    </p>
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
                ? option === game.teamName
                  ? "bg-brand-yellow text-brand-darkBg border border-brand-yellow"
                  : "bg-brand-darkBg border border-brand-danger text-brand-danger"
                : "bg-brand-roseint border border-brand-yellow/40 hover:bg-brand-yellowa text-brand-white"
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

export default GuessTheTeam;
