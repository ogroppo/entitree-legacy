export default function getChildrenFromPropId(entity, propId) {
  const claims = entity.claims[propId] || [];
  return claims
    .map(({ mainsnak: { datavalue } }) =>
      datavalue ? datavalue.value.id : null
    )
    .filter((c) => c);
}
