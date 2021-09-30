import * as React from "react";
import { Platform, View } from "react-native";
import { Text, Button, useTheme, Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

const PetLoginPlease = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <View
      style={{
        flex: 1,
        paddingTop: 150,
        alignItems: "center",
        // justifyContent: "center",
        backgroundColor: theme.colors?.white,
      }}
    >
      <Icon
        type="font-awesome-5"
        name="earlybirds"
        size={80}
        color={theme.colors?.grey3}
      />
      <Text h2 h2Style={{ marginTop: 16, marginBottom: 6 }}>
        {t("authentication.loginEncourage.title")}
      </Text>
      <Text style={{ marginBottom: 12 }}>
        {t("authentication.loginEncourage.pet")}
      </Text>
      {/* <Text>Login to record pets</Text> */}
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

export default PetLoginPlease;
