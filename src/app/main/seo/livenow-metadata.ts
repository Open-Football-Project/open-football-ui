import { TFunction } from "i18next";

const liveNowSeoData = (
  urlPath: string | undefined,
  t: TFunction<"translation", undefined>
) => {
  const pageUrl = urlPath ? `https://footballproject.org/live/${urlPath}` : "https://footballproject.org/live";

  return {
    title: t("livenowseo.title"),
    description: t("livenowseo.description"),
    url: pageUrl,
    image: "https://footballproject.org/logo.png",

    jsonLd: {
      "@context": "https://schema.org",
      "@type": "SportsEvent",
      name: t("livenowseo.jsonld.name"),
      sport: "Football",
      url: pageUrl,
      location: {
        "@type": "Place",
        name: t("livenowseo.jsonld.location"),
      },
    },
  };
};

export default liveNowSeoData;
