import { IMAGE_ID, LOGO_ID, TWITTER_ID } from "../constants/properties";
import { IMAGE_SIZE } from "../constants/tree";

export default function getEntityImagesFromSimpleClaims(claims) {
  let images = [];
  const imageClaim = claims[IMAGE_ID];
  if (imageClaim) {
    imageClaim.forEach((image) => {
      images.push({
        url: getCommonsUrlByFile(image.value),
        alt: "Wikimedia Commons image",
        source: "Wikimedia Commons",
      });
    });
  }

  const logoClaim = claims[LOGO_ID];
  if (logoClaim) {
    logoClaim.forEach((image) => {
      images.push({
        url: getCommonsUrlByFile(image.value),
        alt: "Wikimedia Commons image",
        source: "Wikimedia Commons",
      });
    });
  }

  //Twitter
  const twitterClaim = claims[TWITTER_ID];
  if (twitterClaim) {
    //https://github.com/siddharthkp/twitter-avatar
    twitterClaim.forEach((image) => {
      images.push({
        url: `https://twitter-avatar.now.sh/${image.value}`,
        alt: "Twitter image",
        source: "Twitter",
      });
    });
  }

  return images;
}

function getCommonsUrlByFile(filename) {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${filename}?width=${IMAGE_SIZE}px&origin=*`;
}
