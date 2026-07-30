import { TFunction } from "i18next";

const guessTheTeamGameSeoData = (
  leagueId: number,
  leagueName: string,
  t: TFunction<"translation", undefined>
) => {
  const pageUrl = `https://footballproject.org/guess/league/team/${leagueId}`;

  return {
    title: t("guessTeamSeo.title", { leagueName }),
    description: t("guessTeamSeo.description", { leagueName }),
    url: pageUrl,
    image: "https://footballproject.org/logo.png",

    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: t("guessTeamSeo.jsonld.name", { leagueName }),
      description: t("guessTeamSeo.jsonld.description", { leagueName }),
      url: pageUrl,

      publisher: {
        "@type": "Organization",
        name: t("guessTeamSeo.jsonld.publisherName"),
        url: "https://footballproject.org",
      },

      mainEntity: {
        "@type": "Quiz",
        name: t("guessTeamSeo.jsonld.quizName"),
        genre: t("guessTeamSeo.jsonld.quizGenre"),
        applicationCategory: "WebApplication",
        operatingSystem: "All",
        url: pageUrl,
        image: "https://footballproject.org/logo.png",

        author: {
          "@type": "Organization",
          name: t("guessTeamSeo.jsonld.author"),
        },
      },
    },
  };
};

export default guessTheTeamGameSeoData;
