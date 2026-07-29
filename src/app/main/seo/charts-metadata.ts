import { TFunction } from "i18next";

const chartsSeoData = (
  urlPath: string | undefined,
  t: TFunction<"translation", undefined>
) => {
  const pageUrl = urlPath ? `https://futballero.com/charts/${urlPath}` : "https://futballero.com/charts";

  return {
    title: t("chartsseo.title"),
    description: t("chartsseo.description"),
    url: pageUrl,
    image: "https://futballero.com/logo.png",

    jsonLd: {
      "@context": "https://schema.org",
      "@type": "SportsEvent",
      name: t("chartsseo.jsonld.name"),
      sport: "Football",
      url: pageUrl,
      location: {
        "@type": "Place",
        name: t("chartsseo.jsonld.location"),
      },
    },
  };
};

export default chartsSeoData;
