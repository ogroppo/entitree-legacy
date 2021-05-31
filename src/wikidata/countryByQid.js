import { COUNTRY_CODES } from "../constants/countryCode";

export default function countryByQid(id) {
  if (!id) {
    return null;
  }
  const entityId = id[0].value;
  const color = COUNTRY_CODES.find(
    (c) => c.item === "http://www.wikidata.org/entity/" + entityId
  );
  return color;
}
