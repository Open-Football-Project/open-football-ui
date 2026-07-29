import { TFunction } from "i18next";

const teamSeoData = (
  teamid: number,
  teamName: string,
  t: TFunction<"translation", undefined>
) => {
  const pageUrl = `https://futballero.com/team/${teamid}`;

  return {
    title: t("teamseo.title", { teamName }),
    description: t("teamseo.description", { teamName }),
    url: pageUrl,
    image: "https://futballero.com/logo.png",

    jsonLd: {
      "@context": "https://schema.org",
      "@type": "SportsTeam",
      name: t("teamseo.jsonld.name", { teamName }),
      description: t("teamseo.jsonld.description"),
      url: pageUrl,
      location: {
        "@type": "Place",
        name: t("teamseo.jsonld.location"),
      },
    },
  };
};

export default teamSeoData;
