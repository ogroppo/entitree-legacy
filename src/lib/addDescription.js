export default function addDescription(entity, languageCode) {
  const { descriptions } = entity;
  const descriptionObject = descriptions[languageCode];

  if (!descriptionObject) return;

  if (descriptionObject.value.startsWith("Peerage person ID=")) return;

  entity.description = descriptionObject.value;
}
