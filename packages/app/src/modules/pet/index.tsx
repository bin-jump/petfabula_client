import * as React from "react";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import { ThemeContext, Icon } from "react-native-elements";
import { useTranslation } from "react-i18next";
import { headerBaseOption, plainGoBackHeaderOption } from "../shared";
import PetMain from "./screens/PetMain";
import CreatePet from "./screens/CreatePet";
import PetBreedSelect from "./screens/PetBreedSelect";

const PetStack = createStackNavigator();

const PetScreens = () => {
  const { theme } = React.useContext(ThemeContext);
  const { t } = useTranslation();

  return (
    <PetStack.Navigator
      screenOptions={{ headerStyle: { elevation: 0, borderWidth: 0 } }}
      mode="modal"
    >
      <PetStack.Screen
        options={(navigation) => {
          return {
            ...headerBaseOption({ theme }),
            headerShown: false,
            cardStyle: { backgroundColor: "transparent" },
          };
        }}
        name="PetMain"
        component={PetMain}
      />

      <PetStack.Screen
        options={(navigation) => ({
          ...plainGoBackHeaderOption({ navigation, theme }),
          headerStyle: {
            shadowColor: theme.colors?.grey2,
            shadowOffset: { width: 2, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 3,
            elevation: 2,
          },
          // headerShown: false,
          title: t("pet.createPet"),
        })}
        name="CreatePet"
        component={CreatePet}
      />

      <PetStack.Screen
        options={(navigation) => ({
          ...plainGoBackHeaderOption({ navigation, theme }),
        })}
        name="PetBreedSelect"
        component={PetBreedSelect}
      />
    </PetStack.Navigator>
  );
};

export default PetScreens;
