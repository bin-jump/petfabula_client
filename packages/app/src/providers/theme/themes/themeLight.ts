import { Colors } from "react-native-elements";
import { createTheme } from "./helper";

const COLORS: Partial<Colors> = {
  primary: "#fe716b",
  secondary: "#669ef6",
  greyOutline: "rgba(240,240,240, 1)",
  white: "#ffffff",
  black: "#393939",
  grey0: "#908b8b",
  grey1: "#b1b1b1",
  grey2: "#cbcbcb",
  grey3: "#d9d9d9",
  grey4: "#ededed",
  grey5: "#f5f5f5",
  danger: "red",
  error: "red",
  attention: "#fc546b",
};

export const themeLight = createTheme(COLORS);
