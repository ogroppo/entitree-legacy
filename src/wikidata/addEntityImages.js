import {
  GENI_ID,
  IMAGE_ID,
  LOGO_ID,
  TWITTER_ID,
  WIKITREE_ID,
} from "../constants/properties";
import { IMAGE_SIZE } from "../constants/tree";
import getData from "../axios/getData";
import getWikitreeImageUrl from "../wikitree/getWikitreeImageUrl";
import getGeniImage from "../geni/getGeniImage";

export default async function getEntityImages(entity, currentLangCode) {
  entity.thumbnails = [];
  entity.images = [];

  const imageClaim = entity.simpleClaims[IMAGE_ID];
  if (imageClaim) {
    imageClaim.forEach((image, index) => {
      entity.thumbnails.push({
        url: getCommonsUrlByFile(image.value),
        alt: `${entity.label}'s Image ${index + 1} from Wikimedia Commons`,
      });
      entity.images.push({
        url: getCommonsUrlByFile(image.value, IMAGE_SIZE * 2),
        alt: `${entity.label}'s Image ${index + 1} from Wikimedia Commons`,
      });
    });
  }

  var numericId = entity.id.substr(1);
  const imageDbServer = "https://images.dataprick.com";
  entity.faceImage = null;
  if (entity.thumbnails.length === 0) {
    try {
      await getData(
        `${imageDbServer}/api/v1/image/info/wikidata/${numericId}`
      ).then((data) => {
        if (data.images.length > 0) {
          entity.faceImage = {
            url: `${imageDbServer}/api/v1/image/facecrop/wikidata/${numericId}`,
            alt: `Image Database`,
          };
          entity.thumbnails.push({
            url: `${imageDbServer}/api/v1/image/thumbnail/wikidata/${numericId}`,
            alt: `Image Database`,
          });
          entity.images.push({
            url: `${imageDbServer}/api/v1/image/thumbnail/wikidata/${numericId}`,
            alt: `Image Database`,
          });
        }
      });
    } catch {}
  }

  // const wikitreeId = entity.simpleClaims[WIKITREE_ID];
  // if (wikitreeId) {
  //   const wikitreeImage = await getWikitreeImageUrl(wikitreeId[0].value);
  //   if (wikitreeImage) {
  //     const img = {
  //       url: wikitreeImage,
  //       alt: `Wikitree.com image`,
  //     };
  //     entity.thumbnails.push(img);
  //     entity.images.push(img);
  //   }
  // }
  //
  // const geniId = entity.simpleClaims[GENI_ID];
  // if (geniId) {
  //   const geniImage = await getGeniImage(geniId[0].value);
  //   if (geniImage) {
  //     const geniImg = {
  //       url: geniImage,
  //       alt: `Geni.com image`,
  //     };
  //     entity.thumbnails.push(geniImg);
  //     entity.images.push(geniImg);
  //   }
  // }

  const twitterClaim = entity.simpleClaims[TWITTER_ID];
  if (twitterClaim) {
    //https://github.com/siddharthkp/twitter-avatar
    twitterClaim.forEach((image) => {
      const img = {
        url: `https://twitter-avatar.now.sh/${image.value}`,
        alt: `${entity.label}'s Twitter image`,
      };
      entity.thumbnails.push(img);
      entity.images.push(img);
    });
  }

  //Logo last, people might have logos like Trump
  const logoClaim = entity.simpleClaims[LOGO_ID];
  if (logoClaim) {
    logoClaim.forEach((image, index) => {
      entity.thumbnails.push({
        url: getCommonsUrlByFile(image.value),
        alt: `${entity.label}'s Logo ${index + 1} from Wikimedia Commons`,
      });
      entity.images.push({
        url: getCommonsUrlByFile(image.value, IMAGE_SIZE * 2),
        alt: `${entity.label}'s Logo ${index + 1} from Wikimedia Commons`,
      });
    });
  }
}

function getCommonsUrlByFile(filename, size = IMAGE_SIZE) {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${filename}${
    size ? `?width=${size}px` : ""
  }`;
}
