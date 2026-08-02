import { TFunction } from "i18next";

const supportUsSeoData = (t: TFunction<"translation", undefined>) => {
  return {
    title: t("supportusseo.title"),
    description: t("supportusseo.description"),
    url: "https://footballproject.org/support-us",
    image: "https://footballproject.org/logo.png",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: t("supportusseo.jsonld.name"),
      description: t("supportusseo.jsonld.description"),
      url: "https://footballproject.org/support-us",
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

export default supportUsSeoData;
