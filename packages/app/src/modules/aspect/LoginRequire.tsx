import React, { useEffect, useState, useCallback } from "react";
import { View, TouchableWithoutFeedback } from "react-native";
import { Text, Button, Overlay, Icon, useTheme } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

const LoginRequire = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        navigation.goBack();
      }}
    >
      <View
        style={{
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TouchableWithoutFeedback>
          <View
            style={{
              width: 280,
              height: 270,
              backgroundColor: theme.colors?.white,
              borderRadius: 16,
              padding: 18,
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: 24,
              paddingTop: 10,
            }}
          >
            <View style={{ width: "100%", alignItems: "flex-end" }}>
              <Icon
                onPress={() => {
                  navigation.goBack();
                }}
                type="material-community"
                name="close-thick"
                size={28}
                color={theme.colors?.grey2}
              />
            </View>

            <Icon
              type="material-community-icon"
              name="login"
              color={theme.colors?.grey2}
              size={70}
            />

            <Text h3>{t("authentication.loginEncourage.title")}</Text>
            <Text>{t("authentication.loginEncourage.loginPopup")}</Text>

            <View style={{ width: "100%" }}>
              <Button
                style={{ flex: 1 }}
                onPress={() => {
                  navigation.goBack();
                  navigation.navigate("AuthenticaionScreen");
                }}
                title={t("authentication.login.gotoLogin")}
                raised
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default LoginRequire;
