import { LeaguesMenu } from "../../components/league/leagues-menu/LeaguesMenu";
import leaguesAllSeoData from "../../main/seo/leaguesall-metadata";
import Seo from "../../main/seo/Seo";
import Breadcrumb from "../../main/seo/breadcrumb/Breadcrumb";
import {
  ApiService,
  LeaguesGroups,
  useAllLeagues,
} from "open-football-project-core";
import SubHeader from "../../components/general/sub-header/SubHeader";
import { useTranslation } from "react-i18next";
import { BannerProps } from "../../common-props/BannerProps";

interface LeaguesPageProps {
  apiService: ApiService;
  bannerProps: BannerProps;
}

const AllLeagues = ({ apiService, bannerProps }: LeaguesPageProps) => {
  const { leaguesGroups, isAnyLeagueAvailable, loadingLeagues } =
    useAllLeagues(apiService);

  const { t } = useTranslation();

  return (
    <Seo {...leaguesAllSeoData(t)}>
      <Breadcrumb items={[
        { name: "Home", url: "https://futballero.com/" },
        { name: "Leagues", url: "https://futballero.com/leaguesall" },
      ]} />
      <div className="w-full justify-between px-2 sm:px-12 py-6 space-y-6">
        <div className="text-center text-brand-aqualight bg-brand-aqua/15 border border-brand-aqua/30 px-4 py-2 mb-2 text-lg leading-tight rounded-lg">
          <p className="mx-auto">{t("leaguespage.head")}</p>
        </div>
        <SubHeader
          title={t("leaguespage.title")}
          apiService={apiService}
          bannersService={bannerProps.bannersService}
        />

        <LeaguesMenu
          leaguesGroups={leaguesGroups as LeaguesGroups}
          loading={loadingLeagues}
          isAnyLeagueAvailable={isAnyLeagueAvailable}
        />
      </div>
    </Seo>
  );
};

export default AllLeagues;
