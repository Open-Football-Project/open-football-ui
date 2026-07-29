import { useParams } from "react-router-dom";
import SubHeader from "../../components/general/sub-header/SubHeader";
import { LeagueFixtureComponent } from "../../components/league/league-fixture/LeagueFixtureComponent";
import LeagueStanding from "../../components/league/league-standing/LeagueStanding";
import leagueSeoData from "../../main/seo/league-metadata";
import Seo from "../../main/seo/Seo";
import Breadcrumb from "../../main/seo/breadcrumb/Breadcrumb";
import NoData from "../../components/general/no-data/NoData";
import { LeaguePageSkeleton } from "../../components/general/skeleton/Skeleton";
import LeagueRankingTabs from "../../components/league/league-rankings/league-ranking-tabs/LeagueRankingTab";
import { useTranslation } from "react-i18next";
import {
  ApiService,
  useLeaguePage,
  cleanLeagueName,
  leagueTranslationKey,
} from "open-football-project-core";
import VideoContentComponent from "../../components/general/video-content/VideoContentComponent";
import { BannerProps } from "../../common-props/BannerProps";
import CountryBanners from "../../components/general/banners/country-banners/CountryBanners";

interface LeaguePageProps {
  apiService: ApiService;
  bannerProps: BannerProps;
}

export default function LeaguePage({
  apiService,
  bannerProps,
}: LeaguePageProps) {
  const { leagueId } = useParams<{ leagueId: string }>();
  const { t } = useTranslation();
  const {
    fixtures,
    leagueInfo,
    loadingFixtures,
    loadingLeagueInfo,
    isLeagueInfoAvailable,
    isLeaguefixturesAvailable,
    isAssistsAvailable,
    assists,
    isRedCardsAvailable,
    redCards,
    isYellowCardsAvailable,
    yellowCards,
    isTopScorersAvailable,
    topScorers,
    leagueLinks,
  } = useLeaguePage(apiService, Number(leagueId), t);

  const isLoading = loadingFixtures || loadingLeagueInfo;

  const leagueHeader = (): string => {
    if (!leagueInfo?.name || leagueInfo?.name === "Unknown League") {
      return t("leagues.details");
    }
    return t(`league.${leagueTranslationKey(leagueInfo?.name)}`, {
      defaultValue: leagueInfo.name,
    });
  };
  return (
    <Seo {...leagueSeoData(Number(leagueId), leagueHeader(), t)}>
      <Breadcrumb
        items={[
          { name: "Home", url: "https://futballero.com/" },
          { name: "Leagues", url: "https://futballero.com/leaguesall" },
          {
            name: leagueHeader(),
            url: `https://futballero.com/league/${leagueId}`,
          },
        ]}
      />
      <div className="w-full justify-between px-2 sm:px-12 py-6 space-y-6">
        <div className="text-center text-brand-aqualight bg-brand-aqua/15 border border-brand-aqua/30 px-4 py-2 mb-2 text-lg leading-tight rounded-lg">
          <p className="mx-auto">{t("leagues.head")}</p>
        </div>
        <SubHeader
          title={cleanLeagueName(leagueHeader())}
          apiService={apiService}
          logoUrl={leagueInfo?.logo ?? ""}
          subTitle={
            leagueInfo?.country
              ? t(`country.${leagueInfo?.country?.toLowerCase()}`, {
                  defaultValue: leagueInfo?.country,
                })
              : ""
          }
          optionalLinks={leagueLinks}
          bannersService={bannerProps.bannersService}
        />

        {isLoading && (
          <div className="mt-10 bg-brand-card rounded-lg p-1">
            <NoData loading={isLoading} skeleton={<LeaguePageSkeleton />} />
          </div>
        )}



        <div className="w-full mx-auto mt-8 flex flex-col lg:flex-row gap-4">
          {!isLoading && isLeagueInfoAvailable && (
            <div className="w-full lg:w-1/2 bg-brand-card rounded-lg p-1 ring-1 ring-gray-500">
              <h4 className="py-2 px-4 mb-4 text-left font-semibold bg-black/40 text-brand-cream rounded-t-lg">
                {t("leagues.standing")}
              </h4>
              <LeagueStanding
                key={`standing-${leagueId}`}
                leagueInfo={leagueInfo}
                loading={loadingLeagueInfo}
              />
            </div>
          )}

          {!isLoading && isLeaguefixturesAvailable && (
            <div className="w-full lg:w-1/2 bg-brand-card rounded-lg p-1 ring-1 ring-gray-500">
              <h4 className="py-2 px-4 mb-4 text-left font-semibold bg-black/40 text-brand-cream rounded-t-lg">
                {t("leagues.fixtures")}
              </h4>
              <LeagueFixtureComponent
                key={`fixtures-${leagueId}`}
                fixture={fixtures}
                loading={loadingFixtures}
                apiService={apiService}
                leagueName={leagueInfo?.name}
                leagueLogo={leagueInfo?.logo}
              />
            </div>
          )}
        </div>

        <div className="p-1">
        <CountryBanners bannerProps={bannerProps} />
        </div>

        {!isLoading && isLeagueInfoAvailable && leagueInfo?.videos && leagueInfo.videos.length > 0 && (
          <VideoContentComponent videos={leagueInfo.videos} />
        )}
        
        {!isLoading &&
          (isAssistsAvailable ||
            isTopScorersAvailable ||
            isYellowCardsAvailable ||
            isRedCardsAvailable) && (
            <div className="mt-10 bg-brand-card ring-1 ring-gray-500 rounded-lg p-1">
              <LeagueRankingTabs
                topScorers={topScorers}
                assists={assists}
                yellowCards={yellowCards}
                redCards={redCards}
              />
            </div>
          )}

        {!isLoading &&
          !(
            isAssistsAvailable ||
            isTopScorersAvailable ||
            isYellowCardsAvailable ||
            isRedCardsAvailable
          ) &&
          !isLeaguefixturesAvailable && (
            <div className="mt-10 bg-brand-card rounded-lg p-1">
              <NoData />
            </div>
          )}
      </div>
    </Seo>
  );
}
