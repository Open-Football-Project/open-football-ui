import { TFunction } from "i18next";
import { NewsCardItem, DayMatches } from "open-football-project-core";

const PUBLISHER = {
  "@type": "Organization",
  name: "Futballero",
  url: "https://futballero.com/",
  logo: { "@type": "ImageObject", url: "https://futballero.com/logo.png" },
};

const buildNewsJsonLd = (news: NewsCardItem[]) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Football News",
  itemListElement: news.slice(0, 5).map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "NewsArticle",
      headline: item.title,
      description: item.description,
      image: item.image,
      url: item.url,
      publisher: PUBLISHER,
    },
  })),
});

const buildMatchesJsonLd = (matches: DayMatches[]) => {
  let position = 0;
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Today's Matches",
    itemListElement: matches.flatMap((league) =>
      league.matches.map((match) => ({
        "@type": "ListItem",
        position: ++position,
        item: {
          "@type": "SportsEvent",
          name: `${match.homeTeamName} vs ${match.awayTeamName}`,
          startDate: match.date,
          homeTeam: { "@type": "SportsTeam", name: match.homeTeamName },
          awayTeam: { "@type": "SportsTeam", name: match.awayTeamName },
          location: { "@type": "Place", name: league.leagueName },
        },
      })),
    ),
  };
};

const landingSeoData = (
  t: TFunction<"translation", undefined>,
  news: NewsCardItem[] = [],
  matches: DayMatches[] = [],
) => {
  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: t("landingSeo.jsonld.name"),
    description: t("landingSeo.jsonld.description"),
    url: "https://futballero.com/",
    publisher: PUBLISHER,
  };

  const jsonLdParts: object[] = [webPageJsonLd];
  if (news.length > 0) jsonLdParts.push(buildNewsJsonLd(news));
  if (matches.length > 0) jsonLdParts.push(buildMatchesJsonLd(matches));

  return {
    title: t("landingSeo.title"),
    description: t("landingSeo.description"),
    url: "https://futballero.com/",
    image: "https://futballero.com/logo.png",
    jsonLd: jsonLdParts.length === 1 ? webPageJsonLd : jsonLdParts,
  };
};

export default landingSeoData;
