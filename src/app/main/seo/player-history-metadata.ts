import { TFunction } from "i18next";

const playerSeoData = (
  playerId: number,
  playerName: string,
  t: TFunction<"translation", undefined>
) => {
  const pageUrl = `https://footballproject.org/player/${playerId}`;

  return {
    title: t("playerseo.title", { playerName }),
    description: t("playerseo.description", { playerName }),
    url: pageUrl,
    image: "https://footballproject.org/logo.png",

    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Person",
      name: playerName,
      description: t("playerseo.jsonld.description", { playerName }),
      url: pageUrl,

      affiliation: {
        "@type": "Organization",
        name: "Open Football Project",
        url: "https://footballproject.org",
      },

      knowsAbout: [
        t("playerseo.jsonld.knows.transfers"),
        t("playerseo.jsonld.knows.trophies"),
      ],
    },
  };
};

export default playerSeoData;
