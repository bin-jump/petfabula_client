import * as React from "react";
import { View } from "react-native";
import { Text, ThemeContext, Button, Input, Icon } from "react-native-elements";
import { DismissKeyboardView } from "../../shared";

const LoginScreen = () => {
  const { theme } = React.useContext(ThemeContext);

  return (
    <DismissKeyboardView>
      <View
        style={{
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.colors?.white,
        }}
      >
        <Text h1>LoginScreen</Text>
        <Input
          inputStyle={{ height: 60 }}
          leftIcon={
            <Icon type="antdesign" name="user" color={theme.colors?.grey2} />
          }
          inputContainerStyle={{
            paddingHorizontal: 9,
            backgroundColor: theme.colors?.grey5,
            borderRadius: 10,
            borderBottomColor: "transparent",
          }}
        />
        <Button title="Login" containerStyle={{ width: "100%" }} />
      </View>
    </DismissKeyboardView>
  );
};

export default LoginScreen;
