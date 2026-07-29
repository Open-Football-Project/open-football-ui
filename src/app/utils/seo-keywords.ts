import { NewsCardItem } from "@matchinsights/core";

const STOP_WORDS_EN = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'must', 'shall', 'can', 'as', 'if', 'when',
  'than', 'because', 'while', 'although', 'where', 'after', 'so', 'though',
  'since', 'until', 'whether', 'before', 'how', 'once', 'this', 'that',
  'these', 'those', 'it', 'its', 'he', 'she', 'they', 'we', 'his', 'her',
  'their', 'our', 'not', 'no', 'from', 'into', 'about', 'up', 'out',
  'what', 'who', 'all', 'just', 'also', 'more', 'over', 'new',
]);

const STOP_WORDS_ES = new Set([
  'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'y', 'o', 'pero',
  'en', 'de', 'del', 'al', 'a', 'por', 'para', 'con', 'sin', 'sobre',
  'entre', 'ante', 'bajo', 'desde', 'hasta', 'hacia', 'según', 'durante',
  'es', 'son', 'fue', 'era', 'ser', 'estar', 'está', 'han', 'ha', 'había',
  'que', 'se', 'su', 'sus', 'le', 'les', 'me', 'te', 'nos', 'lo',
  'como', 'más', 'ya', 'también', 'este', 'esta', 'estos', 'estas',
  'ese', 'esa', 'eso', 'si', 'no', 'ni', 'cuando', 'donde', 'quien',
  'cual', 'cuál', 'cómo', 'qué', 'muy', 'bien', 'tras', 'ante',
]);

const STOP_WORDS_BY_LANG: Record<string, Set<string>> = {
  en: STOP_WORDS_EN,
  es: STOP_WORDS_ES,
};

export const extractKeywords = (
  news: NewsCardItem[],
  lang: string,
  limit = 10
): string[] => {
  const stopWords = STOP_WORDS_BY_LANG[lang] ?? STOP_WORDS_EN;
  const text = news.map(n => `${n.title} ${n.description}`).join(' ');

  const freq: Record<string, number> = {};
  text
    .toLowerCase()
    .replace(/[^a-záéíóúñü\s]/gi, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.has(word))
    .forEach(word => { freq[word] = (freq[word] ?? 0) + 1; });

  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word]) => word);
};
