import * as React from "react";
import { View, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { Text, Icon, useTheme } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import ActionIcon from "../components/ActionIcon";

const ActionButton = ({
  label,
  color,
  icon,
  action,
}: {
  label: string;
  color: string;
  icon: { name: string; type: string; size: number };
  action: () => void;
}) => {
  const { theme } = useTheme();
  return (
    <TouchableOpacity
      onPress={() => {
        action();
      }}
      style={{ marginRight: 30 }}
    >
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            backgroundColor: color,
            width: 54,
            height: 54,
            borderRadius: 10,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Icon {...icon} color={theme.colors?.white} />
        </View>
        <Text
          style={{
            marginTop: 6,
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const RecordButton = ({
  label,
  type,
  name,
  backgroundColor,
  iconColor,
  onPress,
}: {
  label: string;
  type: string;
  name: string;
  backgroundColor: string;
  iconColor: string;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={{ justifyContent: "center" }}>
        <ActionIcon
          onPress={onPress}
          type={type}
          name={name}
          size={26}
          backgroundColor={backgroundColor}
          iconColor={iconColor}
        />
        <Text style={{ textAlign: "center", fontWeight: "bold", marginTop: 4 }}>
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const CreateNew = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { t } = useTranslation();

  return (
    <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
      <View
        style={{
          height: "100%",
          width: "100%",
          backgroundColor: "transparent",
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: 90,
          paddingHorizontal: 16,
        }}
      >
        <TouchableWithoutFeedback>
          <View
            style={{
              height: 240,
              width: "100%",
              backgroundColor: theme.colors?.white,
              padding: 20,
              paddingTop: 30,
              borderRadius: 12,
              elevation: 3,
              shadowOffset: {
                width: 4,
                height: 2,
              },
              shadowOpacity: 0.8,
              shadowRadius: 7,
              shadowColor: theme.colors?.grey2,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <ActionButton
                color="#96a0e9"
                label={t("createNew.createPost")}
                icon={{ size: 36, type: "material-community", name: "feather" }}
                action={() => {
                  navigation.navigate("CreatePost");
                }}
              />

              <ActionButton
                color="#fedd93"
                label={t("createNew.createQuestion")}
                icon={{
                  size: 36,
                  type: "material-community",
                  name: "comment-question-outline",
                }}
                action={() => {
                  navigation.navigate("CreateQuestion");
                }}
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                marginTop: 30,
                justifyContent: "space-between",
              }}
            >
              <RecordButton
                type="material-community"
                name="silverware-fork-knife"
                backgroundColor="#fcead0"
                iconColor="#febe8a"
                label={t("pet.action.food")}
                onPress={() => {
                  navigation.navigate("CreateFeedRecord");
                }}
              />

              <RecordButton
                type="material-community"
                name="scale"
                backgroundColor="#e6f3ff"
                iconColor="#94afef"
                label={t("pet.action.weight")}
                onPress={() => {
                  navigation.navigate("CreateWeightRecord");
                }}
              />

              <RecordButton
                type="material"
                name="mood-bad"
                backgroundColor="#f4e9e0"
                iconColor="#d56940"
                label={t("pet.action.disorder")}
                onPress={() => {
                  navigation.navigate("CreateDisorderRecord");
                }}
              />

              <RecordButton
                type="material"
                name="event-note"
                backgroundColor="#d8f3ff"
                iconColor="#68bbff"
                label={t("pet.action.event")}
                onPress={() => {
                  navigation.navigate("SelectPetEventType");
                }}
              />

              <RecordButton
                type="material-community"
                name="hospital-box-outline"
                backgroundColor="#fcdcd2"
                iconColor="#f15e54"
                label={t("pet.action.medical")}
                onPress={() => {
                  navigation.navigate("CreateMedicalRecord");
                }}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CreateNew;
