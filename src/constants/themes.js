const defaultTheme = {
  cardWidth: 250,
  thumbWidth: 84,
  thumbHeight: 84,
  labelFontSize: 13,
  cardPadding: 2,
  descriptionDisplay: "inline",
  datesDisplay: "block",
  datesFontSize: 11,
  cardVerticalSpacing: 80,
  nodeDisplay: "flex",
  imageCounter: "block",
};
export const THEMES = [
  {
    ...defaultTheme,
    name: "Default",
  },
  {
    ...defaultTheme,
    name: "Big",
    labelFontSize: 16,
    datesFontSize: 13,
    cardPadding: 0,
  },
  {
    ...defaultTheme,
    name: "Light",
    cardWidth: 260,
    thumbWidth: 60,
    thumbHeight: 84,
    labelFontSize: 16,
    cardPadding: 0,
    backgroundColor: "rgb(250, 238, 222)",
  },
  { name: "Dark", disabled: true },
  {
    ...defaultTheme,
    name: "Only Label",
    cardWidth: 200,
    labelFontSize: 16,
    descriptionDisplay: "none",
    datesFontSize: 14,
    yearOnly: true,
    cardPadding: 0,
    imageCounter: "none",
    cardVerticalSpacing: 60,
  },
  {
    ...defaultTheme,
    name: "Matt's theme",
    graphBackgroundColor: "#eae1c7",
    thumbWidth: 80,
    thumbHeight: 80,
    cardWidth: 82,
    cardHeight: 132,
    labelFontSize: 14,
    flexDirection: "column",
    descriptionDisplay: "none",
    datesDisplay: "none",
    cardPadding: 0,
    imageCounter: "none",
    cardVerticalSpacing: 60,
  },
].map((theme) => {
  return {
    ...theme,
    cardHeight: theme.cardHeight
      ? theme.cardHeight
      : theme.thumbHeight + 2 * (theme.cardPadding || 0),
  };
});
