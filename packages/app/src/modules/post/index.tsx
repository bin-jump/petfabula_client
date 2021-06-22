import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ThemeContext, Icon } from "react-native-elements";
import { headerBaseOption, plainGoBackHeaderOption } from "../shared";
import Posts from "./screens/Posts";
import Search from "./screens/Search";

const PostsStack = createStackNavigator();

const PostScreens = () => {
  const { theme } = React.useContext(ThemeContext);
  return (
    <PostsStack.Navigator
      screenOptions={{ headerStyle: { elevation: 0, borderWidth: 0 } }}
      mode="modal"
    >
      <PostsStack.Screen
        options={(navigation) => {
          return {
            ...headerBaseOption({ theme }),
            headerShown: false,
            cardStyle: { backgroundColor: "transparent" },
          };
        }}
        name="Posts"
        component={Posts}
      />
      <PostsStack.Screen
        options={(navigation) => {
          return {
            ...headerBaseOption({ theme }),
            headerShown: false,
          };
        }}
        name="Search"
        component={Search}
      />
    </PostsStack.Navigator>
  );
};

export default PostScreens;
