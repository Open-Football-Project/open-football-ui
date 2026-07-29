import { TFunction } from "i18next";
import { Venue } from "@matchinsights/core";

const venueLocationName = (
  venue: Venue | undefined,
  t: TFunction<"translation", undefined>
) => {
  const parts = [venue?.name, venue?.city].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : t("matchseo.jsonld.location");
};

const matchSeoData = (
  fixtureId: number,
  homeTeam: string,
  awayTeam: string,
  startDate: string,
  t: TFunction<"translation", undefined>,
  venue?: Venue
) => {
  const pageUrl = `https://futballero.com/match/${fixtureId}`;

  return {
    title: t("matchseo.title", { homeTeam, awayTeam }),
    description: t("matchseo.description", { homeTeam, awayTeam }),
    url: pageUrl,
    image: "https://futballero.com/logo.png",

    jsonLd: {
      "@context": "https://schema.org",
      "@type": "SportsEvent",
      name: t("matchseo.jsonld.name", { homeTeam, awayTeam }),
      sport: "Football",
      startDate,
      description: t("matchseo.jsonld.description"),
      url: pageUrl,
      homeTeam: {
        "@type": "SportsTeam",
        name: homeTeam,
      },
      awayTeam: {
        "@type": "SportsTeam",
        name: awayTeam,
      },
      location: {
        "@type": "Place",
        name: venueLocationName(venue, t),
      },
      organizer: {
        "@type": "Organization",
        name: "Futballero",
        url: "https://futballero.com",
      },
    },
  };
};

export default matchSeoData;
