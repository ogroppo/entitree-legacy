export default function addInceptionAbolishedSpan(entity) {
  let inceptionAblishedSpan = "";
  if (entity.inceptionDate) inceptionAblishedSpan += entity.inceptionDate;
  if (entity.inceptionDate && entity.abolishedDate)
    inceptionAblishedSpan += " - ";

  if (entity.abolishedDate) inceptionAblishedSpan += entity.abolishedDate;

  if (inceptionAblishedSpan)
    entity.inceptionAblishedSpan = inceptionAblishedSpan;
}
