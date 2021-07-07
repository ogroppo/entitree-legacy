import jsonp from "jsonp-promise";

export async function getFandomImages(fandomHost, fandomPage) {
  const host = `https://${fandomHost}.fandom.com/api.php`;
  try {
    const data = await jsonp(
      `${host}?action=query&prop=images&titles=${fandomPage}&format=json`,
      {
        param: "callback",
        timeout: 1000,
      }
    ).promise;
    return data;
  } catch (e) {}
}

export async function getFandomPageProps(fandomHost, fandomPage) {
  const host = `https://${fandomHost}.fandom.com/api.php`;
  try {
    const data = await jsonp(
      `${host}?action=query&prop=pageprops&titles=${fandomPage}&format=json`,
      {
        param: "callback",
        timeout: 1000,
      }
    ).promise;
    return data;
  } catch (e) {}
}

export async function getFandomImageUrl(fandomHost, fandomImage) {
  const host = `https://${fandomHost}.fandom.com/api.php`;
  try {
    const data = await jsonp(
      `${host}?action=query&prop=imageinfo&iiprop=url&titles=${fandomImage}&format=json`,
      {
        param: "callback",
        timeout: 1000,
      }
    ).promise;
    return data;
  } catch (e) {}
}
