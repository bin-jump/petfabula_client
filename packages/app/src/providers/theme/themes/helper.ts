import { FullTheme, Colors } from "react-native-elements";

export const createTheme = (color: Partial<Colors>): Partial<FullTheme> => {
  return {
    colors: color,
    Button: {
      containerStyle: {
        height: 52,
      },
      buttonStyle: {
        height: 52,
      },
    },
    Input: {
      inputContainerStyle: {
        borderBottomColor: color.greyOutline,
      },
      placeholderTextColor: color.grey2,
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
  };
};
