import React from "react";
import { Image, Platform } from "react-native";
import { Button, ButtonProps } from "react-native-elements";
import { useTranslation } from "react-i18next";
import { appleLogoWhite } from "../../../constants";

export type Props = Omit<ButtonProps, "title">;

const AppleButton = (props: Props & { buttonType: "login" | "register" }) => {
  const { t } = useTranslation();

  const buttonText =
    props.buttonType == "login"
      ? t("authentication.login.appleLogin")
      : t("authentication.login.appleRegister");

  return (
    <>
      {Platform.OS == "ios" && (
        <Button
          {...props}
          title={buttonText}
          type="clear"
          containerStyle={[
            {
              width: "100%",
              backgroundColor: "#000",
              height: 56,
            },
            props?.containerStyle ? props?.containerStyle : {},
          ]}
          buttonStyle={{ height: 56 }}
          titleStyle={{ color: "#fff", fontSize: 24 }}
          icon={
            <Image
              style={{ width: 42, height: 42 }}
              source={{ uri: Image.resolveAssetSource(appleLogoWhite).uri }}
            />
          }
        />
      )}
    </>
  );
};

export default AppleButton;
