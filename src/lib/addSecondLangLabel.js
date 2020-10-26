export default function addSecondLangLabel(entity, languageCode) {
  if (!languageCode) return;
  const { labels } = entity;
  if (!labels) return;

  let labelObject = labels[languageCode];
  if (!labelObject) return;

  entity.secondLangLabel = labelObject.value;
}
