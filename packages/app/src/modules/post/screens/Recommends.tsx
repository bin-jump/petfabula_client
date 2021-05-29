import React, { forwardRef, useCallback } from "react";
import { View, FlatList, FlatListProps, ListRenderItem } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import Animated from "react-native-reanimated";

export const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

type Props = Omit<FlatListProps<any>, "renderItem">;

const Recommends = forwardRef<FlatList, Props>((props, ref) => {
  const keyExtractor = useCallback((_, index) => index.toString(), []);

  const renderItem = useCallback<ListRenderItem<any>>(
    ({ item }) => (
      <View
        style={{
          height: 300,
          width: "100%",
          backgroundColor: "#aaaaaa",
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

export default Recommends;
