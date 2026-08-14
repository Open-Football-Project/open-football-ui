import { TFunction } from "i18next";

const chartsSeoData = (
  urlPath: string | undefined,
  t: TFunction<"translation", undefined>
) => {
  const pageUrl = urlPath ? `https://footballproject.org/charts/${urlPath}` : "https://footballproject.org/charts";

  return {
    title: t("chartsseo.title"),
    description: t("chartsseo.description"),
    url: pageUrl,
    image: "https://footballproject.org/logo.png",

    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: t("chartsseo.jsonld.name"),
      description: t("chartsseo.description"),
      url: pageUrl,
      publisher: {
        "@type": "Organization",
        name: "Open Football Project",
        url: "https://footballproject.org",
      },
    },
  };
};

export default chartsSeoData;
