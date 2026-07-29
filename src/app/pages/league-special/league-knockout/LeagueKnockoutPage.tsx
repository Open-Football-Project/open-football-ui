import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import SubHeader from "../../../components/general/sub-header/SubHeader";
import Seo from "../../../main/seo/Seo";
import NoData from "../../../components/general/no-data/NoData";
import { FixtureListSkeleton } from "../../../components/general/skeleton/Skeleton";

import leagueSeoData from "../../../main/seo/league-metadata";
import KnockoutBracketSection from "../../../components/league/knockout/bracket-tree/KnockoutBracketSection";

import {
  ApiService,
  useLeaguePage,
  cleanLeagueName,
  leagueTranslationKey,
} from "@matchinsights/core";

import { BannerProps } from "../../../common-props/BannerProps";


interface LeagueKnockoutPageProps {
  apiService: ApiService;
  bannerProps: BannerProps;
}


const LeagueKnockoutPage = ({
  apiService,
  bannerProps,
}: LeagueKnockoutPageProps) => {

  const { leagueId } = useParams<{ leagueId: string }>();
  const parsedLeagueId = Number(leagueId);

  const { t } = useTranslation();


  const {
    fixtures,
    leagueInfo,
    isLeaguefixturesAvailable,
    leagueLinks,
    hasKnockoutPhase,
    loadingFixtures,
  } = useLeaguePage(
    apiService,
    parsedLeagueId,
    t
  );


  const leagueHeader = (): string => {
    if (
      !leagueInfo?.name ||
      leagueInfo.name === "Unknown League"
    ) {
      return t("knockout.header");
    }

    return t(
      `league.${leagueTranslationKey(leagueInfo.name)}`,
      {
        defaultValue: leagueInfo.name,
      }
    );
  };


  const headerSubtitle = leagueInfo?.country
    ? t(
        `country.${leagueInfo.country.toLowerCase()}`,
        {
          defaultValue: leagueInfo.country,
        }
      )
    : "";


  const renderContent = () => {

    if (loadingFixtures) {
      return (
        <NoData
          loading
          skeleton={<FixtureListSkeleton />}
        />
      );
    }


    if (
      !hasKnockoutPhase ||
      !isLeaguefixturesAvailable ||
      !fixtures
    ) {
      return (
        <div className="mt-10 bg-brand-card rounded-lg p-1">
          <NoData />
        </div>
      );
    }


    return (
      <div className="
        mt-10
        bg-brand-card
        ring-1
        ring-gray-500
        rounded-lg
        p-2
        overflow-hidden
      ">
        <KnockoutBracketSection
          fixtures={fixtures}
          leagueName={leagueInfo?.name ?? ""}
        />
      </div>
    );
  };


  const pageContainer = `
    w-full
    px-2
    sm:px-12
    py-6
    space-y-6
  `;


  const titleBox = (title: string) => (
    <div className="
      text-center
      text-brand-aqualight
      bg-brand-aqua/15
      border
      border-brand-aqua/30
      px-4
      py-2
      rounded-lg
    ">
      <p>{title}</p>
    </div>
  );


  if (!leagueId || Number.isNaN(parsedLeagueId)) {

    return (
      <Seo
        {...leagueSeoData(
          parsedLeagueId,
          leagueHeader(),
          t,
          "knockout/league"
        )}
      >

        <div className={pageContainer}>

          {titleBox(t("lggroups.title"))}


          <SubHeader
            title={cleanLeagueName(leagueHeader())}
            apiService={apiService}
            logoUrl={leagueInfo?.logo ?? ""}
            optionalLinks={leagueLinks}
            subTitle={headerSubtitle}
            bannersService={bannerProps.bannersService}
          />


          <NoData />

        </div>

      </Seo>
    );
  }


  return (
    <Seo
      {...leagueSeoData(
        parsedLeagueId,
        leagueHeader(),
        t,
        "knockout/league"
      )}
    >

      <div className={pageContainer}>

        {titleBox(t("knockout.title"))}


        <SubHeader
          title={cleanLeagueName(leagueHeader())}
          apiService={apiService}
          logoUrl={leagueInfo?.logo ?? ""}
          subTitle={headerSubtitle}
          bannersService={bannerProps.bannersService}
          optionalLinks={leagueLinks}
        />


        {renderContent()}

      </div>

    </Seo>
  );
};


export default LeagueKnockoutPage;