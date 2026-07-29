import {
  ApiService,
  useTeamDetail,
  useGuessThePlayer,
} from "open-football-project-core";
import NoData from "../../components/general/no-data/NoData";
import { GenericContentSkeleton } from "../../components/general/skeleton/Skeleton";
import SubHeader from "../../components/general/sub-header/SubHeader";
import guessThePlayerGameSeoData from "../../main/seo/guess-the-player-game";
import Seo from "../../main/seo/Seo";
import GuessThePlayer from "../../components/games/player/GuessThePlayer";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BannerProps } from "../../common-props/BannerProps";

interface GuessTeamPlayerProps {
  apiService: ApiService;
  bannerProps: BannerProps;
}

const GuessTeamPlayerPage = ({
  apiService,
  bannerProps,
}: GuessTeamPlayerProps) => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();

  const {
    loadingTeamDetails,
    teamDetails,
    loadingTeamLeagues,
    teamlinks,
    canDisplayTeamPlayerGame,
  } = useTeamDetail(apiService, Number(id), t);

  const {
    isGuessThePlayerAvailable,
    guessThePlayer,
    loadingGuessThePlayer,
    getNewGame,
  } = useGuessThePlayer(apiService, Number(id));

  if (loadingTeamDetails || loadingGuessThePlayer || loadingTeamLeagues)
    return (
      <Seo
        {...guessThePlayerGameSeoData(
          Number(id),
          teamDetails?.teamName ?? t("quiz.football_quizzes"),
          t
        )}
        robots="noindex, nofollow"
      >
        <NoData loading={true} skeleton={<GenericContentSkeleton />} />
      </Seo>
    );

  if (!canDisplayTeamPlayerGame)
    return (
      <Seo
        {...guessThePlayerGameSeoData(
          Number(id),
          teamDetails?.teamName ?? t("quiz.football_quizzes"),
          t
        )}
        robots="noindex, nofollow"
      >
        <NoData
          isBigMessage={true}
          message={`${t("common.not_available_for")} ${teamDetails?.teamName}`}
        />
      </Seo>
    );

  return (
    <Seo
      {...guessThePlayerGameSeoData(
        Number(id),
        teamDetails?.teamName ?? t("quiz.football_quizzes"),
        t
      )}
    >
      <div className="w-full justify-between px-2 sm:px-12 py-6 space-y-6">
        <div className="text-center text-brand-aqualight bg-brand-aqua/15 border border-brand-aqua/30 px-4 py-2 mb-2 text-lg leading-tight rounded-lg">
          <p className="mx-auto">{t("quiz.football_quizzes")}</p>
        </div>
        <SubHeader
          title={t("quiz.player_quiz")}
          apiService={apiService}
          logoUrl={teamDetails?.teamLogo}
          subTitle={teamDetails?.teamName || ""}
          bannersService={bannerProps.bannersService}
          optionalLinks={teamlinks}
        />

        {!loadingGuessThePlayer &&
          canDisplayTeamPlayerGame &&
          isGuessThePlayerAvailable &&
          guessThePlayer && (
            <div className="w-full p-4 ">
              <GuessThePlayer
                game={guessThePlayer}
                newGame={getNewGame}
                teamName={teamDetails?.teamName ?? t("common.unknown")}
                bannerProps={bannerProps}
             />
            </div>
          )}

        {loadingGuessThePlayer && <NoData loading={true} skeleton={<GenericContentSkeleton />} />}
      </div>
    </Seo>
  );
};

export default GuessTeamPlayerPage;
