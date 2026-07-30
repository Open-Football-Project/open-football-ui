import { TFunction } from "i18next";

const leagueSeoData = (
  leagueId: number,
  leagueName: string,
  t: TFunction<"translation", undefined>,
  path?: string
) => {
  const pageUrl = path
    ? `https://footballproject.org/${path}/${leagueId}`
    : `https://footballproject.org/league/${leagueId}`;

  return {
    title: t("leagueSeo.title", { leagueName }),
    description: t("leagueSeo.description", { leagueName }),
    url: pageUrl,
    image: "https://footballproject.org/logo.png",

    jsonLd: {
      "@context": "https://schema.org",
      "@type": "SportsOrganization",

      name: t("leagueSeo.jsonld.name", { leagueName }),
      sport: "Football",
      description: t("leagueSeo.jsonld.description"),
      url: pageUrl,
    },
  };
};

export default leagueSeoData;
