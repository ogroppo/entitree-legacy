import moment from "moment/min/moment-with-locales";
import wbk from "wikidata-sdk";
import ordinalize from "ordinalize";

export default function formatDateClaim(claim, languageCode, yearOnly = false) {
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

  return parseDate(value, languageCode, yearOnly);
}

/**
 *
 * @param wikidatatime
 * @returns {{output: null, dateObject: null}|{output: string, dateObject: number}|{output: *, dateObject: null}}
 */
function parseDate(wikidatatime, languageCode = "en", yearOnly = false) {
  //example of  valid object {time: "+1500-07-07T00:00:00Z" ,precision:8}
  //https://www.wikidata.org/wiki/Help:Dates
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

  let { precision, time } = wikidatatime;

  //for precision < 6 this doesn't make sense
  const dateISOString = wbk.wikibaseTimeToISOString(time);
  const dateOnly = dateISOString.split("T")[0];
  let parsedDate = moment(dateOnly);
  const year = parsedDate.year();
  let eraSuffix = ""; //moment has only BC
  if (year <= 0) {
    parsedDate.add(1, "year"); //adjust moment wrong year formatting for BCE
    eraSuffix = " BCE";
  }
  if (yearOnly && precision > 9) {
    precision = 9;
  }
  switch (precision) {
    case 0:
      let [, byear] = time.split("-");
      let bya = parseFloat(+byear / 1e9);
      return bya + " Bya";
    case 2: //Earth Q2 has precision 2 WTF, not in docs
      let [, myear2] = time.split("-");
      let mya2 = parseFloat(+myear2 / 1e6);
      return mya2 + " Mya";
    case 3:
      let [, myear] = time.split("-");
      let mya = parseFloat(+myear / 1e6);
      return mya + " Mya";
    case 4:
      let [, kyear] = time.split("-");
      let kya = parseFloat(+kyear / 1e3); //should be 1e5
      return kya + " Kya";
    case 6:
      let millenniumIndex = Math.abs(Math.floor(year / 1000));
      let millenniumNumber = year > 0 ? millenniumIndex + 1 : millenniumIndex;
      return ordinalize(millenniumNumber) + " mill." + eraSuffix;
    case 7:
      let centuryIndex = Math.abs(Math.floor(year / 100));
      let centuryNumber =
        year > 0 ? Math.ceil(year / 100) : Math.abs(Math.floor(year / 100));
      return ordinalize(centuryNumber) + " cent." + eraSuffix;
    case 8:
      return Math.floor(year / 10) + "0s" + eraSuffix;
    case 9:
      return parsedDate.format("y") + eraSuffix;
    case 10:
      return parsedDate.locale(languageCode).format("MMM y") + eraSuffix;
    case 11: {
      return parsedDate.locale(languageCode).format("D MMM y") + eraSuffix;
    }
    default:
      return wbk.wikibaseTimeToSimpleDay(wikidatatime);
  }
}
