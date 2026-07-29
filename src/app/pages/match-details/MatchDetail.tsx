import { useParams } from "react-router-dom";
import { MatchDetails } from "@matchinsights/core";
import { ApiService } from "@matchinsights/core";
import NoData from "../../components/general/no-data/NoData";
import { MatchDetailSkeleton } from "../../components/general/skeleton/Skeleton";
import { DetailsMainInfo } from "../../components/match/match-details/details-main-info/DetailsMainInfo";
import SubHeader from "../../components/general/sub-header/SubHeader";
import { MatchDetailsSecondRow } from "../../components/match/match-details/match-details-second-row/MatchDetailsSecondRow";
import matchSeoData from "../../main/seo/match-metadata";
import Seo from "../../main/seo/Seo";
import Breadcrumb from "../../main/seo/breadcrumb/Breadcrumb";
import MatchDetailsThirdRow from "../../components/match/match-details/match-details-third-row/MatchDetailsThirdRow";
import MatchDetailsTabs from "../../components/match/match-detail-tabs/MatchDetailsTabs";
import { MatchIndicators } from "../../components/match/match-details/match-indicators/MatchIndicators";
import {
  isUTCDateInFutureLocal,
  isUTCDateTodayLocal,
  useMatchDetail,
  useHeadToHead,
  useValueBets,
} from "@matchinsights/core";
import BettingToolWrapper from "../../components/match/match-details/value-bets/wrapper/BettingToolWrapper";
import VideoContentComponent from "../../components/general/video-content/VideoContentComponent";
import { useTranslation } from "react-i18next";
import { BannerProps } from "../../common-props/BannerProps";
import CountryBanners from "../../components/general/banners/country-banners/CountryBanners";

interface MatchDetailProps {
  apiService: ApiService;
  bannerProps: BannerProps;
}

export default function MatchDetail({
  apiService,
  bannerProps,
}: MatchDetailProps) {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();

  const cardClass = "w-full bg-brand-card p-4 rounded-lg shadow-md";

  const {
    loadingMatchDetail,
    matchDetail,
    isMatcheDetailAvalable,
    isLineupsAvailable,
    matchLineups,
    isStatsAvailable,
    matchStats,
    events,
    isEventsAvailable,
  } = useMatchDetail(apiService, Number(id));

  const { valueBets, loadingValueBets, isValueBetsAvailable } = useValueBets(
    apiService,
    Number(id)
  );


  const { h2hDetails, loadingH2hDetail, isHead2HeadAvailable } = useHeadToHead(
    apiService,
    matchDetail?.homeTeam?.id ?? -1,
    matchDetail?.awayTeam?.id ?? -1
  );

  if (loadingMatchDetail)
    return (
      <Seo
        title={t("matchdetails.title")}
        description={t("matchdetails.head")}
        url={`https://futballero.com/match/${id ?? ""}`}
        robots="noindex, nofollow"
      >
        <NoData loading={loadingMatchDetail} skeleton={<MatchDetailSkeleton />} />
      </Seo>
    );

  if (!isMatcheDetailAvalable)
    return (
      <Seo
        title={t("matchdetails.title")}
        description={t("matchdetails.head")}
        url={`https://futballero.com/match/${id ?? ""}`}
        robots="noindex, nofollow"
      >
        <div className="w-full px-2 sm:px-12 py-6">
          <div className="text-center text-brand-aqualight bg-brand-aqua/15 border border-brand-aqua/30 px-4 py-2 mb-2 text-lg leading-tight rounded-lg">
            <p className="mx-auto">{t("matchdetails.head")}</p>
          </div>
          <SubHeader
            title={t("matchdetails.title")}
            apiService={apiService}
            bannersService={bannerProps.bannersService}
          />
          <NoData />
        </div>
      </Seo>
    );

  const {
    homeTeam,
    awayTeam,
    date,
    venue,
    league,
    goals,
    score,
    statusLong,
    isLiveNow,
    videos,
  } = matchDetail as MatchDetails;

  return (
    <Seo {...matchSeoData(Number(id), homeTeam.name, awayTeam.name, date, t, venue)}>
      <Breadcrumb items={[
        { name: "Home", url: "https://futballero.com/" },
        { name: "Matches", url: "https://futballero.com/matches" },
        { name: `${homeTeam.name} vs ${awayTeam.name}`, url: `https://futballero.com/match/${id}` },
      ]} />
      <div className="w-full justify-between px-2 sm:px-12 py-6 space-y-6">
        <div className="text-center text-brand-aqualight bg-brand-aqua/15 border border-brand-aqua/30 px-4 py-2 mb-2 text-lg leading-tight rounded-lg">
          <p className="mx-auto">{t("matchdetails.head")}</p>
        </div>
        <SubHeader
          title={t("matchdetails.title")}
          apiService={apiService}
          bannersService={bannerProps.bannersService}
        />

        <div className={`${cardClass} ring-1 ring-gray-500`}>
          <DetailsMainInfo
            homeTeam={homeTeam}
            awayTeam={awayTeam}
            date={date}
            venue={venue}
            league={league}
            score={score}
            goals={goals}
            statusLong={statusLong}
            isLiveNow={isLiveNow}
            fixtureId={Number(id)}
            apiService={apiService}
          />
        </div>


        {!isLiveNow &&
          (isStatsAvailable || isEventsAvailable || isLineupsAvailable) && (
            <MatchDetailsTabs
              liveStats={matchStats}
              matchEvents={events}
              homeTeamName={homeTeam.name}
              homeTeamLogo={homeTeam.logo ?? ""}
              awayTeamName={awayTeam.name}
              awayTeamLogo={awayTeam.logo ?? ""}
              liveLineups={matchLineups}
            />
          )}

        {isUTCDateTodayLocal(date) && (
          <div data-testid="top-row" className="bg-brand-card rounded-lg p-4 ring-1 ring-gray-500">
            <MatchIndicators
              apiService={apiService}
              homeTeam={homeTeam.name}
              homeTeamId={homeTeam.id}
              awayTeam={awayTeam.name}
              awayTeamId={awayTeam.id}
              leagueId={league.id}
              fixtureDate={date}
              matchId={Number(id)}
            />
          </div>
        )}

        {isValueBetsAvailable && isUTCDateInFutureLocal(date) && (
          <div className="bg-brand-card rounded-lg p-4 ring-1 ring-gray-500">
            <BettingToolWrapper data={valueBets} isLoading={loadingValueBets} />
          </div>
        )}

        <div className="p-1">
        <CountryBanners bannerProps={bannerProps} />
        </div>

        <div data-testid="second-row" className={`${cardClass} ring-1 ring-gray-500`}>
          <MatchDetailsSecondRow
            apiService={apiService}
            homeTeam={homeTeam.name}
            homeTeamId={homeTeam.id}
            awayTeam={awayTeam.name}
            awayTeamId={awayTeam.id}
            leagueId={league.id}
          />
        </div>

        {videos && videos.length > 0 && (
          <VideoContentComponent videos={videos} />
        )}

 
        {isMatcheDetailAvalable && isHead2HeadAvailable && (
          <div data-testid="third-row" className={`${cardClass} ring-1 ring-gray-500`}>
            <MatchDetailsThirdRow
              h2hDetails={h2hDetails}
              isLoading={loadingH2hDetail}
              homeTeamName={homeTeam.name}
              awayTeamName={awayTeam.name}
            />
          </div>
        )}
      </div>
    </Seo>
  );
}
