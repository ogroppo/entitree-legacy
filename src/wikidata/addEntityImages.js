import { IMAGE_ID, LOGO_ID } from "../constants/properties";

export default async function addEntityImages(entity, currentLangCode, theme) {
  entity.thumbnails = [];
  entity.images = [];

  //todo deal with missing image
  /*
  if (entity.peoplepillSlug) {
    const inital = entity.peoplepillSlug.substr(0, 1).toUpperCase();
    const url =
      "https://web.archive.org/web/20220210233602if_/https://peoplepill.com/media/people/thumbs/" +
      inital +
      "/" +
      entity.peoplepillSlug +
      ".jpg";

    entity.thumbnails.push({
      url: url,
      alt: `Taken from peoplepill`,
    });
    entity.images.push({
      url: url,
      alt: `Taken from peoplepill`,
    });
  }
  */

  const imageClaim = entity.simpleClaims[IMAGE_ID];
  if (imageClaim) {
    imageClaim.forEach((image, index) => {
      //catch undefined value
      if (image.value) {
        entity.thumbnails.push({
          url: getCommonsUrlByFile(image.value, theme?.thumbWidth),
          alt: `${entity.label}'s Image ${
            index + 1
          } from Wikimedia Commons\nPlease refer to https://commons.wikimedia.org/wiki/File:${
            image.value
          } for credits`,
        });
        entity.images.push({
          url: getCommonsUrlByFile(image.value, theme?.thumbWidth * 2),
          alt: `${entity.label}'s Image ${
            index + 1
          } from Wikimedia Commons\nPlease refer to https://commons.wikimedia.org/wiki/File:${
            image.value
          } for credits`,
        });
      }
    });
  }

  // const twitterClaim = entity.simpleClaims[TWITTER_ID];
  // if (twitterClaim) {
  //   //https://github.com/siddharthkp/twitter-avatar
  //   twitterClaim.forEach((image) => {
  //     const img = {
  //       url: `/twitter/getImage/${image.value}`,
  //       alt: `${entity.label}'s Twitter image`,
  //     };
  //     entity.thumbnails.push(img);
  //     entity.images.push(img);
  //   });
  // }

  //Logo last, people might have logos like Trump
  const logoClaim = entity.simpleClaims[LOGO_ID];
  if (logoClaim) {
    logoClaim.forEach((image, index) => {
      //catch undefined value
      if (image.value) {
        entity.thumbnails.push({
          url: getCommonsUrlByFile(image.value, theme?.thumbWidth),
          alt: `${entity.label}'s Logo ${index + 1} from Wikimedia Commons`,
        });
        entity.images.push({
          url: getCommonsUrlByFile(image.value, theme?.thumbWidth * 2),
          alt: `${entity.label}'s Logo ${index + 1} from Wikimedia Commons`,
        });
      }
    });
  }
}

function getCommonsUrlByFile(filename, size) {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${filename}?width=${size}px`;
}
