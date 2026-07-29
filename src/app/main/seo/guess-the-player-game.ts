import { TFunction } from "i18next";

const guessThePlayerGameSeoData = (
  teamId: number,
  teamName: string,
  t: TFunction<"translation", undefined>
) => {
  const pageUrl = `https://futballero.com/guess/team/player/${teamId}`;

  return {
    title: t("guessPlayerSeo.title", { teamName }),
    description: t("guessPlayerSeo.description", { teamName }),
    url: pageUrl,
    image: "https://futballero.com/logo.png",

    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: t("guessPlayerSeo.jsonld.name", { teamName }),
      description: t("guessPlayerSeo.jsonld.description", { teamName }),
      url: pageUrl,

      publisher: {
        "@type": "Organization",
        name: t("guessPlayerSeo.jsonld.publisherName"),
        url: "https://futballero.com",
      },

      mainEntity: {
        "@type": "Quiz",
        name: t("guessPlayerSeo.jsonld.quizName"),
        genre: t("guessPlayerSeo.jsonld.quizGenre"),
        applicationCategory: "WebApplication",
        operatingSystem: "All",
        url: pageUrl,
        image: "https://futballero.com/logo.png",
        author: {
          "@type": "Organization",
          name: t("guessPlayerSeo.jsonld.author"),
        },
      },
    },
  };
};

export default guessThePlayerGameSeoData;
