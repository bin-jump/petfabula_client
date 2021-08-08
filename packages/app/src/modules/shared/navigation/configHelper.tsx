import React from "react";
import { Platform, View } from "react-native";
import { Icon, FullTheme } from "react-native-elements";

const noBorderStyle = {
  borderBottomWidth: 0,
  borderColor: "transparent",
  elevation: 0,
  borderWidth: 0,
  shadowColor: "transparent",
};

export const goBackIcon = ({
  theme,
  navigation,
}: {
  theme: Partial<FullTheme>;
  navigation: any;
}) => {
  return (
    <Icon
      containerStyle={{ marginLeft: 16 }}
      type="entypo"
      onPress={() => navigation.goBack()}
      name="chevron-thin-left"
      size={24}
      color={theme.colors?.black}
    />
  );
};

export const headerBaseOption = ({ theme }: { theme: Partial<FullTheme> }) => {
  return {
    headerStyle: {
      ...noBorderStyle,
      backgroundColor: theme ? theme.colors?.white : "",
    },
  };
};

export const plainGoBackHeaderOption = ({
  navigation,
  title,
  theme,
}: {
  navigation: any;
  title?: string;
  theme: Partial<FullTheme>;
}) => {
  return {
    ...headerBaseOption({ theme }),
    title: title ? title : "",
    headerLeft: () => {
      return (
        <Icon
          containerStyle={{ marginLeft: 16 }}
          type="entypo"
          onPress={() => navigation.navigation.goBack()}
          name="chevron-thin-left"
          size={24}
          color={theme.colors?.black}
        />
      );
    },
  };
};
