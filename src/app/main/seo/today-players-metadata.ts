import { TFunction } from "i18next";

const todayPlayersSeoData = (
  urlPath: string | undefined,
  t: TFunction<"translation", undefined>
) => {
  const pageUrl = urlPath
    ? `https://footballproject.org/today-players/${urlPath}`
    : "https://footballproject.org/today-players";

  return {
    title: t("todayplayersseo.title"),
    description: t("todayplayersseo.description"),
    url: pageUrl,
    image: "https://footballproject.org/logo.png",

    jsonLd: {
      "@context": "https://schema.org",
      "@type": "SportsEvent",
      name: t("todayplayersseo.jsonld.name"),
      sport: "Football",
      url: pageUrl,
      location: {
        "@type": "Place",
        name: t("todayplayersseo.jsonld.location"),
      },
    },
  };
};

export default todayPlayersSeoData;
