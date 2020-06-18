import moment from "moment";
import wbk from "wikidata-sdk";

export default function formatDateClaim(claim) {
  if (
    !claim ||
    !claim[0].mainsnak.datavalue ||
    !claim[0].mainsnak.datavalue.value
  )
    return;

  const dateValue = claim[0].mainsnak.datavalue.value;
  return parseDate(dateValue).output;

  // let { time } = dateValue;
  // if (time.startsWith("+")) time = time.substr(1);
  // //julian dates?!?!?!
  // const mm = moment(time);
  // if (!mm.isValid()) {
  //   return;
  // }
  //
  // // if (dateValue.precision === 8)
  // // //dacade?
  // //    return mm.format("YYYY");
  //
  // if (dateValue.precision === 9)
  //   //year
  //   return mm.format("YYYY");
  //
  // if (dateValue.precision === 10)
  //   //month
  //   return mm.format("MMM YYYY");
  //
  // if (dateValue.precision === 11)
  //   //day
  //   return mm.format("DD MMM YYYY");
  //
  // return mm.format();
}

/**
 *
 * @param wikidatatime
 * @returns {{output: null, dateObject: null}|{output: string, dateObject: number}|{output: *, dateObject: null}}
 */
function parseDate(wikidatatime){
  //check if an object
  //example of  valid object {time: "+1500-07-07T00:00:00Z" ,precision:8}
  if (wikidatatime instanceof Object){
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
    var momentFormat = {
      6: "y [millennium]",
      7: "y[th century]",
      8: "y[s]",
      9: "y",
      10: "Y-MM",
      11: "Y-MM-DD"
    };
    var parsedDate;
    //check moment js validity
    //Moment year date range valid -271820 - 275760
    parsedDate = moment(wbk.wikibaseTimeToISOString(wikidatatime.time+''));
    if (parsedDate.isValid()){
      var year = parsedDate.year();
      if (year<0){
        return {
          'output' : parsedDate.format(" y N"),
          'dateObject' : moment(wbk.wikibaseTimeToISOString(wikidatatime.time+'')).valueOf()
        }
      }else{
        var precision = wikidatatime.precision;
        if (precision == 6){
          parsedDate.set({'year':(year/1000)});
        }else if (precision == 7){
          parsedDate.set({'year':(year/100)});
        }else if (!precision){
          precision = 9;
        }
        return {
          'output' : parsedDate.format(momentFormat[wikidatatime.precision]),
          'dateObject' : moment(wbk.wikibaseTimeToISOString(wikidatatime.time+'')).valueOf()
        }
      }

    } else {
      //if not covered with momentjs, try using simpleday
      return {
        'output' : wbk.wikibaseTimeToSimpleDay(wikidatatime),
        'dateObject' : null
      }
    }
  }else{
    return {
      'output' : null,
      'dateObject' : null
    }
  }

}