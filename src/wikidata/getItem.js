import getItems from "./getItems";

export default async function getItem(id, languageCode, options) {
  const items = await getItems([id], languageCode, null, options);
  return items[0];
}
