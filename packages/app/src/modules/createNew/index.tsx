import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useTheme, Icon } from "react-native-elements";
import { useTranslation } from "react-i18next";
import { headerBaseOption, plainGoBackHeaderOption } from "../shared";
import CreateNew from "./screens/CreateNew";
import CreatePost from "./screens/CreatePost";
import CreateQuestion from "./screens/CreateQuestion";
import ImageSelect from "./screens/ImageSelect";
import PostTopicSelect from "./screens/PostTopicSelect";
import CreateAnswer from "./screens/CreateAnswer";
import PetSelect from "./screens/PetSelect";

import CreatePet from "./screens/CreatePet";
import PetBreedSelect from "./screens/PetBreedSelect";
import CreatePetFeedRecord from "./screens/CreatePetFeedRecord";
import CreatePetWeightRecord from "./screens/CreatePetWeightRecord";
import CreatePetDisorderRecord from "./screens/CreatePetDisorderRecord";
import SelectPetEventType from "./screens/SelectPetEventType";
import CreatePetEventRecord from "./screens/CreatePetEventRecord";
import CreatePetMedicalRecord from "./screens/CreatePetMedicalRecord";
import CreateReport from "./screens/CreateReport";
import CreateFeedback from "./screens/CreateFeedback";

const CreateNewStack = createStackNavigator();
const forFade = ({ current }: { current: any }) => ({
  cardStyle: {
    opacity: current.progress,
  },
});
const CreateNewScreens = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();

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
      <CreateNewStack.Screen
        options={(navigation) => plainGoBackHeaderOption({ navigation, theme })}
        name="ImageSelect"
        component={ImageSelect}
      />
      <CreateNewStack.Screen
        options={(navigation) => ({
          ...plainGoBackHeaderOption({ navigation, theme }),
          title: t("createNew.topicSelectTitle"),
        })}
        name="PostTopicSelect"
        component={PostTopicSelect}
      />
      <CreateNewStack.Screen
        options={(navigation) => plainGoBackHeaderOption({ navigation, theme })}
        name="CreateAnswer"
        component={CreateAnswer}
      />
      <CreateNewStack.Screen
        options={(navigation) => ({
          ...plainGoBackHeaderOption({ navigation, theme }),
          title: t("pet.petSelect"),
        })}
        name="PetSelect"
        component={PetSelect}
      />

      {/* pet  */}
      <CreateNewStack.Screen
        options={(navigation) => ({
          ...plainGoBackHeaderOption({ navigation, theme }),
          headerStyle: {
            shadowColor: theme.colors?.grey2,
            shadowOffset: { width: 2, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 3,
            elevation: 2,
          },
          title: t("pet.createPet"),
        })}
        name="CreatePet"
        component={CreatePet}
      />
      <CreateNewStack.Screen
        options={(navigation) => ({
          ...plainGoBackHeaderOption({ navigation, theme }),
        })}
        name="PetBreedSelect"
        component={PetBreedSelect}
      />
      <CreateNewStack.Screen
        options={(navigation) => ({
          ...plainGoBackHeaderOption({ navigation, theme }),
          headerShown: false,
          cardStyle: { backgroundColor: "transparent" },
          cardStyleInterpolator: forFade,
        })}
        name="CreatePetFeedRecord"
        component={CreatePetFeedRecord}
      />
      <CreateNewStack.Screen
        options={(navigation) => ({
          ...plainGoBackHeaderOption({ navigation, theme }),
          headerShown: false,
          cardStyle: { backgroundColor: "transparent" },
          cardStyleInterpolator: forFade,
        })}
        name="CreatePetWeightRecord"
        component={CreatePetWeightRecord}
      />
      <CreateNewStack.Screen
        options={(navigation) => ({
          ...plainGoBackHeaderOption({ navigation, theme }),
          headerShown: false,
          cardStyle: { backgroundColor: "transparent" },
          cardStyleInterpolator: forFade,
        })}
        name="CreatePetDisorderRecord"
        component={CreatePetDisorderRecord}
      />
      <CreateNewStack.Screen
        options={(navigation) => ({
          ...plainGoBackHeaderOption({ navigation, theme }),
          headerShown: false,
          cardStyle: { backgroundColor: "transparent" },
          cardStyleInterpolator: forFade,
        })}
        name="SelectPetEventType"
        component={SelectPetEventType}
      />
      <CreateNewStack.Screen
        options={(navigation) => ({
          ...plainGoBackHeaderOption({ navigation, theme }),
          headerShown: false,
          cardStyle: { backgroundColor: "transparent" },
          cardStyleInterpolator: forFade,
        })}
        name="CreatePetEventRecord"
        component={CreatePetEventRecord}
      />
      <CreateNewStack.Screen
        options={(navigation) => ({
          ...plainGoBackHeaderOption({ navigation, theme }),
          headerShown: false,
          cardStyle: { backgroundColor: "transparent" },
          cardStyleInterpolator: forFade,
        })}
        name="CreatePetMedicalRecord"
        component={CreatePetMedicalRecord}
      />

      <CreateNewStack.Screen
        options={(navigation) => ({
          ...plainGoBackHeaderOption({ navigation, theme }),
          title: t("createNew.reportTitle"),
        })}
        name="CreateReport"
        component={CreateReport}
      />

      <CreateNewStack.Screen
        options={(navigation) => ({
          ...plainGoBackHeaderOption({ navigation, theme }),
          title: t("createNew.feedbackTitle"),
        })}
        name="CreateFeedback"
        component={CreateFeedback}
      />
    </CreateNewStack.Navigator>
  );
};

export default CreateNewScreens;
