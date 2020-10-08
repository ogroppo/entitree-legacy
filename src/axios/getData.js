import axios from "axios";

export default async function getData(url, options = {}) {
  //cors problem in headless browsers
  if (navigator.webdriver) url = "https://cors-anywhere.herokuapp.com/" + url;

  const { data } = await axios.get(url, options);

  return data;
}
