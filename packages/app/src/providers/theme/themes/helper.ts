import { FullTheme, Colors } from "react-native-elements";

export const createTheme = (color: Partial<Colors>): Partial<FullTheme> => {
  return {
    colors: color,
    Button: {
      containerStyle: {
        borderRadius: 6,
        height: 56,
      },
      buttonStyle: {
        borderRadius: 6,
        height: 56,
      },
      titleStyle: {
        fontSize: 22,
      },
    },
    Input: {
      containerStyle: { paddingHorizontal: 0 },
      inputContainerStyle: {
        borderBottomColor: color.greyOutline,
      },
      placeholderTextColor: color.grey1,
    },
    Text: {
      h1Style: {
        lineHeight: 30,
        color: color.black,
        fontWeight: "bold",
        fontSize: 26,
      },
      h2Style: {
        lineHeight: 24,
        color: color.black,
        fontWeight: "bold",
        fontSize: 22,
      },
      h3Style: {
        lineHeight: 24,
        color: color.black,
        fontWeight: "bold",
        fontSize: 20,
      },
      h4Style: {
        lineHeight: 22,
        color: color.black,
        fontWeight: "bold",
        fontSize: 18,
      },
      style: {
        //fontStyle: "italic",
        lineHeight: 22,
        fontSize: 16,
        color: color.black,
      },
    },
    Icon: {
      color: color.white,
      reverseColor: color.disabled,
    },
    ListItemTitle: {
      style: {
        color: color.black,
      },
    },
    ListItemSubtitle: {
      style: {
        color: color.grey1,
      },
    },
    Divider: {
      style: {
        backgroundColor: color.grey3,
      },
    },
  };
};
