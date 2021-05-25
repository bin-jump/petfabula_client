import * as React from "react";
import { View, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import {
  Text,
  ThemeContext,
  Button,
  Icon,
  Divider,
  useTheme,
} from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

const ActionButton = ({
  label,
  icon,
  action,
}: {
  label: string;
  icon: { name: string; type: string; size: number };
  action: () => void;
}) => {
  const { theme } = useTheme();
  return (
    <TouchableOpacity
      onPress={() => {
        action();
      }}
      style={{ marginHorizontal: 16, marginVertical: 18 }}
    >
      <View
        style={{
          width: 100,
          height: 100,
          backgroundColor: theme.colors?.black,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 9,
          elevation: 3,
          shadowOffset: {
            width: 4,
            height: 2,
          },
          shadowOpacity: 0.8,
          shadowRadius: 3,
          shadowColor: theme.colors?.black,
        }}
      >
        <Icon
          type={icon.type}
          name={icon.name}
          color={theme.colors?.primary}
          size={icon.size}
        />
        <Text h4 h4Style={{ marginTop: 9, color: theme.colors?.white }}>
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
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <View style={{ flexDirection: "row" }}>
            <ActionButton
              label={t("createNew.createPost")}
              icon={{ name: "pencil-square-o", type: "font-awesome", size: 50 }}
              action={() => {
                navigation.navigate("CreatePost");
              }}
            />
            <ActionButton
              label={t("createNew.createQuestion")}
              icon={{
                name: "comment-question-outline",
                type: "material-community",
                size: 50,
              }}
              action={() => {
                navigation.navigate("CreateQuestion");
              }}
            />
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CreateNew;
