import React from "react";
import { Image } from "react-native";
import { Button, ButtonProps } from "react-native-elements";
import { useTranslation } from "react-i18next";
import { googleLogo } from "../../../constants";

export type Props = Omit<ButtonProps, "title">;

const GoogleButton = (props: Props & { buttonType: "login" | "register" }) => {
  const { t } = useTranslation();

  const buttonText =
    props.buttonType == "login"
      ? t("authentication.login.googleLogin")
      : t("authentication.login.googleRegister");

  return (
    <Button
      {...props}
      title={buttonText}
      type="outline"
      buttonStyle={{ borderColor: "#aaa", borderWidth: 1, height: 54 }}
      titleStyle={{ fontSize: 24, color: "#757575" }}
      containerStyle={[
        { width: "100%", height: 54 },
        props?.containerStyle ? props?.containerStyle : {},
      ]}
      icon={
        <Image
          style={{ marginLeft: 18, width: 20, height: 20, marginRight: 8 }}
          source={{ uri: Image.resolveAssetSource(googleLogo).uri }}
        />
      }
    />
  );
};

export default GoogleButton;
