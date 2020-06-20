import { SOCIAL_PROPS_IDS } from "../constants/properties";

/**
 * Gets a list of social media icons
 * @param claims accepts wbk.simplify.claims
 */
export default function getSocialMediaProps(claims) {
  let socialProps = [];
  for (var prop in SOCIAL_PROPS_IDS) {
    let claim = claims[prop] ? claims[prop][0] : null;
    if (claim) {
      const { alt, baseUrl, title, iconName } = SOCIAL_PROPS_IDS[prop];
      socialProps.push({
        title,
        iconSrc: `/icons/${iconName}.png`,
        alt: alt,
        url: baseUrl + claim.value,
      });
    }
  }
  return socialProps;
}
