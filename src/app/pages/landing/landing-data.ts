import intIcon from "../../assets/images/int.png";
import argIcon from "../../assets/images/arg.png";
import ingIcon from "../../assets/images/ing.png";
import espIcon from "../../assets/images/esp.png";
import itaIcon from "../../assets/images/ita.png";
import deuIcon from "../../assets/images/deu.png";
import fraIcon from "../../assets/images/fra.png";
import porIcon from "../../assets/images/por.png";
import braIcon from "../../assets/images/bra.png";
import mexIcon from "../../assets/images/mex.png";
import usaIcon from "../../assets/images/usa.png";

interface AllowedLeague {
  leagueId: number;
  name: string;
  weight: number;
}

export const allowedLeagues: AllowedLeague[] = [
  // Tier 1 — weight 100
  { leagueId: 39, name: "Premier League", weight: 100 },
  { leagueId: 128, name: "Liga Profesional Argentina", weight: 100 },

  // Tier 1b — weight 95
  { leagueId: 130, name: "Copa Argentina", weight: 95 },
  { leagueId: 45, name: "FA Cup", weight: 95 },

  // Tier 2 — International — weight 90
  { leagueId: 2, name: "UEFA Champions League", weight: 90 },
  { leagueId: 13, name: "CONMEBOL Libertadores", weight: 90 },
  { leagueId: 1, name: "World Cup", weight: 90 },

  // Tier 2b — International — weight 85
  { leagueId: 3, name: "UEFA Europa League", weight: 85 },
  { leagueId: 11, name: "CONMEBOL Sudamericana", weight: 85 },
  { leagueId: 15, name: "FIFA Club World Cup", weight: 85 },

  // Tier 3 — WC Qualifiers — weight 80
  { leagueId: 32, name: "World Cup - Qualification Europe", weight: 80 },
  { leagueId: 34, name: "World Cup - Qualification South America", weight: 80 },
  { leagueId: 30, name: "World Cup - Qualification Asia", weight: 80 },
  { leagueId: 29, name: "World Cup - Qualification Africa", weight: 80 },
  { leagueId: 31, name: "World Cup - Qualification CONCACAF", weight: 80 },

  // Tier 4 — First divisions — weight 70
  { leagueId: 140, name: "La Liga", weight: 70 },
  { leagueId: 135, name: "Serie A", weight: 70 },
  { leagueId: 78, name: "Bundesliga", weight: 70 },
  { leagueId: 61, name: "Ligue 1", weight: 70 },
  { leagueId: 94, name: "Primeira Liga", weight: 70 },
  { leagueId: 71, name: "Serie A Brazil", weight: 70 },
  { leagueId: 253, name: "Major League Soccer", weight: 70 },

  // Tier 5 — First divisions (other) — weight 60
  { leagueId: 239, name: "Primera A Colombia", weight: 60 },
  { leagueId: 265, name: "Primera División Chile", weight: 60 },
  { leagueId: 268, name: "Primera División Uruguay - Apertura", weight: 60 },
  { leagueId: 270, name: "Primera División Uruguay - Clausura", weight: 60 },
  { leagueId: 250, name: "Division Profesional Paraguay - Apertura", weight: 60 },
  { leagueId: 252, name: "Division Profesional Paraguay - Clausura", weight: 60 },
  { leagueId: 262, name: "Liga MX", weight: 60 },

  // Tier 6 — Second divisions — weight 40
  { leagueId: 40, name: "Championship", weight: 40 },
  { leagueId: 141, name: "Segunda División Spain", weight: 40 },
  { leagueId: 136, name: "Serie B Italy", weight: 40 },
  { leagueId: 79, name: "2. Bundesliga", weight: 40 },
  { leagueId: 62, name: "Ligue 2", weight: 40 },
  { leagueId: 95, name: "Segunda Liga Portugal", weight: 40 },
  { leagueId: 129, name: "Primera Nacional Argentina", weight: 40 },
  { leagueId: 72, name: "Serie B Brazil", weight: 40 },
  { leagueId: 255, name: "USL Championship", weight: 40 },
  { leagueId: 240, name: "Primera B Colombia", weight: 40 },
  { leagueId: 266, name: "Primera B Chile", weight: 40 },
  { leagueId: 269, name: "Segunda División Uruguay", weight: 40 },
  { leagueId: 251, name: "Division Intermedia Paraguay", weight: 40 },

  // Tier 7 — Third divisions and lower — weight 20
  { leagueId: 41, name: "League One", weight: 20 },
  { leagueId: 42, name: "League Two", weight: 20 },
  { leagueId: 43, name: "National League", weight: 20 },
  { leagueId: 80, name: "3. Liga", weight: 20 },
  { leagueId: 131, name: "Primera B Metropolitana", weight: 20 },
  { leagueId: 132, name: "Primera C Argentina", weight: 20 },
  { leagueId: 134, name: "Torneo Federal A", weight: 20 },
  { leagueId: 906, name: "Reserve League Argentina", weight: 20 },
  { leagueId: 75, name: "Serie C Brazil", weight: 20 },
  { leagueId: 76, name: "Serie D Brazil", weight: 20 },
  { leagueId: 711, name: "Segunda División Chile", weight: 20 },
];

export const leagueWeights = new Map<number, number>(
  allowedLeagues.map((l) => [l.leagueId, l.weight]),
);


const leagueSections = [
  {
    icon: ingIcon,
    country: "country.england",
    leagues: [
      { name: "Premier League", route: "/league/39" },
      { name: "Championship", route: "/league/40" },
      { name: "League One", route: "/league/41" },
      { name: "League Two", route: "/league/42" },
      { name: "FA Cup", route: "/league/45" },
    ],
  },
  {
    icon: espIcon,
    country: "country.spain",
    leagues: [
      { name: "La Liga", route: "/league/140" },
      { name: "Segunda División", route: "/league/141" },
    ],
  },
  {
    icon: itaIcon,
    country: "country.italy",
    leagues: [
      { name: "Serie A", route: "/league/135" },
      { name: "Serie B", route: "/league/136" },
    ],
  },
  {
    icon: deuIcon,
    country: "country.germany",
    leagues: [
      { name: "Bundesliga", route: "/league/78" },
      { name: "2. Bundesliga", route: "/league/79" },
      { name: "3. Liga", route: "/league/80" },
    ],
  },
  {
    icon: fraIcon,
    country: "country.france",
    leagues: [
      { name: "Ligue 1", route: "/league/61" },
      { name: "Ligue 2", route: "/league/62" },
    ],
  },
  {
    icon: porIcon,
    country: "country.portugal",
    leagues: [
      { name: "Primeira Liga", route: "/league/94" },
      { name: "Segunda Liga", route: "/league/95" },
    ],
  },
  {
    icon: argIcon,
    country: "country.argentina",
    leagues: [
      { name: "Liga Profesional Argentina", route: "/league/128" },
      { name: "Copa Argentina", route: "/league/130" },
      { name: "Primera Nacional", route: "/league/129" },
    ],
  },
  {
    icon: braIcon,
    country: "country.brazil",
    leagues: [
      { name: "Serie A", route: "/league/71" },
      { name: "Serie B", route: "/league/72" },
      { name: "Serie C", route: "/league/75" },
    ],
  },
  {
    icon: usaIcon,
    country: "country.usa",
    leagues: [
      { name: "Major League Soccer", route: "/league/253" },
      { name: "USL Championship", route: "/league/255" },
    ],
  },
  {
    icon: mexIcon,
    country: "country.mexico",
    leagues: [{ name: "Liga MX", route: "/league/262" }],
  },
  {
    icon: intIcon,
    country: "country.international",
    leagues: [
      { name: "UEFA Champions League", route: "/league/2" },
      { name: "UEFA Europa League", route: "/league/3" },
      { name: "Copa Libertadores", route: "/league/13" },
      { name: "World Cup", route: "/league/1" },
    ],
  },
];

export default leagueSections;
