export default function getBestClaim(claim, prop = "id") {
  if (!claim) return;

  let cleanClaims = [];
  claim.forEach((c) => {
    if (
      c.mainsnak &&
      c.mainsnak.datavalue &&
      c.mainsnak.datavalue.value &&
      c.mainsnak.datavalue.value[prop]
    ) {
      if (c.rank === "normal") cleanClaims.push(c);
      if (c.rank === "preferred") cleanClaims.unshift(c);

      //What about the deprecated ones?
    }
  });

  const bestClaim = cleanClaims[0];
  if (!bestClaim) return;

  const {
    mainsnak: {
      datavalue: {
        value: { [prop]: returnValue },
      },
    },
  } = bestClaim;

  return returnValue;
}
