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
    labelFontSize: 18,
    descriptionDisplay: "none",
    datesFontSize: 14,
    yearOnly: true,
    cardPadding: 0,
    cardVerticalSpacing: 60,
  },
].map((theme) => {
  return {
    ...theme,
    cardHeight: theme.thumbHeight + 2 * (theme.cardPadding || 0),
  };
});
