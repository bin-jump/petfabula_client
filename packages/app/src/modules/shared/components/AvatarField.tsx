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
  actionComp?: () => React.ReactNode;
};

export default function AvatarField(props: Props & ViewProps) {
  const { theme } = useTheme();
  const {
    photo,
    name,
    subContent,
    size,
    onAvatarClick,
    small,
    style,
    actionComp,
  } = props;

  return (
    <View
      style={[
        {
          padding: 0,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          flex: 1,
        },
        style,
      ]}
    >
      <View style={[{ padding: 0, flexDirection: "row" }]}>
        <Avatar
          onPress={() => {
            if (onAvatarClick) {
              onAvatarClick();
            }
          }}
          source={{ uri: photo }}
          size={size ? size : 42}
        />
        <View style={{ marginLeft: small ? 4 : 10, justifyContent: "center" }}>
          <Text
            style={{
              fontSize: small ? 16 : 20,
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
      {actionComp ? actionComp() : null}
    </View>
  );
}
