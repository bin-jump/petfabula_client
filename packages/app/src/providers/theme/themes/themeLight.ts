import { Colors } from "react-native-elements";
import { createTheme } from "./helper";

const COLORS: Partial<Colors> = {
  primary: "#fd726c",
  secondary: "#ffeed6",
  greyOutline: "rgba(240,240,240, 1)",
  white: "#ffffff",
  black: "#343434",
  grey0: "#8b8b8b",
  grey1: "#b3b3b3",
  grey2: "#cbcbcb",
  grey3: "#d9d9d9",
  grey4: "#e8e8e8",
  grey5: "#f5f5f5",
};

export const themeLight = createTheme(COLORS);
