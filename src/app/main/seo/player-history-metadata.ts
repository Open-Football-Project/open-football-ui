import { TFunction } from "i18next";

const playerSeoData = (
  playerId: number,
  playerName: string,
  t: TFunction<"translation", undefined>
) => {
  const pageUrl = `https://futballero.com/player/${playerId}`;

  return {
    title: t("playerseo.title", { playerName }),
    description: t("playerseo.description", { playerName }),
    url: pageUrl,
    image: "https://futballero.com/logo.png",

    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Person",
      name: playerName,
      description: t("playerseo.jsonld.description", { playerName }),
      url: pageUrl,

      affiliation: {
        "@type": "Organization",
        name: "Futballero",
        url: "https://futballero.com",
      },

      knowsAbout: [
        t("playerseo.jsonld.knows.transfers"),
        t("playerseo.jsonld.knows.trophies"),
      ],
    },
  };
};

export default playerSeoData;
