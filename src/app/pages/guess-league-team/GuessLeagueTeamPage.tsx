import {
  ApiService,
  anyMainLeagueId,
  useGuessTheTeam,
  useLeaguePage,
  translateLeague,
} from "@matchinsights/core";

import NoData from "../../components/general/no-data/NoData";
import { GenericContentSkeleton } from "../../components/general/skeleton/Skeleton";
import SubHeader from "../../components/general/sub-header/SubHeader";
import Seo from "../../main/seo/Seo";
import { useParams } from "react-router-dom";
import guessTheTeamGameSeoData from "../../main/seo/guess-the-team-game";
import { useTranslation } from "react-i18next";
import GuessTheTeam from "../../components/games/team/GuessTheTeam";
import { BannerProps } from "../../common-props/BannerProps";

interface GuessTeamPlayerProps {
  apiService: ApiService;
  bannerProps: BannerProps;
}

const GuessLeagueTeamPage = ({
  apiService,
  bannerProps,
}: GuessTeamPlayerProps) => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();

  const { leagueLinks, leagueInfo, loadingLeagueInfo } = useLeaguePage(
    apiService,
    Number(id),
    t
  );

  const {
    isGuessTheTeamAvailable,
    guessTheTeam,
    loadingGuessTheTeam,
    getNewGame,
  } = useGuessTheTeam(apiService, Number(id));

  const canDisplayGame =
    isGuessTheTeamAvailable && anyMainLeagueId([Number(id)]);

  if (loadingGuessTheTeam || loadingLeagueInfo)
    return (
      <Seo
        {...guessTheTeamGameSeoData(Number(id), t("quiz.football_quizzes"), t)}
        robots="noindex, nofollow"
      >
        <NoData loading={true} skeleton={<GenericContentSkeleton />} />
      </Seo>
    );

  if (!canDisplayGame)
    return (
      <Seo
        {...guessTheTeamGameSeoData(
          Number(id),
          leagueInfo?.name ?? t("quiz.football_quizzes"),
          t
        )}
        robots="noindex, nofollow"
      >
        <NoData
          isBigMessage={true}
          message={`${t("common.not_available_for")} ${leagueInfo?.name}`}
        />
      </Seo>
    );

  return (
    <Seo
      {...guessTheTeamGameSeoData(
        Number(id),
        leagueInfo?.name ?? t("quiz.football_quizzes"),
        t
      )}
    >
      <div className="w-full justify-between px-2 sm:px-12 py-6 space-y-6">
        <div className="text-center text-brand-aqualight bg-brand-aqua/15 border border-brand-aqua/30 px-4 py-2 mb-2 text-lg leading-tight rounded-lg">
          <p className="mx-auto">{t("quiz.football_quizzes")}</p>
        </div>
        <SubHeader
          title={t("quiz.team_quiz")}
          apiService={apiService}
          logoUrl={leagueInfo?.logo || ""}
          subTitle={translateLeague(leagueInfo?.name ?? "", t)}
          bannersService={bannerProps.bannersService}
          optionalLinks={leagueLinks}
        />

        {!loadingGuessTheTeam &&
          canDisplayGame &&
          isGuessTheTeamAvailable &&
          guessTheTeam && (
            <div className="w-full p-4 ">
              <GuessTheTeam
                game={guessTheTeam}
                newGame={getNewGame}
                leagueName={leagueInfo?.name ?? t("common.unknown")}
                bannerProps={bannerProps}
              />
            </div>
          )}

        {loadingGuessTheTeam && <NoData loading={true} skeleton={<GenericContentSkeleton />} />}
      </div>
    </Seo>
  );
};

export default GuessLeagueTeamPage;
