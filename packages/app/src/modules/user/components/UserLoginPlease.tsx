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

const UserLoginPlease = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();

  return (
    <View
      style={{
        flex: 1,
        // justifyContent: "center",
        backgroundColor: theme.colors?.white,
      }}
    >
      <View
        style={{
          paddingTop: 8,
          backgroundColor: theme.colors?.white,
          // shadowColor: theme.colors?.grey3,
          // shadowOffset: { width: 2, height: 4 },
          // shadowOpacity: 0.3,
          // elevation: 2,
          // shadowRadius: 6,
        }}
      >
        <View
          style={{
            height: 40,
            justifyContent: "center",
            alignItems: "flex-end",
            backgroundColor: theme.colors?.white,
            paddingHorizontal: 16,
          }}
        />
        <View style={{ flexDirection: "row", paddingHorizontal: 30 }}>
          <Avatar source={{ uri: undefined }} size={80} />
          <View style={{ marginLeft: 20, justifyContent: "center" }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text h1 style={{ marginRight: 6 }}>
                {`unlogin`}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={{ alignItems: "center" }}>
        <Text h1>Login</Text>
        <Button
          style={{ width: 200 }}
          title="login"
          onPress={() => {
            navigation.navigate("AuthenticaionScreen");
          }}
        />
      </View>
    </View>
  );
};

export default UserLoginPlease;
