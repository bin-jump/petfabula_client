import { FullTheme, Colors } from "react-native-elements";
import { createTheme } from "./helper";

const DARK_WHITE = "#0c0e11";

const COLORS: Partial<Colors> = {
  primary: "#fe4d4c",
  secondary: "#ffeed6",
  greyOutline: "rgba(240,240,240, 1)",
  white: DARK_WHITE,
  black: "#dee3ea",
  grey0: "#8a8d94",
  grey1: "#69778c",
  grey2: "#484d55",
  grey3: "#3f444e",
  grey4: "#252c37",
  grey5: "#151a21",
  danger: "red",
  error: "red",
};

export const themeDark = createTheme(COLORS);

export const isDarkMode = (color?: any) => {
  return color?.white == DARK_WHITE;
};
