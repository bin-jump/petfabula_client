import { FullTheme, Colors } from "react-native-elements";
import { createTheme } from "./helper";

const DARK_WHITE = "#151a21";

const COLORS: Partial<Colors> = {
  primary: "#57342d",
  secondary: "#ffeed6",
  greyOutline: "rgba(240,240,240, 1)",
  white: DARK_WHITE,
  black: "#dee3ea",
  grey0: "#999999",
  grey1: "#b2b2b2",
  grey2: "#d0d0cf",
  grey3: "#dfdfdf",
  grey4: "#e6e6e6",
  grey5: "#0c0e11",
  danger: "red",
  error: "red",
};

export const themeDark = createTheme(COLORS);

export const isDarkMode = (color?: any) => {
  return color?.white == DARK_WHITE;
};
