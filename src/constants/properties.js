import {
  HUMAN_ID,
  ORGANIZATION_ID,
  BUSINESS_ID,
  HUMAN_SETTLEMENT_ID,
} from "./entities";

export const SIBLINGS_ID = "P3373";
export const SPOUSE_ID = "P26";
export const BIRTH_DATE_ID = "P569";
export const DEATH_DATE_ID = "P570";
export const CHILD_ID = "P40";
export const STUDENT_OF_ID = "P1066";
export const STUDENT_ID = "P802";
export const LOCATED_IN_ID = "P131";
export const IMAGE_ID = "P18";
export const LOGO_ID = "P154";
export const TWITTER_ID = "P2002";

export const BUSINESS_PROPS = [
  {
    id: "P355",
    label: "Subsidiaries",
  },
  {
    id: "P749",
    label: "Parent orgs",
  },
  {
    id: "P1830",
    label: "Ownership",
  },
  {
    id: "P127",
    label: "Ownership reversed?",
  },
];

export const preferredProps = {
  [HUMAN_ID]: [
    {
      id: CHILD_ID,
      label: "family",
    },
    {
      id: STUDENT_ID,
      label: "student",
    },
  ],
  [ORGANIZATION_ID]: BUSINESS_PROPS,
  [BUSINESS_ID]: BUSINESS_PROPS,
  [HUMAN_SETTLEMENT_ID]: [
    {
      id: LOCATED_IN_ID,
      label: "location",
    },
  ],
};

export const SOCIAL_PROPS_IDS = {
  P6634: {
    title: "Open Linkeding profile in a new tab",
    iconName: "linkedin",
    alt: "linkedin icon",
    baseUrl: "https://www.linkedin.com/in/",
  },
  P2003: {
    title: "Open instagram profile in a new tab",
    alt: "instagram icon",
    iconName: "instagram",
    baseUrl: "https://www.instagram.com/",
  },
  P2002: {
    title: "Open twitter profile in a new tab",
    alt: "twitter icon",
    iconName: "twitter",
    baseUrl: "https://twitter.com/",
  },
  P2013: {
    title: "Open facebook page in a new tab",
    iconName: "facebook",
    alt: "facebook icon",
    baseUrl: "https://www.facebook.com/",
  },
  P2949: {
    title: "Open wikitree profile in a new tab",
    iconName: "wikitree",
    alt: "wikitree icon",
    baseUrl: "https://www.wikitree.com/wiki/",
  },
  P2600: {
    title: "Open geni profile in a new tab",
    iconName: "geni",
    alt: "geni icon",
    baseUrl: "https://www.geni.com/profile/index/",
  },
  P7085: {
    title: "Open geni profile in a new tab",
    iconName: "tiktok",
    alt: "tiktok icon",
    baseUrl: "https://www.tiktok.com/@",
  },
  // 'P345' : ['imdb',' https://www.imdb.com/name/$1/']
};
