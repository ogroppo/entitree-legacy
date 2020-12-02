export default function getSimpleClaimValue(simpleClaims, propId) {
  try {
    return simpleClaims[propId][0].value;
  } catch (error) {}
}
