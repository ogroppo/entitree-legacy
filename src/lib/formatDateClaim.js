import moment from "moment";
export default function formatDateClaim(claim) {
  if (
    !claim ||
    !claim[0].mainsnak.datavalue ||
    !claim[0].mainsnak.datavalue.value
  )
    return;

  const dateValue = claim[0].mainsnak.datavalue.value;

  let { time } = dateValue;
  if (time.startsWith("+")) time = time.substr(1);
  //julian dates?!?!?!
  const mm = moment(time);
  if (!mm.isValid()) {
    return;
  }

  // if (dateValue.precision === 8)
  // //dacade?
  //    return mm.format("YYYY");

  if (dateValue.precision === 9)
    //year
    return mm.format("YYYY");

  if (dateValue.precision === 10)
    //month
    return mm.format("MMM YYYY");

  if (dateValue.precision === 11)
    //day
    return mm.format("DD MMM YYYY");

  return mm.format();
}
