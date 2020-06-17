export default function getClaimIds(entity, propId) {
  const claims = entity.claims[propId] || [];
  return claims
    .map(({ mainsnak: { datavalue } }) =>
      datavalue ? datavalue.value.id : null
    )
    .filter((c) => c); //filter out 'No value' and 'Unknown'
}
