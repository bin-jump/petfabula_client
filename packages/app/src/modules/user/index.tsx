import * as React from "react";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import { ThemeContext, Icon } from "react-native-elements";
import { useTranslation } from "react-i18next";
import { headerBaseOption, plainGoBackHeaderOption } from "../shared";
import UserMain from "./screens/UserMain";
import EditAccount from "./screens/EditAccount";
import CitySelect from "./screens/CitySelect";
import Setting from "./screens/Setting";
import UserActivity from "./screens/UserActivity";

const UserStack = createStackNavigator();

const PetScreens = () => {
  const { theme } = React.useContext(ThemeContext);
  const { t } = useTranslation();

  return (
    <UserStack.Navigator
      screenOptions={{ headerStyle: { elevation: 0, borderWidth: 0 } }}
      mode="modal"
    >
      <UserStack.Screen
        options={(navigation) => {
          return {
            ...headerBaseOption({ theme }),
            headerShown: false,
            cardStyle: { backgroundColor: "transparent" },
          };
        }}
        name="UserMain"
        component={UserMain}
      />
      <UserStack.Screen
        options={(navigation) => plainGoBackHeaderOption({ navigation, theme })}
        name="EditAccount"
        component={EditAccount}
      />
      <UserStack.Screen
        options={(navigation) => ({
          ...plainGoBackHeaderOption({ navigation, theme }),
        })}
        name="CitySelect"
        component={CitySelect}
      />

      <UserStack.Screen
        options={(navigation) => ({
          ...plainGoBackHeaderOption({ navigation, theme }),
          title: t("setting.setting"),
        })}
        name="Setting"
        component={Setting}
      />
      <UserStack.Screen
        options={(navigation) => ({
          ...plainGoBackHeaderOption({ navigation, theme }),
          title: t("user.userContent"),
        })}
        name="UserActivity"
        component={UserActivity}
      />
    </UserStack.Navigator>
  );
};

export default PetScreens;
