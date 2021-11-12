import * as React from "react";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import { ThemeContext, Icon } from "react-native-elements";
import { headerBaseOption, plainGoBackHeaderOption } from "../shared";
import ImageScreen from "./screens/ImageScreen";

const ImageStack = createStackNavigator();

const ImageScreens = () => {
  const { theme } = React.useContext(ThemeContext);
  return (
    <ImageStack.Navigator
      screenOptions={{ headerStyle: { elevation: 0, borderWidth: 0 } }}
      mode="modal"
    >
      <ImageStack.Screen
        options={(navigation) => {
          return {
            ...headerBaseOption({ theme }),
            headerShown: false,
            cardStyle: { backgroundColor: "transparent" },
          };
        }}
        name="ImageScreen"
        component={ImageScreen}
      />
    </ImageStack.Navigator>
  );
};

export default ImageScreens;
