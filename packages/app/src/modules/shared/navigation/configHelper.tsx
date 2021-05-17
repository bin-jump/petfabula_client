import React from "react";
import { ThemeContext, Icon, Text, FullTheme } from "react-native-elements";

const noBorderStyle = {
  borderBottomWidth: 0,
  borderColor: "transparent",
  elevation: 0,
  borderWidth: 0,
  shadowColor: "transparent",
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
    headerStyle: {
      ...{ backgroundColor: theme ? theme.colors?.white : "" },
    },
    headerLeft: () => {
      return (
        <Icon
          style={{ marginLeft: 15 }}
          type="antdesign"
          onPress={() => navigation.navigation.goBack()}
          name="arrowleft"
          size={24}
          color={theme.colors?.black}
        />
      );
    },
  };
};
