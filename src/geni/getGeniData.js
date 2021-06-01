import jsonp from "jsonp-promise";

export default async function getGeniData(geniId) {
  try {
    const data = await jsonp(`https://www.geni.com/api/profile-g${geniId}`, {
      param: "callback",
      timeout: 1000,
    }).promise;
    return data;
  } catch (e) {}
}
