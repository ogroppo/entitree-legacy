import getWikipediaArticle from "./getWikipediaArticle";

let wikiImagesMemo = {};

export default async function getWikipediaThumbUrl(
  wikipediaSlug,
  currentLangCode
) {
  if (wikiImagesMemo[wikipediaSlug] !== undefined) {
    return wikiImagesMemo[wikipediaSlug];
  }

  try {
    const {
      data: {
        thumbnail: { source: url },
      },
    } = getWikipediaArticle(wikipediaSlug, currentLangCode);
    wikiImagesMemo[wikipediaSlug] = url;
  } catch (error) {
    wikiImagesMemo[wikipediaSlug] = null; //not found or any other error
  } finally {
    return wikiImagesMemo[wikipediaSlug];
  }
}
