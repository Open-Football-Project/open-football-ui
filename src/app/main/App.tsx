import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./navigation/Navbar";
import Footer from "./footer/Footer";

import { bannersServiceWrapper, webStorage } from "open-football-project-core";

import MatchDetail from "../pages/match-details/MatchDetail";
import About from "../pages/about/About";
import TeamDetailsPage from "../pages/team-details/TeamDetailsPage";
import LeaguePage from "../pages/league/LeaguePage";
import AllLeagues from "../pages/all-leagues/AllLeagues";
import LiveNow from "../pages/live/LiveNow";
import Matches from "../pages/matches/Matches";
import usePageTracking from "./PageTracker";
import Landing from "../pages/landing/Landing";
import GuessTeamPlayerPage from "../pages/guess-team-player/GuessTeamPlayerPage";
import GuessLeagueTeamPage from "../pages/guess-league-team/GuessLeagueTeamPage";
import LeagueKnockoutPage from "../pages/league-special/league-knockout/LeagueKnockoutPage";
import LeagueGroupsPage from "../pages/league-special/groups/LeagueGroupsPage";
import ArgSpecialPage from "../pages/league-special/argentina-tablas/ArgSpecialPage";
import PlayerHistoryPage from "../pages/player-history/PlayerHistoryPage";
import FeedbackPage from "../pages/feedback/FeedbackPage";
import NotFoundPage from "../pages/not-found/NotFoundPage";
import ChartsPage from "../pages/charts/ChartsPage";
import TodayPlayersPage from "../pages/today-players/TodayPlayersPage";

import { Toaster } from "sonner";
import ScrollToTopButton from "../utils/scroll-to-top/ScrollToTopButton";
import { useApiService } from "open-football-project-core";
import { BannerProps } from "../common-props/BannerProps";

const apiHost = import.meta.env.VITE_API_HOST;
const apiMock = import.meta.env.VITE_USE_API_MOCK;
const ipCheckHost = import.meta.env.VITE_IP_CHECK_HOST;

function App() {
  const apiService = useApiService(apiHost, apiMock > 0);
  const location = useLocation();
  usePageTracking();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  const bannerProps: BannerProps = {
    bannersService: bannersServiceWrapper,
    storage: webStorage,
    countryApiHost: ipCheckHost,
  };
  
  return (
    <div className="relative min-h-screen flex flex-col text-white">
      <ScrollToTopButton />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#1E1E1E",
            border: "1px solid rgba(255,255,255,0.1)",
          },
          classNames: {
            toast: "text-white font-sans",
            success: "!text-brand-success border-l-4 !border-l-brand-success",
            error: "!text-brand-danger border-l-4 !border-l-brand-danger",
            info: "!text-brand-orange border-l-4 !border-l-brand-orange",
          },
        }}
      />
      <div className="flex flex-col min-h-screen relative z-10">
        <Navbar />

        <main className="flex-grow">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Routes>
                <Route
                  path="/"
                  element={
                    <Landing
                      apiService={apiService}
                      bannerProps={bannerProps}
                    />
                  }
                />
                <Route
                  path="/live/:fixtureId?"
                  element={
                    <LiveNow
                      apiService={apiService}
                      bannerProps={bannerProps}
                    />
                  }
                />
                <Route
                  path="/matches"
                  element={
                    <Matches
                      apiService={apiService}
                      bannerProps={bannerProps}
                    />
                  }
                />
                <Route
                  path="/charts/:fixtureId?"
                  element={
                    <ChartsPage
                      apiService={apiService}
                      bannerProps={bannerProps}
                      apiHost={apiHost}
                      apiMock={apiMock}
                    />
                  }
                />
                <Route
                  path="/today-players/:fixtureId?"
                  element={
                    <TodayPlayersPage
                      apiService={apiService}
                      bannerProps={bannerProps}
                    />
                  }
                />
                <Route path="/about" element={<About />} />
                <Route
                  path="/feedback"
                  element={<FeedbackPage apiService={apiService} />}
                />
                <Route
                  path="/league/:leagueId"
                  element={
                    <LeaguePage
                      apiService={apiService}
                      bannerProps={bannerProps}
                    />
                  }
                />
                <Route
                  path="/match/:id"
                  element={
                    <MatchDetail
                      apiService={apiService}
                      bannerProps={bannerProps}
                    />
                  }
                />
                <Route
                  path="/team/:id"
                  element={
                    <TeamDetailsPage
                      apiService={apiService}
                      bannerProps={bannerProps}
                    />
                  }
                />
                <Route
                  path="/leaguesall"
                  element={
                    <AllLeagues
                      apiService={apiService}
                      bannerProps={bannerProps}
                    />
                  }
                />
                <Route
                  path="/guess/team/player/:id"
                  element={
                    <GuessTeamPlayerPage
                      apiService={apiService}
                      bannerProps={bannerProps}
                    />
                  }
                />
                <Route
                  path="/guess/league/team/:id"
                  element={
                    <GuessLeagueTeamPage
                      apiService={apiService}
                      bannerProps={bannerProps}
                    />
                  }
                />
                <Route
                  path="/knockout/league/:leagueId"
                  element={
                    <LeagueKnockoutPage
                      apiService={apiService}
                      bannerProps={bannerProps}
                    />
                  }
                />
                <Route
                  path="/groups/league/:leagueId"
                  element={
                    <LeagueGroupsPage
                      apiService={apiService}
                      bannerProps={bannerProps}
                    />
                  }
                />
                <Route
                  path="/league/special/:leagueId"
                  element={
                    <ArgSpecialPage
                      apiService={apiService}
                      bannerProps={bannerProps}
                    />
                  }
                />
                <Route
                  path="/player/:playerId"
                  element={
                    <PlayerHistoryPage
                      apiService={apiService}
                      bannerProps={bannerProps}
                    />
                  }
                />
                <Route path="/404.html" element={<NotFoundPage />} />
                <Route path="*" element={<NotFoundPage />} />
               
              </Routes>
            </motion.div>
          </AnimatePresence>
        </main>
        <Footer
          bannersService={bannersServiceWrapper}
          storage={webStorage}
          countryApiHost={ipCheckHost}
        />
      </div>
    </div>
  );
}

export default App;
