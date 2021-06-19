import React from "react";
import { View, ViewProps } from "react-native";
import { useTheme, Text } from "react-native-elements";
import Avatar from "./Avatar";

type Props = {
  photo?: string;
  name: string;
  subContent?: string;
  size?: number;
  small?: boolean;
  onAvatarClick?: () => void;
};

export default function AvatarField(props: Props & ViewProps) {
  const { theme } = useTheme();
  const { photo, name, subContent, size, onAvatarClick, small } = props;

  return (
    <View style={[{ padding: 0, flexDirection: "row" }, props.style]}>
      <Avatar
        onPress={() => {
          if (onAvatarClick) {
            onAvatarClick();
          }
        }}
        source={{ uri: photo }}
        size={size ? size : 50}
      />
      <View style={{ marginLeft: small ? 4 : 10, justifyContent: "center" }}>
        <Text
          style={{
            fontSize: small ? 16 : 22,
            fontWeight: small ? "normal" : "bold",
            textAlign: "center",
            color: small ? theme.colors?.grey0 : theme.colors?.black,
          }}
        >
          {name}
        </Text>
        {subContent ? (
          <Text style={{ color: theme.colors?.grey1 }}>{subContent}</Text>
        ) : null}
      </View>
    </View>
  );
}
