import React from "react";
import { View, ViewProps, StyleProp, TextStyle } from "react-native";
import { useTheme, Text } from "react-native-elements";
import Avatar from "./Avatar";

type Props = {
  name: string;
  photo?: string;
  nameStyle?: StyleProp<TextStyle>;
  subContentStyle?: StyleProp<TextStyle>;
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
    subContentStyle,
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
          alignSelf: "stretch",
          // flex: 1,
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
          source={{ uri: photo ? photo : "dummy" }}
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
            <Text style={[{ color: theme.colors?.grey1 }, subContentStyle]}>
              {subContent}
            </Text>
          ) : null}
        </View>
      </View>
      {fieldRight ? fieldRight() : null}
    </View>
  );
}
