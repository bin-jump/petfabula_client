import React from "react";
import { View, ViewProps, StyleProp, TextStyle } from "react-native";
import { useTheme, Text } from "react-native-elements";
import Avatar from "./Avatar";

type Props = {
  name: string;
  photo?: string;
  nameStyle?: StyleProp<TextStyle>;
  subContent?: string;
  size?: number;
  small?: boolean;
  onAvatarClick?: () => void;
  fieldRight?: () => React.ReactNode;
};

export default function AvatarField(props: Props & ViewProps) {
  const { theme } = useTheme();
  const {
    nameStyle,
    photo,
    name,
    subContent,
    size,
    onAvatarClick,
    small,
    style,
    fieldRight,
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
        <View style={{ justifyContent: "center" }}>
          <Text
            style={[
              {
                fontSize: small ? 16 : 20,
                textAlign: "center",
                color: small ? theme.colors?.grey0 : theme.colors?.black,
              },
              nameStyle,
            ]}
          >
            {name}
          </Text>
          {subContent ? (
            <Text style={{ color: theme.colors?.grey1 }}>{subContent}</Text>
          ) : null}
        </View>
      </View>
      {fieldRight ? fieldRight() : null}
    </View>
  );
}
