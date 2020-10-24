import { DEFAULT_LANGS_CODES } from "../constants/langs";

export default function addSecondLangLabel(entity, languageCode) {
  const { labels } = entity;
  if (!labels) return;
  if (!languageCode) return;

  let labelObject = labels[languageCode];
  if (!labelObject) return;

  entity.secondLangLabel = labelObject.value;
}
