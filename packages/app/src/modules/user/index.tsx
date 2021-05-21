import * as React from "react";
import { Platform, View } from "react-native";
import { Text, Button } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";

const User = () => {
  const navigation = useNavigation();

  return (
    <View
      style={{ height: "100%", alignItems: "center", justifyContent: "center" }}
    >
      <Text h1>User</Text>
      <Button
        title="login"
        onPress={() => {
          navigation.navigate("AuthenticaionScreen");
        }}
      />
    </View>
  );
};

export default User;
