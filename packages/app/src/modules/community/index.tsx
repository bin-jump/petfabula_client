import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ThemeContext, Icon } from "react-native-elements";
import { headerBaseOption, plainGoBackHeaderOption } from "../shared";
import Community from "./screens/Community";

const CommunityStack = createStackNavigator();

const CommunityScreens = () => {
  const { theme } = React.useContext(ThemeContext);
  return (
    <CommunityStack.Navigator
      screenOptions={{ headerStyle: { elevation: 0, borderWidth: 0 } }}
      mode="modal"
    >
      <CommunityStack.Screen
        options={(navigation) => {
          return {
            ...headerBaseOption({ theme }),
            headerShown: false,
            cardStyle: { backgroundColor: "transparent" },
          };
        }}
        name="Community"
        component={Community}
      />
      {/* <CommunityStack.Screen
        options={(navigation) => plainGoBackHeaderOption({ navigation, theme })}
        name="CreatePost"
        component={CreatePost}
      /> */}
    </CommunityStack.Navigator>
  );
};

export default CommunityScreens;
