import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ThemeContext, Icon } from "react-native-elements";
import { headerBaseOption, plainGoBackHeaderOption } from "../shared";
import Login from "./screens/Login";
import Signup from "./screens/Signup";
import SignupVerification from "./screens/SignupVerification";
import LoginVerification from "./screens/LoginVerification";

const AuthStack = createStackNavigator();

const AuthenticationScreen = () => {
  const { theme } = React.useContext(ThemeContext);
  return (
    <AuthStack.Navigator
      screenOptions={{ headerStyle: { elevation: 0, borderWidth: 0 } }}
    >
      <AuthStack.Screen
        options={(navigation) => {
          return {
            ...headerBaseOption({ theme }),
            title: "",
            headerLeft: () => {
              return (
                <Icon
                  containerStyle={{ marginLeft: 16 }}
                  type="antdesign"
                  onPress={() => navigation.navigation.goBack()}
                  name="close"
                  size={24}
                  color={theme.colors?.black}
                />
              );
            },
          };
        }}
        name="Login"
        component={Login}
      />
      <AuthStack.Screen
        options={(navigation) => plainGoBackHeaderOption({ navigation, theme })}
        name="LoginVerification"
        component={LoginVerification}
      />
      <AuthStack.Screen
        options={(navigation) => plainGoBackHeaderOption({ navigation, theme })}
        name="Signup"
        component={Signup}
      />
      <AuthStack.Screen
        options={(navigation) => plainGoBackHeaderOption({ navigation, theme })}
        name="SignupVerification"
        component={SignupVerification}
      />
    </AuthStack.Navigator>
  );
};

export default AuthenticationScreen;
