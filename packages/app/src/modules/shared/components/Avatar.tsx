import React from "react";
import {
  ThemeContext,
  Avatar as RneAvatar,
  AvatarProps,
} from "react-native-elements";
import { StyleProp, ViewStyle } from "react-native";

const Avatar = (
  props: {
    iconType?: "USER" | "PET";
    source?: { uri?: string };
    size: number;
    title?: string;
    onPress?: () => void;
  } & AvatarProps
) => {
  const { iconType, source, size, title, onPress } = {
    ...props,
  };
  const { theme } = React.useContext(ThemeContext);
  let avatarIcon =
    iconType == "PET"
      ? { name: "pets", type: "materialicons" }
      : { name: "user", type: "antdesign" };

  return (
    <RneAvatar
      icon={avatarIcon}
      rounded
      size={size}
      title={title}
      source={{ uri: source?.uri }}
      containerStyle={[
        {
          borderWidth: 1,
          borderColor: theme.colors?.grey2,
          backgroundColor: theme.colors?.grey2,
        },
        props.containerStyle,
      ]}
      onPress={onPress}
    />
  );
};

export default Avatar;
