import wdk from "wikidata-sdk";
import formatEntity from "../lib/formatEntity";
import { DEFAULT_LANGS_CODES } from "../constants/langs";
import getData from "../axios/getData";

export default async function getItem(id, languageCode, options = {}) {
  const languages = DEFAULT_LANGS_CODES.concat(languageCode);

  if (options.secondLang) languages.push(options.secondLang.code);

  let url = await new Promise(function (resolve, reject) {
    try {
      resolve(
        wdk.getEntities({
          ids: id,
          languages,
          props: ["labels", "descriptions", "claims", "sitelinks/urls"],
        })
      );
    } catch (error) {
      reject(error);
    }
  });

  const { entities } = await getData(url);
  const formattedEntity = await formatEntity(entities[id], languageCode);
  return formattedEntity;
}
