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
              width: 290,
              height: 330,
              backgroundColor: theme.colors?.white,
              borderRadius: 16,
              padding: 18,
              justifyContent: "space-between",
              alignItems: "center",
              paddingBottom: 16,
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

            <View
              style={{
                borderColor: theme.colors?.grey2,
                borderWidth: 3,
                padding: 8,
                borderRadius: 12,
              }}
            >
              <Icon
                type="material-community-icon"
                name="login"
                color={theme.colors?.grey2}
                size={38}
              />
            </View>

            <Text h3>{t("authentication.loginEncourage.title")}</Text>
            <Text style={{ color: theme.colors?.grey0 }}>
              {t("authentication.loginEncourage.loginPopup")}
            </Text>

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

              <Button
                containerStyle={{ marginTop: 12 }}
                style={{ flex: 1 }}
                onPress={() => {
                  navigation.goBack();
                }}
                title={t("common.cancel")}
                type="outline"
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default LoginRequire;
