import React from "react";
import { View } from "react-native";
import { useTheme, Text, Divider, Button, Icon } from "react-native-elements";
import { Skeleton } from "../../shared";

export const PetDetailSkeleton = () => {
  const { theme } = useTheme();

  return (
    <View
      style={{ backgroundColor: theme.colors?.white, paddingHorizontal: 20 }}
    >
      <View style={{ flexDirection: "row" }}>
        <Skeleton
          style={{ height: 70, width: 70, borderRadius: 70, marginTop: 12 }}
        />
        <View
          style={{
            flex: 1,
            marginLeft: 16,
          }}
        >
          <Skeleton style={{ width: 120 }} />
          <Skeleton />
        </View>
      </View>
    </View>
  );
};
