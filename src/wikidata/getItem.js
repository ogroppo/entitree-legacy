import getItems from "./getItems";

export default async function getItem(id, languageCode, theme, options) {
  const items = await getItems([id], languageCode, null, theme, options);
  return items[0];
}
