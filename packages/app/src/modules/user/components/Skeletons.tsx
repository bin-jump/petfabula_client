import React from "react";
import { View } from "react-native";
import { useTheme, Text, Divider, Button, Icon } from "react-native-elements";
import { Skeleton } from "../../shared";

export const UseContentSkeleton = () => {
  const { theme } = useTheme();

  return (
    <View
      style={{
        backgroundColor: theme.colors?.white,
        paddingHorizontal: 20,
        height: 140,
      }}
    >
      <View style={{ flexDirection: "row" }}>
        <Skeleton
          style={{ height: 80, width: 80, borderRadius: 70, marginTop: 0 }}
        />
        <View style={{ marginLeft: 16, flex: 1 }}>
          <Skeleton
            style={{
              height: 28,
              width: 120,
            }}
          />
          <Skeleton />
        </View>
      </View>

      <View style={{ marginTop: 0 }}>
        <Skeleton style={{ height: 32 }} />
      </View>
    </View>
  );
};
