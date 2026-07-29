import SubHeader from "../../components/general/sub-header/SubHeader";
import {
  ApiService,
  useMatchesStatus,
} from "@matchinsights/core";
import NoData from "../../components/general/no-data/NoData";
import { MatchListSkeleton } from "../../components/general/skeleton/Skeleton";
import Controls from "../../components/general/controls/Controls";
import MatchesGrid from "../../components/match/matches-grid/MatchesGrid";
import matchesSeoData from "../../main/seo/matches-metadata";
import Seo from "../../main/seo/Seo";
import Breadcrumb from "../../main/seo/breadcrumb/Breadcrumb";
import { useTranslation } from "react-i18next";
import { BannerProps } from "../../common-props/BannerProps";
import { trackEvent, AnalyticsEvent } from "../../utils/analytics/analytics";

interface MatchesProps {
  apiService: ApiService;
  bannerProps: BannerProps;
}

const Matches = ({ apiService, bannerProps }: MatchesProps) => {
  const { t } = useTranslation();
  const {
    loadingMatches,
    selectedCountry,
    setSelectedCountry,
    selectedDate,
    setSelectedDate,
    countries,
    leagueMatches,
    isLeagueMatchesAvailable,
    setSelectedTimeRange,
    timeRangeOptions,
    selectedTimeRangeIndex,
    setSelectedTimeRangeIndex,
  } = useMatchesStatus(apiService);

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    trackEvent(AnalyticsEvent.FILTER_APPLIED, { filter: "country", value: country });
  };

  const handleTimeRangeChange = (index: number) => {
    setSelectedTimeRange(timeRangeOptions[index]);
    setSelectedTimeRangeIndex(index);
    trackEvent(AnalyticsEvent.FILTER_APPLIED, { filter: "time_range", value: String(index) });
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    trackEvent(AnalyticsEvent.FILTER_APPLIED, { filter: "date", value: date });
  };

  return (
    <Seo {...matchesSeoData(selectedDate, selectedCountry ?? "Worldwide", t)}>
      <Breadcrumb items={[
        { name: "Home", url: "https://futballero.com/" },
        { name: "Matches", url: "https://futballero.com/matches" },
      ]} />
      <div className="w-full justify-between px-2 sm:px-12 py-6 space-y-6">
        <div className="text-center text-brand-aqualight bg-brand-aqua/15 border border-brand-aqua/30 px-4 py-2 mb-2 text-lg leading-tight rounded-lg">
          <p className="mx-auto">{t("matches.head")}</p>
        </div>
        <SubHeader
          title={t("common.matches")}
          apiService={apiService}
          bannersService={bannerProps.bannersService}
        />

        <Controls
          useDatePicker={true}
          datePickerLabel={t("common.matchdate")}
          selectedDate={selectedDate}
          setSelectedDate={handleDateChange}
          useDrop0
          drop0Label={t("common.countrycontrol")}
          drop0Options={countries.map((country) => ({
            id: country,
            value: t(`country.${country.toLowerCase()}`, {
              defaultValue: country,
            }),
          }))}
          selectedDrop0={selectedCountry ?? countries[0]}
          setDrop0={handleCountryChange}
          useTimeRange
          timeRangeLabel={t("common.timerangelabel")}
          selectedTimeRangeIndex={selectedTimeRangeIndex}
          setSelectedTimeRangeIndex={handleTimeRangeChange}
          timeRangeOptions={timeRangeOptions}
        />

        {loadingMatches && <NoData loading={true} skeleton={<MatchListSkeleton />} />}
        {!isLeagueMatchesAvailable && (
          <NoData
            message={t("matches.nodatamsg")}
            messageColor="text-white"
            isBigMessage={true}
          />
        )}
        {isLeagueMatchesAvailable && (
          <MatchesGrid leagueMatches={leagueMatches} apiService={apiService} />
        )}
      </div>
    </Seo>
  );
};

export default Matches;
