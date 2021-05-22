import * as React from "react";
import { View } from "react-native";
import { Text, ThemeContext } from "react-native-elements";
import { useTranslation } from "react-i18next";
import { useUserAgreement } from "@petfabula/common";

const UserAgreement = () => {
  const { t } = useTranslation();
  const { theme } = React.useContext(ThemeContext);
  const { getUserAgreement, userAgreement, pending, error } =
    useUserAgreement();

  React.useEffect(() => {
    getUserAgreement();
  }, []);

  return (
    <View
      style={{
        height: "100%",
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: theme.colors?.white,
        paddingHorizontal: 18,
      }}
    >
      {userAgreement ? (
        <View>
          <Text h2 style={{ marginBottom: 30 }}>
            {userAgreement.title}
          </Text>
          <Text h4 style={{ marginBottom: 20 }}>
            {userAgreement.content}
          </Text>
        </View>
      ) : (
        <Text h4>{"laoding..."}</Text>
      )}
    </View>
  );
};

export default UserAgreement;
