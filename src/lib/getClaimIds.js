//Claims may have qualifier series ordinal, this should be set when the children birthdate is unknown, but they should still be sorted by age.
function getSeriesOrdinal(claim) {
  if (
    claim.qualifiers &&
    claim.qualifiers.P1545 &&
    claim.qualifiers.P1545[0].datavalue
  ) {
    return parseInt(claim.qualifiers.P1545[0].datavalue.value);
  }
  // const {
  //   qualifiers: {
  //     P1545: [{
  //       datavalue: { value: seriesOrdinal },
  //     }],
  //   },
  // } = claim;
  // return parseInt(seriesOrdinal);
  return 0;
}

export default function getClaimIds(entity, propId) {
  const claims = entity.claims[propId] || [];
  claims.sort((a, b) => {
    return getSeriesOrdinal(a) - getSeriesOrdinal(b);
  });
  return claims
    .map(({ mainsnak: { datavalue } }) =>
      datavalue ? datavalue.value.id : null
    )
    .filter((c) => c); //filter out 'No value' and 'Unknown'
}

//checks whether the claim has a qualifier of series ordinal, return true if the first one has it
export function checkIfClaimsHasSeriesOrdinal(entity, propId) {
  const claims = entity.claims[propId] || [];
  if (claims.length) {
    if (getSeriesOrdinal(claims[0])) {
      return true;
    }
  }
  return false;
}
