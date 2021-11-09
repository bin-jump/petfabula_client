import React from "react";
import {
  ActivityIndicator as RNActivityIndicator,
  ActivityIndicatorProps,
} from "react-native";
import { useTheme } from "react-native-elements";

const ActivityIndicator = (props: ActivityIndicatorProps) => {
  const { theme } = useTheme();
  return <RNActivityIndicator color={theme.colors?.grey3} {...props} />;
};

export default ActivityIndicator;
