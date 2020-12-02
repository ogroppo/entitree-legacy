import { SOCIAL_PROPS_IDS } from "../constants/properties";
import getSimpleClaimValue from "./getSimpleClaimValue";

/**
 * Gets a list of social media icons
 * @param claims accepts wbk.simplify.claims
 */
export default function addExternalLinks(entity) {
  let socialProps = [];
  const { simpleClaims } = entity;
  for (var socialPropId in SOCIAL_PROPS_IDS) {
    let claimValue = getSimpleClaimValue(simpleClaims, socialPropId);
    if (claimValue) {
      const { alt, baseUrl, title, iconName } = SOCIAL_PROPS_IDS[socialPropId];
      socialProps.push({
        title,
        iconSrc: `/icons/${iconName}.png`,
        alt: alt,
        url: baseUrl + claimValue,
      });
    }
  }
  if (socialProps.length) {
    entity.externalLinks = socialProps;
  }
}
