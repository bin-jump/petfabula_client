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

const Login = () => {
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
          {t("authentication.login.title")}
        </Text>

        <Input
          placeholder={`${t("authentication.input.emailPlaceHolder")}`}
          inputStyle={{ height: 60, marginHorizontal: 0, padding: 0 }}
          leftIcon={
            <Icon
              style={{ marginRight: 3 }}
              type="antdesign"
              name="mail"
              color={theme.colors?.grey1}
              size={22}
            />
          }
          inputContainerStyle={{
            marginHorizontal: 0,
            paddingHorizontal: 16,
            backgroundColor: theme.colors?.grey5,
            borderRadius: 10,
            borderBottomColor: "transparent",
          }}
        />

        <Button
          raised
          title={t("authentication.login.loginAction")}
          containerStyle={{ marginTop: 20, width: "100%" }}
        />
        <Button
          onPress={() => {
            navigation.navigate("Signup");
          }}
          title={t("authentication.login.gotoSignup")}
          type="outline"
          containerStyle={{ marginTop: 20, width: "100%" }}
        />

        <View style={{ flexDirection: "row", marginTop: 40 }}>
          <Divider style={{ width: 50, marginTop: 10 }} />
          <Text
            style={{
              fontSize: 16,
              marginHorizontal: 12,
              color: theme.colors?.grey0,
            }}
          >
            {t("authentication.login.thirdPartyLogin")}
          </Text>
          <Divider style={{ width: 50, marginTop: 10 }} />
        </View>
        <Button
          title="Google"
          type="outline"
          containerStyle={{ marginTop: 20, width: "100%" }}
          icon={
            <Icon
              type="antdesign"
              name="google"
              color={theme.colors?.primary}
              size={22}
              style={{ marginRight: 9 }}
            />
          }
        />
      </View>
    </DismissKeyboardView>
  );
};

export default Login;
