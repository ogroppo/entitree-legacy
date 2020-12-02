import isInIframe from "../lib/isInIframe";

interface Theme {
  contentPaddingLeft: number;
  contentPaddingTop: number;
  customCss: string;
  datesDisplay: "block" | "none";
  datesFontSize: number;
  datesYearOnly: boolean;
  descriptionDisplay: "inline" | "none";
  disabled?: boolean;
  graphBackgroundColor?: string;
  headerHeight: number;
  isCustom?: boolean;
  isInIframe: boolean;
  labelFontSize: number;
  labelTextAlign: string;
  name: string;
  nodeBackgroundColor?: string;
  nodeBorder: string;
  nodeBorderRadius: number;
  nodeBoxShadow: string;
  nodeFlexDirection: "row" | "column";
  nodeFocusedBoxShadow: string;
  nodeHeight: number;
  nodeVerticalSpacing: number;
  nodeWidth: number;
  searchBarHeight: number;
  separationCousins: number;
  separationSameGroup: number;
  separationSiblingSpouse: number;
  thumbBorderRadius: number;
  thumbCounterDisplay: "block" | "none";
  thumbHeight: number;
  thumbWidth: number;
}

export const defaultTheme: Theme = {
  contentPaddingLeft: 3,
  contentPaddingTop: 0,
  customCss: ``,
  datesDisplay: "block",
  datesFontSize: 11,
  datesYearOnly: false,
  descriptionDisplay: "inline",
  headerHeight: 50,
  isInIframe: isInIframe(),
  labelFontSize: 13,
  labelTextAlign: "left",
  name: "Default",
  nodeBackgroundColor: "#eee",
  nodeBorder: "1px solid lightgrey",
  nodeBorderRadius: 5,
  nodeBoxShadow: "4px 4px 10px lightgrey",
  nodeFlexDirection: "row",
  nodeFocusedBoxShadow: "0px 0px 12px steelblue",
  nodeHeight: 90,
  nodeVerticalSpacing: 80,
  nodeWidth: 250,
  searchBarHeight: 60,
  separationCousins: 1.3,
  separationSameGroup: 1.16,
  separationSiblingSpouse: 1.1,
  thumbBorderRadius: 3,
  thumbCounterDisplay: "block",
  thumbHeight: 84,
  thumbWidth: 84,
};

const bigTheme: Theme = {
  ...defaultTheme,
  name: "Big",
  datesFontSize: 9,
  labelFontSize: 16,
};

const lightTheme: Theme = {
  ...defaultTheme,
  name: "Light",
  labelFontSize: 16,
  nodeBackgroundColor: "rgb(250, 238, 222)",
  nodeWidth: 260,
  thumbHeight: 84,
  thumbWidth: 60,
};

const darkTheme: Theme = {
  ...defaultTheme,
  name: "Dark",
  disabled: true,
};

const onlyLabelTheme: Theme = {
  ...defaultTheme,
  datesDisplay: "none",
  datesFontSize: 14,
  datesYearOnly: true,
  descriptionDisplay: "none",
  labelFontSize: 16,
  name: "Only Label",
  nodeHeight: 86,
  nodeVerticalSpacing: 60,
  nodeWidth: 230,
  thumbCounterDisplay: "none",
  thumbHeight: 86,
  thumbWidth: 86,
};

const verticalTheme: Theme = {
  ...defaultTheme,
  datesDisplay: "none",
  datesFontSize: 14,
  datesYearOnly: true,
  descriptionDisplay: "none",
  labelFontSize: 14,
  name: "Vertical",
  nodeFlexDirection: "column",
  nodeHeight: 160,
  nodeVerticalSpacing: 60,
  nodeWidth: 84,
  separationCousins: 1.35,
  separationSameGroup: 1.45,
  separationSiblingSpouse: 1.25,
  thumbCounterDisplay: "none",
  thumbHeight: 84,
  thumbWidth: 84,
};

const rawTheme: Theme = {
  ...defaultTheme,
  contentPaddingLeft: 0,
  contentPaddingTop: 3,
  customCss: `.colorIcons{
  position: absolute;
  bottom: 0;
  right: 30px;
  }`,
  datesDisplay: "none",
  datesFontSize: 14,
  datesYearOnly: true,
  descriptionDisplay: "none",
  labelFontSize: 14,
  labelTextAlign: "center",
  name: "Borderless",
  nodeBackgroundColor: "white",
  nodeBorder: "none",
  nodeBorderRadius: 30,
  nodeBoxShadow: "none",
  nodeFlexDirection: "column",
  nodeFocusedBoxShadow: "none",
  nodeHeight: 157,
  nodeVerticalSpacing: 60,
  nodeWidth: 84,
  separationCousins: 1.35,
  separationSameGroup: 1.45,
  separationSiblingSpouse: 1.25,
  thumbBorderRadius: 30,
  thumbCounterDisplay: "none",
  thumbHeight: 84,
  thumbWidth: 84,
};

export const defaultCustomTheme: Theme = {
  ...defaultTheme,
  name: "Custom",
  isCustom: true,
};

export const THEMES: Theme[] = [
  defaultTheme,
  bigTheme,
  lightTheme,
  darkTheme,
  onlyLabelTheme,
  verticalTheme,
  rawTheme,
  defaultCustomTheme,
];
