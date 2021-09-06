import * as React from "react";
import { Platform, View } from "react-native";
import { Text, Button, useTheme } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";

const PetLoginPlease = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.colors?.white,
      }}
    >
      <Text h2>Login</Text>
      <Text>Login to record pets</Text>
      <Button
        title="login"
        onPress={() => {
          navigation.navigate("AuthenticaionScreen");
        }}
      />
    </View>
  );
};

export default PetLoginPlease;
