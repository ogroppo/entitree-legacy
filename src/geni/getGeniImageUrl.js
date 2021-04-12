import getData from "../axios/getData";
import jsonp from "jsonp-promise";

export default async function getGeniImageUrl(geniId) {
  try {
    const data = await jsonp(`https://www.geni.com/api/profile-g${geniId}`, {
      param: "callback",
    }).promise;
    if (data && data.mugshot_urls && data.mugshot_urls.thumb) {
      return data.mugshot_urls.thumb;
    }
  } catch (e) {}
}
