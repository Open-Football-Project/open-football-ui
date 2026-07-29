import { TFunction } from "i18next";

const guessTheTeamGameSeoData = (
  leagueId: number,
  leagueName: string,
  t: TFunction<"translation", undefined>
) => {
  const pageUrl = `https://futballero.com/guess/league/team/${leagueId}`;

  return {
    title: t("guessTeamSeo.title", { leagueName }),
    description: t("guessTeamSeo.description", { leagueName }),
    url: pageUrl,
    image: "https://futballero.com/logo.png",

    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: t("guessTeamSeo.jsonld.name", { leagueName }),
      description: t("guessTeamSeo.jsonld.description", { leagueName }),
      url: pageUrl,

      publisher: {
        "@type": "Organization",
        name: t("guessTeamSeo.jsonld.publisherName"),
        url: "https://futballero.com",
      },

      mainEntity: {
        "@type": "Quiz",
        name: t("guessTeamSeo.jsonld.quizName"),
        genre: t("guessTeamSeo.jsonld.quizGenre"),
        applicationCategory: "WebApplication",
        operatingSystem: "All",
        url: pageUrl,
        image: "https://futballero.com/logo.png",

        author: {
          "@type": "Organization",
          name: t("guessTeamSeo.jsonld.author"),
        },
      },
    },
  };
};

export default guessTheTeamGameSeoData;
