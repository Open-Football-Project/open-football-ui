import { TFunction } from "i18next";

const feedbackSeoData = (t: TFunction<"translation", undefined>) => {
  return {
    title: t("feedbackseo.title"),
    description: t("feedbackseo.description"),
    url: "https://futballero.com/feedback",
    image: "https://futballero.com/logo.png",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      name: t("feedbackseo.jsonld.name"),
      description: t("feedbackseo.jsonld.description"),
      url: "https://futballero.com/feedback",
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

export default feedbackSeoData;
