import { TFunction } from "i18next";

const aboutSeoData = (t: TFunction<"translation", undefined>) => {
  return {
    title: t("aboutseo.title"),
    description: t("aboutseo.description"),
    url: "https://footballproject.org/about",
    image: "https://footballproject.org/logo.png",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      name: t("aboutseo.jsonld.name"),
      description: t("aboutseo.jsonld.description"),
      url: "https://footballproject.org/about",
      publisher: {
        "@type": "Organization",
        name: "Open Football Project",
        url: "https://footballproject.org",
        logo: {
          "@type": "ImageObject",
          url: "https://footballproject.org/logo.png",
        },
      },
    },
  };
};

export default aboutSeoData;
