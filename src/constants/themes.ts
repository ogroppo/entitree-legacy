import isInIframe from "../lib/isInIframe";

interface Theme {
  boxCss: string,
  cousinsSeparation: number;
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
  nodeBorderWidth: number;
  nodeFlexDirection: "row" | "column";
  nodeHeight: number;
  nodeVerticalSpacing: number;
  nodeWidth: number;
  sameGroupSeparation: number;
  searchBarHeight: number;
  siblingSpouseSeparation: number;
  thumbCounterDisplay: "block" | "none";
  thumbHeight: number;
  thumbWidth: number;
}

export const defaultTheme: Theme = {
  boxCss: `border: 1px solid lightgrey;
  box-shadow: 4px 4px 10px lightgrey;
  box-sizing: border-box;
    &.focused {
    box-shadow: 0px 0px 12px steelblue;
  }`,
  isInIframe: isInIframe(),
  cousinsSeparation: 1.3,
  datesDisplay: "block",
  datesFontSize: 11,
  descriptionDisplay: "inline",
  labelFontSize: 13,
  labelTextAlign: "left",
  headerHeight: 50,
  searchBarHeight: 60,
  name: "Default",
  nodeBackgroundColor: "#eee",
  nodeBorderWidth: 1,
  nodeFlexDirection: "row",
  nodeVerticalSpacing: 80,
  nodeWidth: 250,
  nodeHeight: 90,
  sameGroupSeparation: 1.16,
  siblingSpouseSeparation: 1.1,
  thumbCounterDisplay: "block",
  thumbHeight: 84,
  thumbWidth: 84,
  datesYearOnly: false,
};

const bigTheme: Theme = {
  ...defaultTheme,
  name: "Big",
  labelFontSize: 16,
  datesFontSize: 9,
};

const lightTheme: Theme = {
  ...defaultTheme,
  name: "Light",
  nodeWidth: 260,
  thumbWidth: 60,
  thumbHeight: 84,
  labelFontSize: 16,
  nodeBackgroundColor: "rgb(250, 238, 222)",
};

const darkTheme: Theme = {
  ...defaultTheme,
  name: "Dark",
  disabled: true,
};

const onlyLabelTheme: Theme = {
  ...defaultTheme,
  // datesDisplay: "none",
  datesFontSize: 14,
  descriptionDisplay: "none",
  labelFontSize: 16,
  name: "Only Label",
  nodeVerticalSpacing: 60,
  nodeWidth: 170,
  thumbCounterDisplay: "none",
  datesYearOnly: true,
};

const verticalTheme: Theme = {
  ...defaultTheme,
  cousinsSeparation: 1.35,
  datesDisplay: "none",
  datesFontSize: 14,
  descriptionDisplay: "none",
  labelFontSize: 14,
  name: "Vertical",
  nodeFlexDirection: "column",
  nodeHeight: 160,
  nodeWidth: 84,
  nodeVerticalSpacing: 60,
  sameGroupSeparation: 1.45,
  siblingSpouseSeparation: 1.25,
  thumbCounterDisplay: "none",
  thumbHeight: 84,
  thumbWidth: 84,
  datesYearOnly: true,
};

const rawTheme: Theme = {
  ...defaultTheme,
  boxCss: `.imgWrapper {
    border-radius: 30px;
    }`,
  cousinsSeparation: 1.35,
  datesDisplay: "none",
  datesFontSize: 14,
  descriptionDisplay: "none",
  labelFontSize: 14,
  labelTextAlign: "center",
  name: "Raw & borderless",
  nodeFlexDirection: "column",
  nodeBackgroundColor: "white",
  nodeHeight: 130,
  nodeWidth: 84,
  nodeVerticalSpacing: 60,
  sameGroupSeparation: 1.45,
  siblingSpouseSeparation: 1.25,
  thumbCounterDisplay: "none",
  thumbHeight: 84,
  thumbWidth: 84,
  datesYearOnly: true,
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
