import wdk from "wikidata-sdk";
import axios from "axios";
import getData from "../axios/getData";

export default async function getEntitiesFromWikidata({
  ids,
  languages,
  props,
}) {
  if (ids.length === 0) {
    return [];
  }
  ids = ids.filter((id) => !!id); //delete undefined values

  //1 url for every 50 items
  const urls = await new Promise(function (resolve, reject) {
    try {
      if (!languages) throw new Error("languageCode Missing");
      resolve(
        wdk.getManyEntities({
          ids,
          languages,
          props,
        })
      );
    } catch (error) {
      reject(error);
    }
  });

  //responses will be based on the number of urls generated
  const responses = await axios.all(urls.map((url) => getData(url)));

  //merge all responses in one object
  let allentities = {};
  responses.forEach(
    ({ entities }) =>
      (allentities = {
        ...allentities,
        ...entities,
      })
  );
  return allentities;
}
