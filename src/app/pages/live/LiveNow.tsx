import Logo from "../../components/general/logo/Logo";
import { useTranslation } from "react-i18next";
import SubHeader from "../../components/general/sub-header/SubHeader";
import NoData from "../../components/general/no-data/NoData";
import { LiveMatches } from "../../components/live-matches/LiveMatches";
import Controls from "../../components/general/controls/Controls";
import Seo from "../../main/seo/Seo";
import liveNowSeoData from "../../main/seo/livenow-metadata";
import liveNowLoadingImg from "../../assets/gifs/g3.gif";
import { useParams } from "react-router-dom";

import {
  ApiService,
  cleanLeagueName,
  leagueTranslationKey,
  useLiveNowStatus,
} from "open-football-project-core";
import { BannerProps } from "../../common-props/BannerProps";

const apiHost = import.meta.env.VITE_API_HOST;
const apiMock = import.meta.env.VITE_USE_API_MOCK;

interface LiveMatchesProps {
  apiService: ApiService;
  bannerProps: BannerProps;
}

const LiveNow = ({ apiService, bannerProps }: LiveMatchesProps) => {
  const { fixtureId } = useParams<{ fixtureId?: string }>();
  const { t } = useTranslation();

  const {
    selectedCountry,
    setSelectedCountry,
    selectedLeagueId,
    setSelectedLeagueId,
    countries,
    leagues,
    selectedLeague,
    selectedLeagueMatches,
  } = useLiveNowStatus(apiHost, apiMock, fixtureId);

  if (leagues.length === 0)
    return (
      <Seo {...liveNowSeoData(fixtureId, t)} robots="noindex, nofollow">
        <div className="w-full justify-between px-2 sm:px-12 py-6">
          <div className="text-center text-brand-aqualight bg-brand-aqua/15 border border-brand-aqua/30 px-4 py-2 mb-2 text-lg leading-tight rounded-lg">
            <p className="mx-auto"> {t("livepage.h1")}</p>
          </div>
          <SubHeader
            title={t("livepage.subheadertitle")}
            apiService={apiService}
            bannersService={bannerProps.bannersService}
          />
          <NoData
            loading
            image={liveNowLoadingImg}
            imageAlt={t("livepage.loading_image_alt", {
              defaultValue: "Waiting for live matches",
            })}
          />
        </div>
      </Seo>
    );

  return (
    <Seo {...liveNowSeoData(fixtureId, t)}>
      <div className="w-full justify-between px-2 sm:px-12 py-6">
        <div className="text-center text-brand-aqualight bg-brand-aqua/15 border border-brand-aqua/30 px-4 py-2 mb-2 text-lg leading-tight rounded-lg">
          <p className="mx-auto"> {t("livepage.h1")}</p>
        </div>
        <SubHeader
          title={t("livepage.subheadertitle")}
          apiService={apiService}
          bannersService={bannerProps.bannersService}
        />
        <Controls
          useDrop0={true}
          drop0Label={t("livepage.countrycontrol")}
          isDrop0LabelRow={false}
          drop0Options={countries.map((country) => ({
            id: country,
            value: t(`country.${country.toLowerCase()}`, {
              defaultValue: country,
            }),
          }))}
          selectedDrop0={selectedCountry ?? countries[0]}
          setDrop0={setSelectedCountry}
          useDrop1={true}
          drop1Label={t("livepage.leaguecontrol")}
          isDrop1LabelRow={false}
          drop1Options={leagues.map((league) => ({
            id: league.leagueId.toString(),
            value: cleanLeagueName(
              t(`league.${leagueTranslationKey(league.leagueName)}`, {
                defaultValue: league.leagueName,
              })
            ),
          }))}
          selectedDrop1={selectedLeagueId?.toString() ?? ""}
          setDrop1={(leagueId) => setSelectedLeagueId(Number(leagueId))}
        />

        {selectedLeague && (
          <div className="flex items-center gap-3 mt-6 bg-brand-card p-3 rounded-lg ring-1 ring-brand-dona shadow-md">
            <Logo src={selectedLeague.leagueLogo} customImageClass="w-8 h-8" name={selectedLeague.leagueName} />
            <div>
              <p className="font-semibold text-sm text-brand-yellow uppercase">
                {cleanLeagueName(
                  t(
                    `league.${leagueTranslationKey(selectedLeague.leagueName)}`,
                    {
                      defaultValue: selectedLeague.leagueName,
                    }
                  )
                )}
              </p>
              <p className="text-xs text-gray-400">
                {t(`country.${selectedLeague.leagueCountry?.toLowerCase()}`, {
                  defaultValue: selectedLeague.leagueCountry,
                })}
              </p>
            </div>
          </div>
        )}

        <div className="mt-6">
          {selectedLeague ? (
            <LiveMatches
              apiService={apiService}
              matches={selectedLeagueMatches}
              fixtureId={Number(fixtureId)}
            />
          ) : (
            <div className="text-gray-400 mt-4 px-2 sm:px-0">
              Select a league to view matches
            </div>
          )}
        </div>
      </div>
    </Seo>
  );
};

export default LiveNow;
