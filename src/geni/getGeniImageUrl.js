import getData from "../axios/getData";

export default async function getGeniImageUrl(geniId) {
  try {
    const data = await getData(
      `https://cors-anywhere.herokuapp.com/https://www.geni.com/api/profile-g${geniId}`,
      { "X-Requested-With": "XMLHttpRequest" }
    );
    if (data && data.mugshot_urls && data.mugshot_urls.thumb) {
      return data.mugshot_urls.thumb;
    }
  } catch (e) {}
}
