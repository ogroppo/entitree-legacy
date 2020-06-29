import Axios from "axios";

export default function search(term, languageCode) {
  //const url = wbk.searchEntities('Ingmar Bergman')
  return Axios.get("https://www.wikidata.org/w/api.php", {
    params: {
      origin: "*",
      action: "wbsearchentities",
      format: "json",
      uselang: languageCode,
      language: languageCode,
      search: term,
    },
  });
}
