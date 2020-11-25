interface Theme {
  cousinsSeparation: number;
  datesDisplay: "block" | "none";
  datesFontSize: number;
  descriptionDisplay: "inline" | "none";
  disabled?: boolean;
  graphBackgroundColor?: string;
  isCustom?: boolean;
  labelFontSize: number;
  name: string;
  nodebackgroundColor?: string;
  nodeBorderWidth: number;
  nodeFlexDirection: "row" | "column";
  nodeHeight: number;
  nodeVerticalSpacing: number;
  nodeWidth: number;
  sameGroupSeparation: number;
  siblingSpouseSeparation: number;
  thumbCounterDisplay: "block" | "none";
  thumbHeight: number;
  thumbWidth: number;
  datesYearOnly: boolean;
}

export const defaultTheme: Theme = {
  cousinsSeparation: 1.3,
  datesDisplay: "block",
  datesFontSize: 11,
  descriptionDisplay: "inline",
  labelFontSize: 13,
  name: "Default",
  nodeBorderWidth: 1,
  nodeFlexDirection: "row",
  nodeVerticalSpacing: 80,
  nodeWidth: 250,
  nodeHeight: 88,
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
  nodebackgroundColor: "rgb(250, 238, 222)",
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
  graphBackgroundColor: "#eae1c7",
  labelFontSize: 14,
  name: "Vertical",
  nodeFlexDirection: "column",
  nodeHeight: 135,
  nodeVerticalSpacing: 60,
  sameGroupSeparation: 1.25,
  siblingSpouseSeparation: 1.25,
  thumbCounterDisplay: "none",
  thumbHeight: 80,
  thumbWidth: 80,
  datesYearOnly: true,
};

export const customTheme: Theme = {
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
  customTheme,
];
