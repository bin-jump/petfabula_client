import React, { useEffect } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { Text, useTheme, Icon, Divider } from "react-native-elements";

const ActionIcon = ({
  type,
  name,
  size,
  backgroundColor,
  iconColor,
  onPress,
}: {
  type: string;
  name: string;
  size: number;
  backgroundColor: string;
  iconColor: string;
  onPress?: () => void;
}) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ justifyContent: "center", alignItems: "center" }}
    >
      <View
        style={{
          padding: 12,
          backgroundColor: backgroundColor,
          borderRadius: 60,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Icon type={type} name={name} size={size} color={iconColor} />
      </View>
    </TouchableOpacity>
  );
};

export default ActionIcon;
