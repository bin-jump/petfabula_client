import React from "react";
import { Text, StatusBar, Button, StyleSheet } from "react-native";
import { ThemeProvider, useTheme } from "react-native-elements";
import { useColorScheme, AppearanceProvider } from "react-native-appearance";
import { themeLight } from "./themes/themeLight";
import { themeDark } from "./themes/themeDark";

const AppThemeProvider: React.FC<{}> = ({ children }) => {
  let colorScheme = useColorScheme();
  // const th = colorScheme == "dark" ? themeDark : themeLight;

  const th = themeLight;

  return (
    <AppearanceProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#6a51ae" />

      <ThemeProvider theme={th}>{children}</ThemeProvider>
    </AppearanceProvider>
  );
};

// const Inner: React.FC<{}> = ({ children }) => {
//   const { theme, updateTheme } = useTheme();

//   return <>{children}</>;
// };

export default AppThemeProvider;
