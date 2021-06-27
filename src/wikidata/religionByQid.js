import { RELIGIONS } from "../constants/religions";

export default function religionByQid(id) {
  if (!id || !id[0]) {
    return null;
  }
  const entityId = id[0].value;
  const religion = RELIGIONS.find(
    (c) => c.item === "http://www.wikidata.org/entity/" + entityId
  );

  return religion;
}
