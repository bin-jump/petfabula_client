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

const CreateQuestion = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { t } = useTranslation();

  return (
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
        <Text>CreateQuestion</Text>
        <Button
          title="go to main"
          onPress={() => {
            navigation.navigate("TabScreen");
          }}
        />
      </View>
    </View>
  );
};

export default CreateQuestion;
