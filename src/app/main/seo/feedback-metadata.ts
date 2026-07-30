import { TFunction } from "i18next";

const feedbackSeoData = (t: TFunction<"translation", undefined>) => {
  return {
    title: t("feedbackseo.title"),
    description: t("feedbackseo.description"),
    url: "https://footballproject.org/feedback",
    image: "https://footballproject.org/logo.png",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      name: t("feedbackseo.jsonld.name"),
      description: t("feedbackseo.jsonld.description"),
      url: "https://footballproject.org/feedback",
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

export default feedbackSeoData;
