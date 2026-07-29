import { TFunction } from "i18next";
import { translateCountry } from "@matchinsights/core";

const matchesSeoData = (
  selectedDate: string,
  rawCountry: string,
  t: TFunction<"translation", undefined>
) => {
  const pageUrl = "https://futballero.com/matches";
  const country = translateCountry(rawCountry, t);

  return {
    title: t("matchesseo.title", { selectedDate, country }),
    description: t("matchesseo.description"),
    url: pageUrl,
    image: "https://futballero.com/logo.png",

    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: t("matchesseo.jsonld.name", { selectedDate, country }),
      description: t("matchesseo.jsonld.description"),
      url: pageUrl,
      publisher: {
        "@type": "Organization",
        name: "Futballero",
        url: "https://futballero.com",
      },
    },
  };
};

export default matchesSeoData;
