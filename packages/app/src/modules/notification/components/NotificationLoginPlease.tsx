import * as React from "react";
import { Platform, View } from "react-native";
import { Text, Button, useTheme, Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

const NotificationLoginPlease = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        paddingTop: 150,
        backgroundColor: theme.colors?.white,
      }}
    >
      <Icon
        type="material-icon"
        name="notifications-active"
        size={80}
        color={theme.colors?.grey3}
      />
      <Text h2 h2Style={{ marginTop: 16, marginBottom: 6 }}>
        {t("authentication.loginEncourage.title")}
      </Text>
      <Text style={{ marginBottom: 12 }}>
        {t("authentication.loginEncourage.notification")}
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
  );
};

export default NotificationLoginPlease;
