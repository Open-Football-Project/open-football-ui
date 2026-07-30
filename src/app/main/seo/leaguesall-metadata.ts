import { TFunction } from "i18next";

const leaguesAllSeoData = (t: TFunction<"translation", undefined>) => {
  const pageUrl = "https://footballproject.org/leaguesall";

  return {
    title: t("leaguesAllSeo.title"),
    description: t("leaguesAllSeo.description"),
    url: pageUrl,
    image: "https://footballproject.org/logo.png",

    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",

      name: t("leaguesAllSeo.jsonld.name"),
      description: t("leaguesAllSeo.jsonld.description"),
      url: pageUrl,

      publisher: {
        "@type": "Organization",
        name: t("leaguesAllSeo.jsonld.publisherName"),
        url: "https://footballproject.org",
      },
    },
  };
};

export default leaguesAllSeoData;
