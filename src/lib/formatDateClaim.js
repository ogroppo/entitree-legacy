import moment from "moment";
import wbk from "wikidata-sdk";
import ordinalize from "ordinalize";

export default function formatDateClaim(claim) {
  if (!claim) return;

  let cleanClaims = [];
  claim.forEach((c) => {
    if (
      c.mainsnak &&
      c.mainsnak.datavalue &&
      c.mainsnak.datavalue.value &&
      c.mainsnak.datavalue.value.time
    ) {
      if (c.rank === "normal") cleanClaims.push(c);
      if (c.rank === "preferred") cleanClaims.unshift(c);

      //What about the deprecated ones?
    }
  });
  const firstDate = cleanClaims[0];
  if (!firstDate) return;

  const {
    mainsnak: {
      datavalue: { value },
    },
  } = firstDate;

  //console.log(JSON.stringify(claim));

  return parseDate(value);
}

/**
 *
 * @param wikidatatime
 * @returns {{output: null, dateObject: null}|{output: string, dateObject: number}|{output: *, dateObject: null}}
 */
function parseDate(wikidatatime) {
  //example of  valid object {time: "+1500-07-07T00:00:00Z" ,precision:8}

  /*
    0 - billion years
    3 - million years
    4 - hundred thousand years
    6 - millenium
    7 - century
    8 - decade
    9 - year (only year)
    10 - month (only month);
    11 - day
    */
  const momentFormat = {
    6: "y [millennium]",
    7: "y[th century]",
    8: "y[s]",
    9: "y",
    10: "Y-MM",
    11: "Y-MM-DD",
  };
  const { precision, time } = wikidatatime;

  const dateISOString = wbk.wikibaseTimeToISOString(time);
  const dateOnly = dateISOString.split("T")[0];
  let parsedDate = moment(dateOnly);

  //if not covered with momentjs, try using simpleday
  //example?!?!?
  if (!parsedDate.isValid()) return wbk.wikibaseTimeToSimpleDay(wikidatatime);

  const year = parsedDate.year();
  let eraSuffix = ""; //moment has only BC
  if (year <= 0) {
    parsedDate.add(1, "year"); //adjust moment wrong year formatting for BCE
    eraSuffix = " BCE";
  }

  switch (precision) {
    case 6:
      return parsedDate
        .set({ year: year / 1000 })
        .format(momentFormat[precision]);
    case 7:
      let centuryIndex = Math.abs(Math.floor(year / 100));
      let centuryNumber = year > 0 ? centuryIndex + 1 : centuryIndex;
      return ordinalize(centuryNumber) + " century" + eraSuffix;
    case 10:
      return parsedDate.format("MMM y") + eraSuffix;
    case 11:
      return parsedDate.format("D MMM y") + eraSuffix;
    case 9:
      return parsedDate.format("y") + eraSuffix;
    default:
      return;//https://www.wikidata.org/wiki/Help:Dates
  }
}
