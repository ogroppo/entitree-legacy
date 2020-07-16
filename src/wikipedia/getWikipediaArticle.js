import Axios from "axios";

export default function getWikipediaArticle(wikipediaSlug, currentLangCode) {
  return Axios.get(
    `https://${currentLangCode}.wikipedia.org/api/rest_v1/page/summary/${wikipediaSlug}`
  );
}
