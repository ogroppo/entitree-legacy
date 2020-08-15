import getData from "../axios/getData";

export default function getWikipediaArticle(wikipediaSlug, currentLangCode) {
  return getData(
    `https://${currentLangCode}.wikipedia.org/api/rest_v1/page/summary/${wikipediaSlug}`
  );
}
