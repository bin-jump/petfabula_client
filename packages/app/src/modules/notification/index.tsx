import * as React from "react";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import { ThemeContext, Icon } from "react-native-elements";
import { headerBaseOption, plainGoBackHeaderOption } from "../shared";
import NotificationMain from "./screens/NotificationMain";

const NotificationStack = createStackNavigator();

const NotificationScreens = () => {
  const { theme } = React.useContext(ThemeContext);
  return (
    <NotificationStack.Navigator
      screenOptions={{ headerStyle: { elevation: 0, borderWidth: 0 } }}
      mode="modal"
    >
      <NotificationStack.Screen
        options={(navigation) => {
          return {
            ...headerBaseOption({ theme }),
            headerShown: false,
            cardStyle: { backgroundColor: "transparent" },
          };
        }}
        name="NotificationMain"
        component={NotificationMain}
      />
    </NotificationStack.Navigator>
  );
};

export default NotificationScreens;
