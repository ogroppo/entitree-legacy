import { IMAGE_ID, LOGO_ID, TWITTER_ID } from "../constants/properties";
import { IMAGE_SIZE } from "../constants/tree";
import getWikipediaThumbUrl from "../wikipedia/getWikipediaThumbUrl";

export default async function getEntityImages(entity, currentLangCode) {
  let images = [];
  const imageClaim = entity.simpleClaims[IMAGE_ID];
  if (imageClaim) {
    imageClaim.forEach((image, index) => {
      images.push({
        url: getCommonsUrlByFile(image.value),
        alt: `${entity.label}'s Image ${index + 1} from Wikimedia Commons`,
      });
    });
  }

  const logoClaim = entity.simpleClaims[LOGO_ID];
  if (logoClaim) {
    logoClaim.forEach((image, index) => {
      images.push({
        url: getCommonsUrlByFile(image.value),
        alt: `${entity.label}'s Logo ${index + 1} from Wikimedia Commons`,
      });
    });
  }

  //Twitter
  const twitterClaim = entity.simpleClaims[TWITTER_ID];
  if (twitterClaim) {
    //https://github.com/siddharthkp/twitter-avatar
    twitterClaim.forEach((image) => {
      images.push({
        url: `https://twitter-avatar.now.sh/${image.value}`,
        alt: `${entity.label}'s Twitter image`,
      });
    });
  }

  if (images.length === 0) {
    //check if has wikipedia name, and set the name and id to be fetch in the client side;
    if (entity.sitelinks && entity.sitelinks[currentLangCode + "wiki"]) {
      var wikipediaName = entity.sitelinks[currentLangCode + "wiki"].url.split(
        "/wiki/"
      )[1];
      try {
        const url = await getWikipediaThumbUrl(wikipediaName);

        if (url) {
          images.push({ url, alt: `${entity.label}'s Wikipedia image` });
        }
      } catch (e) {
        //404 image will throw but that's ok
      }
    }
  }

  return images;
}

function getCommonsUrlByFile(filename) {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${filename}?width=${IMAGE_SIZE}px&origin=*`;
}
