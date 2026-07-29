import ball from "../../../assets/images/ball.png";

import intIcon from "../../../assets/images/int.png";
import argIcon from "../../../assets/images/arg.png";
import ingIcon from "../../../assets/images/ing.png";
import espIcon from "../../../assets/images/esp.png";
import itaIcon from "../../../assets/images/ita.png";
import deuIcon from "../../../assets/images/deu.png";
import fraIcon from "../../../assets/images/fra.png";
import porIcon from "../../../assets/images/por.png";
import braIcon from "../../../assets/images/bra.png";
import uruIcon from "../../../assets/images/uru.png";
import parIcon from "../../../assets/images/par.png";
import colIcon from "../../../assets/images/col.png";
import chiIcon from "../../../assets/images/chi.png";
import mexIcon from "../../../assets/images/mex.png";
import usaIcon from "../../../assets/images/usa.png";

interface NavDetails {
  title: string;
  route: string;
  isTranslated?: boolean;
}

interface NavData {
  name: string;
  icon: string;
  navLinks: NavDetails[];
}

export const navigationData: NavData[] = [
  {
    icon: ball,
    name: "navigationTitles.mainmenu",
    navLinks: [
      { title: "navbar.home", route: "/", isTranslated: true },
      { title: "navbar.live", route: "/live", isTranslated: true },
      { title: "navbar.charts", route: "/charts", isTranslated: true },
      { title: "navbar.today_players", route: "/today-players", isTranslated: true },
      { title: "navbar.matches", route: "/matches", isTranslated: true },
      { title: "navbar.leagues", route: "/leaguesall", isTranslated: true },
      { title: "navbar.about", route: "/about", isTranslated: true },
      { title: "navbar.feedback", route: "/feedback", isTranslated: true },
    ],
  },

  {
    icon: intIcon,
    name: "navigationTitles.international",
    navLinks: [
      { title: "UEFA Champions League", route: "/league/2" },
      { title: "UEFA Europa League", route: "/league/3" },
      { title: "CONMEBOL Libertadores", route: "/league/13" },
      { title: "CONMEBOL Sudamericana", route: "/league/11" },
      { title: "FIFA Club World Cup", route: "/league/15" },
      { title: "World Cup", route: "/league/1" },
      { title: "World Cup - Qualification Europe", route: "/league/32" },
      { title: "World Cup - Qualification South America", route: "/league/34" },
      { title: "World Cup - Qualification Asia", route: "/league/30" },
      { title: "World Cup - Qualification Africa", route: "/league/29" },
      { title: "World Cup - Qualification CONCACAF", route: "/league/31" },
    ],
  },
  {
    icon: espIcon,
    name: "country.spain",
    navLinks: [
      { title: "La Liga", route: "/league/140" },
      { title: "Segunda División", route: "/league/141" },
    ],
  },
  {
    icon: itaIcon,
    name: "country.italy",
    navLinks: [
      { title: "Serie A", route: "/league/135" },
      { title: "Serie B", route: "/league/136" },
    ],
  },

  {
    icon: argIcon,
    name: "country.argentina",
    navLinks: [
      { title: "Liga Profesional Argentina", route: "/league/128" },
      { title: "Primera Nacional", route: "/league/129" },
      { title: "Copa Argentina", route: "/league/130" },
      { title: "Primera B Metropolitana", route: "/league/131" },
      { title: "Primera C", route: "/league/132" },
      { title: "Torneo Federal A", route: "/league/134" },
      { title: "Reserve League", route: "/league/906" },
    ],
  },

  {
    icon: ingIcon,
    name: "country.england",
    navLinks: [
      { title: "Premier League", route: "/league/39" },
      { title: "Championship", route: "/league/40" },
      { title: "National League", route: "/league/43" },
      { title: "League One", route: "/league/41" },
      { title: "League Two", route: "/league/42" },
      { title: "FA Cup", route: "/league/45" },
    ],
  },
  {
    icon: deuIcon,
    name: "country.germany",
    navLinks: [
      { title: "Bundesliga", route: "/league/78" },
      { title: "2. Bundesliga", route: "/league/79" },
      { title: "3. Liga", route: "/league/80" },
    ],
  },
  {
    icon: fraIcon,
    name: "country.france",
    navLinks: [
      { title: "Ligue 1", route: "/league/61" },
      { title: "Ligue 2", route: "/league/62" },
    ],
  },
  {
    icon: porIcon,
    name: "country.portugal",
    navLinks: [
      { title: "Primeira Liga", route: "/league/94" },
      { title: "Segunda Liga", route: "/league/95" },
    ],
  },
  {
    icon: braIcon,
    name: "country.brazil",
    navLinks: [
      { title: "Serie A", route: "/league/71" },
      { title: "Serie B", route: "/league/72" },
      { title: "Serie C", route: "/league/75" },
      { title: "Serie D", route: "/league/76" },
    ],
  },
  {
    icon: usaIcon,
    name: "country.usa",
    navLinks: [
      { title: "Major League Soccer", route: "/league/253" },

      { title: "USL Championship", route: "/league/255" },
    ],
  },
  {
    icon: mexIcon,
    name: "country.mexico",
    navLinks: [{ title: "Liga MX", route: "/league/262" }],
  },
  {
    icon: uruIcon,
    name: "country.uruguay",
    navLinks: [
      { title: "Primera División - Apertura", route: "/league/268" },
      { title: "Primera División - Clausura", route: "/league/270" },
      { title: "Segunda División", route: "/league/269" },
    ],
  },
  {
    icon: parIcon,
    name: "country.paraguay",
    navLinks: [
      { title: "Division Profesional - Apertura", route: "/league/250" },
      { title: "Division Profesional - Clausura", route: "/league/252" },
      { title: "Division Intermedia", route: "/league/251" },
    ],
  },

  {
    icon: colIcon,
    name: "country.colombia",
    navLinks: [
      { title: "Primera A", route: "/league/239" },
      { title: "Primera B", route: "/league/240" },
    ],
  },
  {
    icon: chiIcon,
    name: "country.chile",
    navLinks: [
      { title: "Primera División", route: "/league/265" },
      { title: "Primera B", route: "/league/266" },
      { title: "Segunda División", route: "/league/711" },
    ],
  },
];
