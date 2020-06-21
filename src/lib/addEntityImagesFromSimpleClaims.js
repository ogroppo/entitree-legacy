import { IMAGE_ID, LOGO_ID, TWITTER_ID } from "../constants/properties";
import { IMAGE_SIZE } from "../constants/tree";

export default function addEntityImagesFromSimpleClaims(entity, claims) {
  entity.images = [];
  const images = claims[IMAGE_ID];
  if (images) {
    images.forEach((image) => {
      entity.images.push({
        url: getCommonsUrlByFile(image.value),
        alt: "Wikimedia Commons image",
        source: "Wikimedia Commons",
      });
    });
  }

  const logos = claims[LOGO_ID];
  if (logos) {
    logos.forEach((image) => {
      entity.images.push({
        url: getCommonsUrlByFile(image.value),
        alt: "Wikimedia Commons image",
        source: "Wikimedia Commons",
      });
    });
  }

  //Twitter
  const twitters = claims[TWITTER_ID];
  if (twitters) {
    //https://github.com/siddharthkp/twitter-avatar
    twitters.forEach((image) => {
      entity.images.push({
        url: `https://twitter-avatar.now.sh/${image.value}`,
        alt: "Twitter image",
        source: "Twitter",
      });
    });
  }
}

function getCommonsUrlByFile(filename) {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${filename}?width=${IMAGE_SIZE}px&origin=*`;
}
