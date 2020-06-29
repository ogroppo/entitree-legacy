import axios from "axios";
import wdk from "wikidata-sdk";
import formatEntity from "../lib/formatEntity";
import { DEFAULT_LANG } from "../constants/langs";

export default async function getItem(id, languageCode) {
  const url = await new Promise(function (resolve, reject) {
    try {
      resolve(
        wdk.getEntities({
          ids: id,
          languages: [languageCode].concat(DEFAULT_LANG.code),
          props: ["labels", "descriptions", "claims", "sitelinks/urls"],
        })
      );
    } catch (error) {
      reject(error);
    }
  });

  return axios.get(url).then(({ data: { entities } }) => {
    return formatEntity(entities[id], languageCode);
  });
}
