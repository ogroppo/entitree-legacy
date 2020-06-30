import axios from "axios";

let wikiImagesMemo = {};

export default async function getWikipediaThumbUrl(wikipediaName) {
  if (wikiImagesMemo[wikipediaName] !== undefined) {
    return wikiImagesMemo[wikipediaName];
  }

  try {
    const {
      data: {
        thumbnail: { source: url },
      },
    } = await axios.get(
      "https://en.wikipedia.org/api/rest_v1/page/summary/" + wikipediaName
    );
    wikiImagesMemo[wikipediaName] = url;
  } catch (error) {
    wikiImagesMemo[wikipediaName] = null; //not found or any other error
  } finally {
    return wikiImagesMemo[wikipediaName];
  }
}
