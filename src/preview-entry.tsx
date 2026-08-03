import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import MatchCard from "./app/components/match/match-card/MatchCard";
import "./index.css";

const finished = {
  fixtureId: 1,
  homeTeamName: "Arsenal",
  awayTeamName: "Chelsea",
  homeTeamLogo: null,
  awayTeamLogo: null,
  homeTeamScore: 2,
  awayTeamScore: 1,
  isFinished: true,
  date: "2025-10-11T15:00:00Z",
  statusShort: "FT",
  isLiveNow: false,
};

const upcoming = {
  ...finished,
  fixtureId: 2,
  homeTeamName: "Manchester United Longname FC",
  awayTeamName: "Brighton",
  isFinished: false,
  statusShort: "NS",
};

const apiService = {} as any;

createRoot(document.getElementById("root")!).render(
  <MemoryRouter>
    <ul style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 480 }}>
      <MatchCard match={finished} apiService={apiService} />
      <MatchCard match={upcoming} apiService={apiService} />
    </ul>
  </MemoryRouter>,
);
