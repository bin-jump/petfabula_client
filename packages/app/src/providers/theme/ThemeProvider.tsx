import React from "react";
import { ThemeProvider, ThemeContext } from "react-native-elements";
import { useColorScheme, AppearanceProvider } from "react-native-appearance";
import { themeLight } from "./themes/themeLight";
import { themeDark } from "./themes/themeDark";

const AppThemeProvider: React.FC<{}> = ({ children }) => {
  let colorScheme = useColorScheme();
  // const th = colorScheme == "dark" ? themeDark : themeLight;

  const th = themeLight;

  return (
    <AppearanceProvider>
      <ThemeProvider theme={th}>{children}</ThemeProvider>
    </AppearanceProvider>
  );
};

// const Inner: React.FC<{}> = ({ children }) => {
//   const { theme, updateTheme } = React.useContext(ThemeContext);

//   return <>{children}</>;
// };

export default AppThemeProvider;
