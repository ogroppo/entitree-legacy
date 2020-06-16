import moment from "moment";
export default function formatDateClaim(claim) {
  if (!claim || !claim[0].mainsnak.datavalue) return;

  const dateValue = claim[0].mainsnak.datavalue.value;
  //julian dates?!?!?!
  const mm = moment(dateValue.time);

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
