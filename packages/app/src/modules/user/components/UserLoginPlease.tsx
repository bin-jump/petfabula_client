import * as React from "react";
import { Platform, View } from "react-native";
import { Text, Button, useTheme, Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import {
  Avatar,
  toAge,
  toAgeMonth,
  daysTillNow,
  useFirstFocusEffect,
} from "../../shared";
import { useTranslation } from "react-i18next";
import SettingContent from "./SettingContent";

const UserLoginPlease = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors?.white,
      }}
    >
      <View style={{ alignItems: "flex-end", paddingHorizontal: 24 }}>
        <Icon
          onPress={() => {
            navigation.navigate("AnonymousSetting");
          }}
          type="ionicon"
          name="ios-settings-outline"
          size={32}
          color={theme.colors?.black}
        />
      </View>

      <View
        style={{
          paddingTop: 120,
          backgroundColor: theme.colors?.white,
          height: 400,
        }}
      >
        <Icon
          type="font-awesome"
          name="user-circle-o"
          size={88}
          color={theme.colors?.grey3}
        />

        <View style={{ alignItems: "center" }}>
          <Text h2 h2Style={{ marginTop: 16 }}>
            {t("authentication.loginEncourage.title")}
          </Text>
          <Text style={{ marginBottom: 12 }}>
            {t("authentication.loginEncourage.user")}
          </Text>

          <Button
            raised
            style={{ width: 150 }}
            title={t("authentication.login.gotoLogin")}
            onPress={() => {
              navigation.navigate("AuthenticaionScreen");
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default UserLoginPlease;
