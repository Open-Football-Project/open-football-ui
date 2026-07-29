import TeamInfo from "../../components/team/team-details/team-info/TeamInfo";
import { TeamSquad } from "../../components/team/team-details/team-squad/TeamSquad";
import { useParams } from "react-router-dom";
import NoData from "../../components/general/no-data/NoData";
import { TeamDetailSkeleton } from "../../components/general/skeleton/Skeleton";
import SubHeader from "../../components/general/sub-header/SubHeader";
import TeamFixtureComponent from "../../components/team/team-fixture/TeamFixtureComponent";
import teamSeoData from "../../main/seo/team-metadata";
import Seo from "../../main/seo/Seo";
import Breadcrumb from "../../main/seo/breadcrumb/Breadcrumb";
import {
  useTeamDetail,
  TeamDetails,
  ApiService,
} from "@matchinsights/core";

import { useTranslation } from "react-i18next";
import VideoContentComponent from "../../components/general/video-content/VideoContentComponent";
import { BannerProps } from "../../common-props/BannerProps";
import CountryBanners from "../../components/general/banners/country-banners/CountryBanners";

interface TeamDetailsPageProps {
  apiService: ApiService;
  bannerProps: BannerProps;
}

const TeamDetailsPage = ({
  apiService,
  bannerProps,
}: TeamDetailsPageProps) => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();

  const {
    loadingTeamDetails,
    teamDetails,
    teamPlayers,
    isTeamDetailsAvailable,
    isTeamPlayersAvailable,
    isTeamLeaguesAvailable,
    teamLeagues,
    teamlinks,
  } = useTeamDetail(apiService, Number(id), t);

  if (loadingTeamDetails)
    return (
      <Seo
        {...teamSeoData(Number(id), teamDetails?.teamName ?? "Football", t)}
        robots="noindex, nofollow"
      >
        <NoData loading={loadingTeamDetails} skeleton={<TeamDetailSkeleton />} />
      </Seo>
    );

  return (
    <Seo {...teamSeoData(Number(id), teamDetails?.teamName ?? "Football", t)}>
      <Breadcrumb
        items={[
          { name: "Home", url: "https://futballero.com/" },
          { name: "Leagues", url: "https://futballero.com/leaguesall" },
          {
            name: teamDetails?.teamName ?? "Team",
            url: `https://futballero.com/team/${id}`,
          },
        ]}
      />
      <div className="w-full justify-between px-2 sm:px-12 py-6 space-y-6">
        <div className="text-center text-brand-aqualight bg-brand-aqua/15 border border-brand-aqua/30 px-4 py-2 mb-2 text-lg leading-tight rounded-lg">
          <p className="mx-auto">{t("teampage.head")}</p>
        </div>
        <SubHeader
          title={t("teampage.title")}
          apiService={apiService}
          logoUrl={teamDetails?.teamLogo}
          subTitle={teamDetails?.teamName}
          optionalLinks={teamlinks}
          bannersService={bannerProps.bannersService}
        />

        {isTeamDetailsAvailable && (
          <div className="w-full bg-brand-navbar p-4 rounded-lg shadow-md ring-1 ring-gray-500">
            <TeamInfo
              teamDetails={teamDetails as TeamDetails}
              teamLeagues={teamLeagues}
              isTeamLeaguesAvailable={isTeamLeaguesAvailable}
            />
          </div>
        )}

        {!isTeamDetailsAvailable && (
          <div className="w-full bg-brand-card p-4 rounded-lg shadow-md ring-1 ring-gray-500">
            <NoData />
          </div>
        )}

        {isTeamDetailsAvailable && (
          <div className="w-full bg-brand-card rounded-lg shadow-md ring-1 ring-gray-500">
            <TeamFixtureComponent
              apiService={apiService}
              teamId={Number(id)}
              teamName={teamDetails?.teamName}
              teamLogo={teamDetails?.teamLogo}
            />
          </div>
        )}

        {isTeamDetailsAvailable && teamDetails?.videos && teamDetails.videos.length > 0 && (
          <VideoContentComponent videos={teamDetails.videos} />
        )}

        <div className="p-1">
        <CountryBanners bannerProps={bannerProps} />
        </div>

        {isTeamDetailsAvailable && isTeamPlayersAvailable && (
          <div className="w-full bg-brand-card ring-1 ring-gray-500 rounded-lg shadow-md">
            <TeamSquad players={teamPlayers} teamName={teamDetails?.teamName} teamLogo={teamDetails?.teamLogo} />
          </div>
        )}
      </div>
    </Seo>
  );
};

export default TeamDetailsPage;
