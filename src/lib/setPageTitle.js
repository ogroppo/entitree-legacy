export default function setPageTitle(currentEntity, currentProp) {
  let title = `Entitree`;
  if (currentProp)
    title = `${currentProp.overrideLabel || currentProp.label} - ` + title;
  if (currentEntity) title = `${currentEntity.label} - ` + title;

  document.title = title;
}
