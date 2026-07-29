import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { ApiService, PlayerPosition, translateLeague, useTodayPlayersStatus } from "@matchinsights/core";

import { BannerProps } from "../../common-props/BannerProps";
import Controls from "../../components/general/controls/Controls";
import NoData from "../../components/general/no-data/NoData";
import SubHeader from "../../components/general/sub-header/SubHeader";
import TodayPlayersPositionRow from "../../components/today-players/today-players-position-row/TodayPlayersPositionRow";
import Seo from "../../main/seo/Seo";
import todayPlayersSeoData from "../../main/seo/today-players-metadata";
import todayPlayersNotAvailableImg from "../../assets/gifs/g4.gif";
import { trackEvent, AnalyticsEvent } from "../../utils/analytics/analytics";

const POSITIONS_IN_PITCH_ORDER: PlayerPosition[] = [
  "ATTACKER",
  "MIDFIELDER",
  "DEFENDER",
  "GOALKEEPER",
];

interface TodayPlayersPageProps {
  apiService: ApiService;
  bannerProps: BannerProps;
}

const TodayPlayersPage = ({ apiService, bannerProps }: TodayPlayersPageProps) => {
  const { fixtureId } = useParams<{ fixtureId?: string }>();
  const { t } = useTranslation();

  const {
    leagues,
    selectedLeagueId,
    setSelectedLeagueId,
    fixturesInSelectedLeague,
    selectedFixtureId,
    setSelectedFixtureId,
    selectedFixture,
    loadingTodayPlayers,
    isTodayPlayersAvailable,
  } = useTodayPlayersStatus(apiService, fixtureId);

  return (
    <Seo
      {...todayPlayersSeoData(fixtureId, t)}
      robots={isTodayPlayersAvailable ? undefined : "noindex, nofollow"}
    >
      {loadingTodayPlayers ? (
        <div className="w-full flex items-center justify-center min-h-[60vh] px-2 sm:px-12">
          <NoData loading />
        </div>
      ) : !isTodayPlayersAvailable ? (
        <div className="w-full flex items-center justify-center min-h-[60vh] px-2 sm:px-12">
          <NoData
            message={t("todayplayers.no_data", {
              defaultValue: "No player data available right now",
            })}
            messageColor="text-white"
            image={todayPlayersNotAvailableImg}
            imageAlt={t("todayplayers.no_data_image_alt", {
              defaultValue: "No player data available",
            })}
          />
        </div>
      ) : (
        <div className="w-full px-2 sm:px-12 py-6">
          <SubHeader
            title={t("todayplayers.subheadertitle", { defaultValue: "Today's Players" })}
            apiService={apiService}
            bannersService={bannerProps.bannersService}
          />
          <Controls
            useDrop0
            drop0Label={t("todayplayers.pick_league", { defaultValue: "Select league" })}
            selectedDrop0={selectedLeagueId?.toString() ?? ""}
            setDrop0={(leagueId) => {
              setSelectedLeagueId(Number(leagueId));
              trackEvent(AnalyticsEvent.FILTER_APPLIED, { filter: "league", value: leagueId });
            }}
            drop0Options={leagues.map((league) => ({
              id: league.leagueId.toString(),
              value: translateLeague(league.leagueName, t),
            }))}
            useDrop1
            drop1Label={t("todayplayers.pick_fixture", { defaultValue: "Select match" })}
            selectedDrop1={selectedFixtureId?.toString() ?? ""}
            setDrop1={(selectedFixtureIdValue) => {
              setSelectedFixtureId(Number(selectedFixtureIdValue));
              trackEvent(AnalyticsEvent.FILTER_APPLIED, { filter: "fixture", value: selectedFixtureIdValue });
            }}
            drop1Options={fixturesInSelectedLeague.map((fixture) => ({
              id: fixture.fixtureId.toString(),
              value: `${fixture.homeTeamName} vs ${fixture.awayTeamName}`,
            }))}
          />
          <div data-testid="today-players-page">
            {selectedFixture ? (
              <>
                <h2 className="text-center text-lg sm:text-2xl font-bold mt-4 text-brand-aqualight">
                  {selectedFixture.homeTeamName} vs {selectedFixture.awayTeamName}
                </h2>
                <p
                  data-testid="today-players-disclaimer"
                  className="text-center text-[11px] uppercase tracking-wide text-brand-white/60 mb-6"
                >
                  {t("todayplayers.disclaimer", { defaultValue: "Predicted before kickoff" })}
                </p>
                <div className="flex flex-col gap-8">
                  {POSITIONS_IN_PITCH_ORDER.filter(
                    (position) =>
                      selectedFixture.home[position].length > 0 ||
                      selectedFixture.away[position].length > 0,
                  ).map((position) => (
                    <TodayPlayersPositionRow
                      key={position}
                      position={position}
                      homePlayerScores={selectedFixture.home[position]}
                      awayPlayerScores={selectedFixture.away[position]}
                      homeTeamName={selectedFixture.homeTeamName}
                      awayTeamName={selectedFixture.awayTeamName}
                    />
                  ))}
                </div>
              </>
            ) : (
              "no fixture"
            )}
          </div>
        </div>
      )}
    </Seo>
  );
};

export default TodayPlayersPage;
