import { useParams } from "react-router-dom";
import SubHeader from "../../../components/general/sub-header/SubHeader";
import Seo from "../../../main/seo/Seo";
import NoData from "../../../components/general/no-data/NoData";
import { TablePairSkeleton } from "../../../components/general/skeleton/Skeleton";
import { useTranslation } from "react-i18next";

import leagueSeoData from "../../../main/seo/league-metadata";
import ArgSpecialTable from "../../../components/league/arg-special/ArgSpecialTable";
import { ApiService, useLeaguePage } from "open-football-project-core";
import { BannerProps } from "../../../common-props/BannerProps";

interface ArgSpecialPageProps {
  apiService: ApiService;
  bannerProps: BannerProps;
}

export default function ArgSpecialPage({
  apiService,
  bannerProps,
}: ArgSpecialPageProps) {
  const { leagueId } = useParams<{ leagueId: string }>();

  const parsedLeagueId = Number(leagueId);
  const { t } = useTranslation();

  const {
    leagueInfo,
    leagueLinks,
    isArgSpecialAvailable,
    loadingArgSpecial,
    loadingLeagueInfo,
    argSpecial,
  } = useLeaguePage(apiService, parsedLeagueId, t);

  if (!leagueId || Number.isNaN(parsedLeagueId)) {
    return (
      <Seo
        {...leagueSeoData(
          parsedLeagueId,
          t("argspecial.title"),
          t,
          "league/special"
        )}
      >
        <div className="w-full justify-between px-2 sm:px-12 py-6 space-y-6">
          <div className="text-center text-brand-aqualight bg-brand-aqua/15 border border-brand-aqua/30 px-4 py-2 mb-2 text-lg leading-tight rounded-lg">
            <p className="mx-auto">{t("argspecial.head")}</p>
          </div>
          <SubHeader
            title={t("argspecial.title")}
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
      {...leagueSeoData(
        Number(leagueId),
        t("argspecial.title"),
        t,
        "league/special"
      )}
    >
      {leagueId && Number.isNaN(parsedLeagueId) === false && (
        <div className="w-full justify-between px-2 sm:px-12 py-6 space-y-6">
          <div className="text-center text-brand-aqualight bg-brand-aqua/15 border border-brand-aqua/30 px-4 py-2 mb-2 text-lg leading-tight rounded-lg">
            <p className="mx-auto">{t("argspecial.head")}</p>
          </div>
          <SubHeader
            title={t("argspecial.title")}
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
            {!leagueInfo && !isArgSpecialAvailable && <NoData />}

            {loadingLeagueInfo && loadingArgSpecial && (
              <NoData loading={true} skeleton={<TablePairSkeleton />} />
            )}

            {isArgSpecialAvailable && (
              <div className="w-full mx-auto mt-8 flex flex-col lg:flex-row gap-4">
                <div className="w-full lg:w-1/2 bg-brand-card ring-1 ring-gray-500 rounded-lg p-1">
                  <h4 className="py-2 px-4 mb-4 text-center font-semibold bg-black/40 text-brand-cream rounded-t-lg">
                    {t("argspecial.anual")}
                  </h4>
                  <ArgSpecialTable
                    teams={argSpecial?.annualTable ?? []}
                    mode="annual"
                  />
                </div>

                <div className="w-full lg:w-1/2 bg-brand-card ring-1 ring-gray-500 rounded-lg p-1">
                  <h4 className="py-2 px-4 mb-4 text-center font-semibold bg-black/40 text-brand-cream rounded-t-lg">
                    {t("argspecial.promedios")}
                  </h4>
                  <ArgSpecialTable
                    teams={argSpecial?.promediosTable ?? []}
                    mode="promedios"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </Seo>
  );
}
