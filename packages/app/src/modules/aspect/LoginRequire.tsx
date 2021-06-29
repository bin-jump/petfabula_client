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
        <View
          style={{
            width: 280,
            height: 240,
            backgroundColor: theme.colors?.white,
            borderRadius: 8,
            padding: 14,
            justifyContent: "space-between",
            paddingVertical: 30,
          }}
        >
          <Text
            style={{ textAlign: "center", fontSize: 24, fontWeight: "bold" }}
          >
            {t("aspect.loginToContinue")}
          </Text>
          {/* <Icon
            type="font-awesome"
            name="login"
            color={theme.colors?.primary}
            size={80}
          /> */}
          <Button
            onPress={() => {
              navigation.goBack();
              navigation.navigate("AuthenticaionScreen");
            }}
            title={t("aspect.gotoLogin")}
            titleStyle={{ fontWeight: "bold" }}
            raised
          />
          {/* <Button
            onPress={() => {
              navigation.goBack();
            }}
            type="outline"
            title={t("aspect.gotoLogin")}
            titleStyle={{ fontWeight: "bold" }}
          /> */}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default LoginRequire;
