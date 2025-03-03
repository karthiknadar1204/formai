export const defaultPrimaryColor = "#673ab7";
export const defaultBackgroundColor = "#e6f3ff";

export const allBlockLayouts = ["RowLayout", "ColumnLayout", "GridLayout"];

export const fontWeightClass = {
  normal: "font-normal",
  bold: "font-bold",
  bolder: "font-extrabold", // Tailwind uses 'font-extrabold' for 'bolder'
  lighter: "font-extralight", // Tailwind uses 'font-light' for 'lighter'
};

export const fontSizeClass = {
  small: "text-sm", // Tailwind class for small font
  medium: "text-base", // Tailwind class for medium font
  large: "text-lg", // Tailwind class for large font
  "x-large": "text-xl", // Tailwind class for extra large font
  "2x-large": "text-2xl",
  "4x-large": "text-4xl",

};

export const FIELD_BLOCKS = [
  "TextField",
  "TextArea",
  "RadioSelect",
  "StarRating",
  "Media",
  "Calendar",
  "Select",
] as const;

