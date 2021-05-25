import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ThemeContext, Icon } from "react-native-elements";
import { headerBaseOption, plainGoBackHeaderOption } from "../shared";
import CreateNew from "./screens/CreateNew";
import CreatePost from "./screens/CreatePost";
import CreateQuestion from "./screens/CreateQuestion";

const CreateNewStack = createStackNavigator();

const CreateNewScreens = () => {
  const { theme } = React.useContext(ThemeContext);
  return (
    <CreateNewStack.Navigator
      screenOptions={{ headerStyle: { elevation: 0, borderWidth: 0 } }}
      mode="modal"
    >
      <CreateNewStack.Screen
        options={(navigation) => {
          return {
            ...headerBaseOption({ theme }),
            headerShown: false,
            cardStyle: { backgroundColor: "transparent" },
          };
        }}
        name="CreateNew"
        component={CreateNew}
      />
      <CreateNewStack.Screen
        options={(navigation) => plainGoBackHeaderOption({ navigation, theme })}
        name="CreatePost"
        component={CreatePost}
      />
      <CreateNewStack.Screen
        options={(navigation) => plainGoBackHeaderOption({ navigation, theme })}
        name="CreateQuestion"
        component={CreateQuestion}
      />
    </CreateNewStack.Navigator>
  );
};

export default CreateNewScreens;
