import * as React from "react";
import { View } from "react-native";
import {
  Text,
  ThemeContext,
  Button,
  Input,
  Icon,
  Divider,
} from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { DismissKeyboardView } from "../../shared";

const Signup = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const { theme } = React.useContext(ThemeContext);

  return (
    <DismissKeyboardView>
      <View
        style={{
          height: "100%",
          alignItems: "center",
          justifyContent: "flex-start",
          backgroundColor: theme.colors?.white,
          paddingHorizontal: 30,
        }}
      >
        <Text h1 style={{ marginBottom: 45 }}>
          {t("authentication.signup.title")}
        </Text>
      </View>
    </DismissKeyboardView>
  );
};

export default Signup;
