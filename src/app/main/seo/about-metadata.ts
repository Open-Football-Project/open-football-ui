import { TFunction } from "i18next";

const aboutSeoData = (t: TFunction<"translation", undefined>) => {
  return {
    title: t("aboutseo.title"),
    description: t("aboutseo.description"),
    url: "https://futballero.com/about",
    image: "https://futballero.com/logo.png",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      name: t("aboutseo.jsonld.name"),
      description: t("aboutseo.jsonld.description"),
      url: "https://futballero.com/about",
      publisher: {
        "@type": "Organization",
        name: "Futballero",
        url: "https://futballero.com",
        logo: {
          "@type": "ImageObject",
          url: "https://futballero.com/logo.png",
        },
      },
    },
  };
};

export default aboutSeoData;
