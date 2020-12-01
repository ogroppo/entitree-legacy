import {
  IMAGE_ID,
  LOGO_ID,
  TWITTER_ID,
} from "../constants/properties";
import getData from "../axios/getData";
import getWikitreeImageUrl from "../wikitree/getWikitreeImageUrl";
import getGeniImage from "../geni/getGeniImage";

export default async function addEntityImages(entity, currentLangCode, theme) {
  entity.thumbnails = [];
  entity.images = [];

  var numericId = entity.id.substr(1);
  const imageDbServer = "https://images.dataprick.com";
  entity.faceImage = null;
  // if (entity.thumbnails.length === 0) {
  try {
    await getData(
      `${imageDbServer}/api/v1/image/info/wikidata/${numericId}`
    ).then((data) => {
      if (data.images.length > 0) {
        data.images.forEach((dpImg, index) => {
          // const dpImg = data.images[0];
          let descr = `${dpImg.uploadSite}\nImage Database`;
          if (dpImg.comment) {
            descr += `\n${dpImg.comment}`;
          }
          if (dpImg.recordedDate) {
            descr += `\nPhoto taken in ${dpImg.recordedDate.substr(0, 4)}`;
          }
          if (dpImg.sourceUrl) {
            descr += `\n\n${dpImg.sourceUrl}`;
          }
          entity.faceImage = {
            url: `${imageDbServer}/api/v1/image/facecrop/id/${dpImg.id}`,
            alt: descr,
          };
          entity.thumbnails.push({
            url: `${imageDbServer}/api/v1/image/thumbnail/id/${dpImg.id}`,
            alt: descr,
          });
          entity.images.push({
            url: `${imageDbServer}/api/v1/image/thumbnail/id/${dpImg.id}`,
            alt: descr,
          });
        });
      }
    });
  } catch {}
  // }

  const imageClaim = entity.simpleClaims[IMAGE_ID];
  if (imageClaim) {
    imageClaim.forEach((image, index) => {
      entity.thumbnails.push({
        url: getCommonsUrlByFile(image.value, theme?.thumbWidth),
        alt: `${entity.label}'s Image ${index + 1} from Wikimedia Commons\nPlease refer to https://commons.wikimedia.org/wiki/File:${image.value} for credits`,
      });
      entity.images.push({
        url: getCommonsUrlByFile(image.value, theme?.thumbWidth * 2),
        alt: `${entity.label}'s Image ${index + 1} from Wikimedia Commons\nPlease refer to https://commons.wikimedia.org/wiki/File:${image.value} for credits`,
      });
    });
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
        url: getCommonsUrlByFile(image.value, theme?.thumbWidth),
        alt: `${entity.label}'s Logo ${index + 1} from Wikimedia Commons`,
      });
      entity.images.push({
        url: getCommonsUrlByFile(image.value, theme?.thumbWidth * 2),
        alt: `${entity.label}'s Logo ${index + 1} from Wikimedia Commons`,
      });
    });
  }
}

function getCommonsUrlByFile(filename, size) {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${filename}?width=${size}px`;
}
