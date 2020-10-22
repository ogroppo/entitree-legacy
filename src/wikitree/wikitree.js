import getData from "../axios/getData";

export default async function getWikitreeComImages(wikitreeId) {
  try {
    const data = await getData(
      `https://cors-anywhere.herokuapp.com/https://api.wikitree.com/api.php?action=getProfile&key=${wikitreeId}`,
      {'X-Requested-With': 'XMLHttpRequest'}
    );
    // console.log(data);
    if (data[0] && data[0].profile.PhotoData && data[0].profile.PhotoData.url) {
      return 'https://www.wikitree.com' + data[0].profile.PhotoData.url;
    }
  }catch (e) {
  }
  return null;
}
