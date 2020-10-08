//Only be used for sorting! not a real number
export default function getDateNumber(date) {
  let year = date.substr(0, 5);
  let month = date.substr(6, 2);
  let day = date.substr(9, 2);
  let numericDate = Number(year + "0000") + Number(month + "00") + Number(day);
  return numericDate;
}
