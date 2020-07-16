export default function addLifeSpan(entity) {
  let lifeSpan = "";
  if (entity.birthDate) lifeSpan += entity.birthDate;
  if (entity.birthDate && entity.deathDate) lifeSpan += " - ";

  if (entity.deathDate) lifeSpan += entity.deathDate;

  if (lifeSpan) entity.lifeSpan = lifeSpan;
}
