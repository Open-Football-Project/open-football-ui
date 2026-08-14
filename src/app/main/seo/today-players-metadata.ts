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
      "@type": "CollectionPage",
      name: t("todayplayersseo.jsonld.name"),
      description: t("todayplayersseo.description"),
      url: pageUrl,
      publisher: {
        "@type": "Organization",
        name: "Open Football Project",
        url: "https://footballproject.org",
      },
    },
  };
};

export default todayPlayersSeoData;
