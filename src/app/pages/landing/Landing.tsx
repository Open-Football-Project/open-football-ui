import Seo from "../../main/seo/Seo";

import landingSeoData from "../../main/seo/landing-metadata";
import { extractKeywords } from "../../utils/seo-keywords";

import { useTranslation } from "react-i18next";
import { useNewsInfo, useTodayMatches, ApiService } from "open-football-project-core";

import worldcupicon from "../../assets/images/wc.png";
import NewsSlider from "../../components/news/NewsSlider";
import MatchesGrid from "../../components/match/matches-grid/MatchesGrid";
import NoData from "../../components/general/no-data/NoData";
import { MatchListSkeleton } from "../../components/general/skeleton/Skeleton";

import { BannerProps } from "../../common-props/BannerProps";
import GlobalBanners from "../../components/general/banners/global-banners/GlobalBanners";
import CountryBanners from "../../components/general/banners/country-banners/CountryBanners";
import { leagueWeights } from "./landing-data";

interface LandingProps {
  apiService: ApiService;
  bannerProps: BannerProps;
}

const Landing = ({ bannerProps, apiService }: LandingProps) => {
  const { t, i18n } = useTranslation();

  const { isPlayerNewsAvailable, news } = useNewsInfo(
    apiService,
    i18n.language,
  );

  const { loadingMatches, leagueMatches, isLeagueMatchesAvailable } =
    useTodayMatches(apiService, leagueWeights);

  return (
    <Seo
      {...landingSeoData(t, news, leagueMatches)}
      keywords={extractKeywords(news, i18n.language)}
    >
      <main className="bg-brand-darkBg text-darkText">
        <section
          data-testid="hero-section"
          className="relative overflow-hidden py-12 sm:py-20 lg:py-15 px-4 "
        >
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 tracking-tight">
              {t("home.mainhead")}
            </h1>

            <p className="max-w-3xl mx-auto text-lg lg:text-xl text-brand-lightGray mb-10">
              {t("home.headtext")}
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <a
                data-testid="world-cup-link"
                href="/league/1"
                className="inline-flex items-center gap-3 bg-brand-yellow text-brand-gray px-6 py-3 rounded-2xl font-bold text-lg hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <img
                  src={worldcupicon}
                  alt=""
                  className="w-5 h-5 object-contain"
                />
                {t("home.worldcupcta")}
              </a>

              <a
                data-testid="play-store-link"
                href="https://play.google.com/store/apps/details?id=com.futballero"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full sm:inline-flex sm:w-auto items-center justify-center gap-2 bg-green-500 text-black px-6 py-3 rounded-2xl font-bold text-lg hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                📱 {t("home.androidbtn")}
              </a>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <a
                href="/live"
                className="w-full sm:w-auto text-center bg-red-800 text-white px-6 py-3 rounded-2xl font-semibold hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                🔴 {t("home.livebtn")}
              </a>

              <a
                href="/leaguesall"
                className="w-full sm:w-auto text-center bg-brand-royalblue text-white px-6 py-3 rounded-2xl font-semibold hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                ⚽ {t("home.leaguesbtn")}
              </a>

              <a
                data-testid="charts-link"
                href="/charts"
                className="w-full sm:w-auto text-center bg-brand-gray text-white px-6 py-3 rounded-2xl font-semibold hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                📈 {t("home.chartsbtn")}
              </a>
            </div>
          </div>
        </section>

        <CountryBanners bannerProps={bannerProps} />

        <section
          data-testid="today-matches"
          className="py-10 sm:py-16 lg:py-5 px-3 sm:px-6 bg-brand-darkBg"
        >
          <div className="mx-auto">
            <h2 className="text-3xl font-bold text-center text-brand-orangeo mb-12">
              {t("home.todaymatches")}
            </h2>

            {loadingMatches && (
              <NoData loading={true} skeleton={<MatchListSkeleton />} />
            )}
            {!loadingMatches && !isLeagueMatchesAvailable && (
              <NoData
                message={t("matches.nodatamsg")}
                messageColor="text-white"
                isBigMessage={true}
              />
            )}
            {isLeagueMatchesAvailable && (
              <MatchesGrid
                leagueMatches={leagueMatches}
                apiService={apiService}
              />
            )}
          </div>
        </section>

        <GlobalBanners bannersService={bannerProps.bannersService} />

        {isPlayerNewsAvailable && (
          <section
            data-testid="news-slider-section"
            className="py-8 sm:py-12 lg:py-16 px-3 sm:px-6"
          >
            <div className="max-w-7xl mx-auto">
              <NewsSlider items={news} />
            </div>
          </section>
        )}
        <section
          data-testid="cta-section"
          className="py-12 sm:py-20 lg:py-24 px-6 text-center bg-brand-darkBg"
        >
          <h2 className="text-3xl font-bold mb-6 text-brand-orangeo">
            {t("home.bottomhead")}
          </h2>
          <p className="max-w-2xl mx-auto text-brand-lightGray mb-10">
            {t("home.bottomtext")}
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/matches"
              className="basis-[240px] text-center bg-brand-orange text-black px-8 py-3 rounded-2xl font-semibold hover:opacity-80 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {t("home.matchesbtn")}
            </a>

            <a
              href="/about"
              className="basis-[240px] text-center bg-brand-orange text-black px-8 py-3 rounded-2xl font-semibold hover:opacity-80 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {t("home.aboutbtn")}
            </a>
          </div>
        </section>
      </main>
    </Seo>
  );
};

export default Landing;
