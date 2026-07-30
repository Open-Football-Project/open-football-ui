import { TFunction } from "i18next";
import { translateCountry } from "open-football-project-core";

const matchesSeoData = (
  selectedDate: string,
  rawCountry: string,
  t: TFunction<"translation", undefined>
) => {
  const pageUrl = "https://footballproject.org/matches";
  const country = translateCountry(rawCountry, t);

  return {
    title: t("matchesseo.title", { selectedDate, country }),
    description: t("matchesseo.description"),
    url: pageUrl,
    image: "https://footballproject.org/logo.png",

    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: t("matchesseo.jsonld.name", { selectedDate, country }),
      description: t("matchesseo.jsonld.description"),
      url: pageUrl,
      publisher: {
        "@type": "Organization",
        name: "Open Football Project",
        url: "https://footballproject.org",
      },
    },
  };
};

export default matchesSeoData;
