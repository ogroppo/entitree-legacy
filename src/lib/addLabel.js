import { DEFAULT_LANGS_CODES } from "../constants/langs";

export default function addLabel(entity, languageCode) {
  if (!entity) throw new Error("You need valid entity to addLabel");
  const { labels } = entity;
  if (!labels) return;

  let labelObject = labels[languageCode];
  if (!labelObject)
    for (let defaultLangCode of DEFAULT_LANGS_CODES) {
      let defaultLang = labels[defaultLangCode];
      if (defaultLang) {
        labelObject = defaultLang;
        break;
      }
    }

  if (!labelObject) return;

  entity.label = labelObject.value;
}
