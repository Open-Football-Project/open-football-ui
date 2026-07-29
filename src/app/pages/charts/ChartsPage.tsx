import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ApiService,
  ChartPanel,
  ChartPanelType,
  useChartsPageStatus,
  useCharteableOddsStatus,
  useBetMarkets,
} from "@matchinsights/core";

import { HiMenu } from "react-icons/hi";
import Panels from "../../components/live-charts/panels/Panels";
import { marketToPanel } from "../../components/live-charts/panels/odds/market-to-panel";
import OddsMarketMenu from "../../components/live-charts/panels/odds/OddsMarketMenu";
import NoData from "../../components/general/no-data/NoData";
import Controls from "../../components/general/controls/Controls";
import SubHeader from "../../components/general/sub-header/SubHeader";
import Seo from "../../main/seo/Seo";
import chartsSeoData from "../../main/seo/charts-metadata";
import chartsNotAvailableImg from "../../assets/images/chartsnotavailable.jpg";
import { BannerProps } from "../../common-props/BannerProps";
import { trackEvent, AnalyticsEvent } from "../../utils/analytics/analytics";
import {
  getLiveFixturesIdsSet,
  solveIndicatorMatchesDropList,
  solveOddsMatchesDropList,
} from "../../utils/charts-dropdown/charts-dropdown";

enum ChartsPageMode {
  Odds = "odds",
  Indicators = "indicators",
}

const DEFAULT_ODDS_MARKET_NAMES = ["fulltime_result", "both_teams_to_score", "draw_no_bet"];

interface ChartsPageProps {
  apiService: ApiService;
  bannerProps: BannerProps;
  apiHost: string;
  apiMock: number;
}

const ChartsPage = ({ apiService, bannerProps, apiHost, apiMock }: ChartsPageProps) => {
  const { t } = useTranslation();
  const { fixtureId } = useParams<{ fixtureId?: string }>();

  const noMatchesNoData = () => (
    <NoData
      message={t("charts.no_live_matches", {
        defaultValue: "No matches available right now",
      })}
      messageColor="text-white"
      image={chartsNotAvailableImg}
      imageAlt={t("charts.no_live_matches_image_alt", {
        defaultValue: "No charts available",
      })}
    />
  );

  const {
    chartMatches,
    effectiveFixtureId: chartsEffectiveFixtureId,
    setEffectiveFixtureId: setChartsEffectiveFixtureId,
    loadingChartMatches,
    isChartNotAvailable,
    homeTeamName: chartsHomeTeamName,
    awayTeamName: chartsAwayTeamName,
    momentumPoints,
    controlPoints,
    goalThreatPoints,
  } = useChartsPageStatus(apiHost, apiMock, fixtureId);

  const {
    oddsMatches,
    effectiveFixtureId: oddsEffectiveFixtureId,
    setEffectiveFixtureId: setOddsEffectiveFixtureId,
    isOddsNotAvailable,
    homeTeamName: oddsHomeTeamName,
    awayTeamName: oddsAwayTeamName,
    oddsEventReceivedAt,
  } = useCharteableOddsStatus(apiHost, apiMock, fixtureId);

  const { betMarketGroups } = useBetMarkets(
    apiService,
    oddsEffectiveFixtureId,
    oddsEventReceivedAt,
  );

  const [mode, setMode] = useState<ChartsPageMode>(ChartsPageMode.Odds);
  const hasResolvedModeRef = useRef(false);
  const [isMarketMenuOpen, setIsMarketMenuOpen] = useState(false);
  const [enabledMarketNames, setEnabledMarketNames] = useState<string[]>(DEFAULT_ODDS_MARKET_NAMES);

  useEffect(() => {
    setEnabledMarketNames(DEFAULT_ODDS_MARKET_NAMES);
  }, [oddsEffectiveFixtureId]);

  const toggleMarket = (name: string) => {
    setEnabledMarketNames((prev) => {
      const wasEnabled = prev.includes(name);
      trackEvent(AnalyticsEvent.FILTER_APPLIED, {
        filter: "odds_market",
        value: name,
        enabled: String(!wasEnabled),
      });
      return wasEnabled ? prev.filter((n) => n !== name) : [...prev, name];
    });
  };

  const openMarketMenu = () => {
    setIsMarketMenuOpen(true);
    trackEvent(AnalyticsEvent.MENU_TOGGLED, { menu: "odds_markets", state: "open" });
  };

  const closeMarketMenu = () => {
    setIsMarketMenuOpen(false);
    trackEvent(AnalyticsEvent.MENU_TOGGLED, { menu: "odds_markets", state: "closed" });
  };

  useEffect(() => {
    hasResolvedModeRef.current = false;
  }, [fixtureId]);

  useEffect(() => {
    if (hasResolvedModeRef.current) return;

    const routeId = fixtureId ? Number(fixtureId) : undefined;

    const oddsReady =
      routeId !== undefined
        ? oddsMatches.some((match) => match.fixtureId === routeId)
        : oddsMatches.length > 0;

    const indicatorsReady =
      routeId !== undefined
        ? chartMatches.some((match) => match.fixtureId === routeId)
        : chartMatches.length > 0;

    if (oddsReady) {
      setMode(ChartsPageMode.Odds);
      hasResolvedModeRef.current = true;
      return;
    }

    if (indicatorsReady) {
      setMode(ChartsPageMode.Indicators);
      hasResolvedModeRef.current = true;
    }
  }, [fixtureId, oddsMatches, chartMatches]);

  if (loadingChartMatches) {
    return (
      <Seo {...chartsSeoData(fixtureId, t)} robots="noindex, nofollow">
        <div className="w-full flex items-center justify-center min-h-[60vh] px-2 sm:px-12">
          <NoData loading />
        </div>
      </Seo>
    );
  }

  const noMatchesAnywhere = isOddsNotAvailable && isChartNotAvailable;

  if (noMatchesAnywhere) {
    return (
      <Seo {...chartsSeoData(fixtureId, t)} robots="noindex, nofollow">
        <div className="w-full flex items-center justify-center min-h-[60vh] px-2 sm:px-12">
          {noMatchesNoData()}
        </div>
      </Seo>
    );
  }

  const liveFixtureIds = getLiveFixturesIdsSet(chartMatches, new Date());
  const matchDroplistOptions =
    mode === ChartsPageMode.Odds
      ? solveOddsMatchesDropList(liveFixtureIds, oddsMatches)
      : solveIndicatorMatchesDropList(liveFixtureIds, chartMatches);

  const selectedDrop0 = String(mode === ChartsPageMode.Odds ? oddsEffectiveFixtureId : chartsEffectiveFixtureId);

  const setDrop0 = (id: string) => {
    if (mode === ChartsPageMode.Odds) {
      setOddsEffectiveFixtureId(Number(id));
    } else {
      setChartsEffectiveFixtureId(Number(id));
    }
    trackEvent(AnalyticsEvent.FILTER_APPLIED, { filter: "fixture", value: id });
  };

  const handleModeChange = (nextMode: ChartsPageMode) => {
    setMode(nextMode);
    trackEvent(AnalyticsEvent.TAB_SWITCHED, { tab: nextMode, context: "charts" });
  };

  const availableMarkets = betMarketGroups.flat();

  const renderContent = () => {
    if (mode === ChartsPageMode.Odds) {
      if (!oddsHomeTeamName || !oddsAwayTeamName) {
        return noMatchesNoData();
      }
      const oddsPanels = enabledMarketNames
        .map((name) => availableMarkets.find((market) => market.name === name))
        .filter((market): market is (typeof availableMarkets)[number] => market !== undefined)
        .map((market) => marketToPanel(market, oddsHomeTeamName, oddsAwayTeamName, t));

      return <Panels panels={oddsPanels} />;
    }

    if (!chartsHomeTeamName || !chartsAwayTeamName) {
      return noMatchesNoData();
    }

    const momentumPanel: ChartPanel = {
      type: ChartPanelType.Momentum,
      points: momentumPoints,
      homeTeamName: chartsHomeTeamName,
      awayTeamName: chartsAwayTeamName,
    };

    const controlPanel: ChartPanel = {
      type: ChartPanelType.Control,
      points: controlPoints,
      homeTeamName: chartsHomeTeamName,
      awayTeamName: chartsAwayTeamName,
    };

    const goalThreatPanel: ChartPanel = {
      type: ChartPanelType.GoalThreat,
      points: goalThreatPoints,
      homeTeamName: chartsHomeTeamName,
      awayTeamName: chartsAwayTeamName,
    };

    return <Panels panels={[momentumPanel, controlPanel, goalThreatPanel]} />;
  };

  return (
    <Seo {...chartsSeoData(fixtureId, t)}>
      <div className="w-full px-2 sm:px-12 py-6">
        <SubHeader
          title={t("charts.subheadertitle", { defaultValue: "Live Football Charts" })}
          apiService={apiService}
          bannersService={bannerProps.bannersService}
        />
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="inline-flex gap-1 p-1 bg-brand-card rounded-full">
            <button
              type="button"
              data-testid="mode-toggle-odds"
              aria-pressed={mode === ChartsPageMode.Odds}
              onClick={() => handleModeChange(ChartsPageMode.Odds)}
              className={`px-3 py-1.5 rounded-full text-sm font-semibold cursor-pointer transition-colors ${
                mode === ChartsPageMode.Odds
                  ? "bg-brand-orange text-white"
                  : "text-brand-white hover:bg-white/10"
              }`}
            >
              {t("charts.mode_odds", { defaultValue: "Odds" })}
            </button>
            <button
              type="button"
              data-testid="mode-toggle-indicators"
              aria-pressed={mode === ChartsPageMode.Indicators}
              onClick={() => handleModeChange(ChartsPageMode.Indicators)}
              className={`px-3 py-1.5 rounded-full text-sm font-semibold cursor-pointer transition-colors ${
                mode === ChartsPageMode.Indicators
                  ? "bg-brand-orange text-white"
                  : "text-brand-white hover:bg-white/10"
              }`}
            >
              {t("charts.mode_indicators", { defaultValue: "Indicators" })}
            </button>
          </div>
          {mode === ChartsPageMode.Odds && (
            <button
              type="button"
              data-testid="odds-market-menu-toggle"
              aria-label={t("aria.oddsMarketMenu.open", { defaultValue: "Choose odds markets" })}
              onClick={openMarketMenu}
              className="p-1.5 bg-brand-card hover:bg-white/10 rounded transition"
            >
              <HiMenu className="text-brand-white w-6 h-6" />
            </button>
          )}
        </div>
        <Controls
          useDrop0
          drop0Label={t("charts.pick_match", { defaultValue: "Select match" })}
          selectedDrop0={selectedDrop0}
          setDrop0={setDrop0}
          drop0Options={matchDroplistOptions}
        />
        {renderContent()}
        {mode === ChartsPageMode.Odds && isMarketMenuOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={closeMarketMenu}
            />
            <OddsMarketMenu
              markets={availableMarkets}
              enabledMarketNames={enabledMarketNames}
              onToggleMarket={toggleMarket}
              onClose={closeMarketMenu}
            />
          </>
        )}
      </div>
    </Seo>
  );
};

export default ChartsPage;
