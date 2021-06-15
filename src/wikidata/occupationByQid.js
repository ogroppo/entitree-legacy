import { OCCUPATIONS } from "../constants/occupations";

export default function occupationByQid(id) {
  if (!id) {
    return [];
  }
  const result = [];
  id.forEach((occ, index) => {
    console.log(occ);
    if (occ.value) {
      const search = OCCUPATIONS.find(
        (c) => c.item === "http://www.wikidata.org/entity/" + occ.value
      );
      if (search) {
        result.push(search);
      }
    }
  });
  return result;
}
