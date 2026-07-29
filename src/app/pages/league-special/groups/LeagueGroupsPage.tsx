import { useParams } from "react-router-dom";
import SubHeader from "../../../components/general/sub-header/SubHeader";
import Seo from "../../../main/seo/Seo";
import NoData from "../../../components/general/no-data/NoData";
import { LeagueGroupGridSkeleton } from "../../../components/general/skeleton/Skeleton";
import { useTranslation } from "react-i18next";
import LeagueGroupGrid from "../../../components/league/groups/grp-grid/LeagueGroupGrid";
import leagueSeoData from "../../../main/seo/league-metadata";

import {
  useLeaguePage,
  ApiService,
  cleanLeagueName,
  leagueTranslationKey,
} from "@matchinsights/core";
import { BannerProps } from "../../../common-props/BannerProps";

interface LeagueGroupsPageProps {
  apiService: ApiService;
  bannerProps: BannerProps;
}

export default function LeagueGroupsPage({
  apiService,
  bannerProps,
}: LeagueGroupsPageProps) {
  const { leagueId } = useParams<{ leagueId: string }>();
  const { t } = useTranslation();

  const parsedLeagueId = Number(leagueId);

  const { leagueInfo, leagueLinks, hasMultipleGroups, loadingLeagueInfo } =
    useLeaguePage(apiService, parsedLeagueId, t);

  const leagueHeader = (): string => {
    if (!leagueInfo?.name || leagueInfo?.name === "Unknown League") {
      return t("lggroups.header");
    }
    return t(`league.${leagueTranslationKey(leagueInfo?.name)}`, {
      defaultValue: leagueInfo.name,
    });
  };

  if (!leagueId || Number.isNaN(parsedLeagueId)) {
    return (
      <Seo
        {...leagueSeoData(parsedLeagueId, leagueHeader(), t, "groups/league")}
      >
        <div className="w-full justify-between px-2 sm:px-12 py-6 space-y-6">
          <div className="text-center text-brand-aqualight bg-brand-aqua/15 border border-brand-aqua/30 px-4 py-2 mb-2 text-lg leading-tight rounded-lg">
            <p className="mx-auto">{t("lggroups.title")}</p>
          </div>
          <SubHeader
            title={cleanLeagueName(leagueHeader())}
            apiService={apiService}
            logoUrl={leagueInfo?.logo ?? ""}
            optionalLinks={leagueLinks}
            subTitle={
              leagueInfo?.country
                ? t(`country.${leagueInfo?.country?.toLowerCase()}`, {
                    defaultValue: leagueInfo?.country,
                  })
                : ""
            }
            bannersService={bannerProps.bannersService}
          />
          <NoData />
        </div>
      </Seo>
    );
  }

  return (
    <Seo
      {...leagueSeoData(Number(leagueId), leagueHeader(), t, "groups/league")}
    >
      {(!leagueId || Number.isNaN(parsedLeagueId)) && <NoData />}

      {leagueId && Number.isNaN(parsedLeagueId) === false && (
        <div className="w-full justify-between px-2 sm:px-12 py-6 space-y-6">
          <div className="text-center text-brand-aqualight bg-brand-aqua/15 border border-brand-aqua/30 px-4 py-2 mb-2 text-lg leading-tight rounded-lg">
            <p className="mx-auto">{t("lggroups.title")}</p>
          </div>
          <SubHeader
            title={cleanLeagueName(leagueHeader())}
            apiService={apiService}
            logoUrl={leagueInfo?.logo ?? ""}
            optionalLinks={leagueLinks}
            subTitle={
              leagueInfo?.country
                ? t(`country.${leagueInfo?.country?.toLowerCase()}`, {
                    defaultValue: leagueInfo?.country,
                  })
                : ""
            }
            bannersService={bannerProps.bannersService}
          />

          <div className="w-full mx-auto mt-8">
            {!loadingLeagueInfo && (!leagueInfo || !hasMultipleGroups) && (
              <NoData />
            )}

            {loadingLeagueInfo && <NoData loading={true} skeleton={<LeagueGroupGridSkeleton />} />}

            {leagueInfo && hasMultipleGroups && (
              <section className="bg-brand-card ring-1 ring-gray-500 rounded-lg p-2 sm:p-4">
                <LeagueGroupGrid
                  key={`grps-grid-${leagueId}`}
                  groups={leagueInfo.group ?? []}
                />
              </section>
            )}
          </div>
        </div>
      )}
    </Seo>
  );
}
