import React from "react";
import {
  View,
  ViewProps,
  StyleProp,
  TextStyle,
  useWindowDimensions,
} from "react-native";
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
  fieldRightWidth?: number;
};

const PHOTO_WIDTH = 42;

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
    fieldRightWidth,
  } = props;

  const { width: screenWidth } = useWindowDimensions();

  const photoWidth = size ? size : PHOTO_WIDTH;
  const rightWidth = fieldRightWidth ? fieldRightWidth : 0;

  let nameW = screenWidth - 40 - photoWidth - rightWidth;

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
          source={{ uri: photo ? photo : undefined }}
          size={photoWidth}
        />
        <View style={{ justifyContent: "center" }}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[
              {
                fontSize: small ? 16 : 20,
                textAlign: "center",
                color: small ? theme.colors?.grey0 : theme.colors?.black,
                maxWidth: nameW,
              },
              nameStyle,
            ]}
          >
            {name}
          </Text>
          {subContent && (
            <Text style={[{ color: theme.colors?.grey1 }, subContentStyle]}>
              {subContent}
            </Text>
          )}
        </View>
      </View>
      {fieldRight ? fieldRight() : null}
    </View>
  );
}
