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
        color: color.black,
        fontWeight: "bold",
        fontSize: 30,
      },
      h2Style: {
        color: color.black,
        fontWeight: "bold",
        fontSize: 26,
      },
      h3Style: {
        color: color.black,
        fontWeight: "bold",
        fontSize: 24,
      },
      h4Style: {
        color: color.black,
        fontSize: 20,
      },
      style: {
        //fontStyle: "italic",
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
  };
};
