import React, { forwardRef, useCallback } from "react";
import { View, FlatList, FlatListProps, ListRenderItem } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import Animated from "react-native-reanimated";

export const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

type Props = Omit<FlatListProps<any>, "renderItem">;

const Followed = forwardRef<FlatList, Props>((props, ref) => {
  const keyExtractor = useCallback((_, index) => index.toString(), []);

  const renderItem = useCallback<ListRenderItem<any>>(
    ({ item }) => (
      <View
        style={{
          height: 300,
          width: "100%",
          backgroundColor: "#777777",
          marginBottom: 12,
          marginHorizontal: 12,
        }}
      ></View>
    ),
    []
  );

  return (
    <AnimatedFlatList
      ref={ref}
      style={{
        flex: 1,
      }}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      {...props}
    />
  );
});

export default Followed;
