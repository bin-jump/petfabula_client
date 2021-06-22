import React, { forwardRef, useRef, useEffect, memo } from "react";
import {
  FlatList,
  FlatListProps,
  ListRenderItem,
  RefreshControl,
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
} from "react-native";
import { Icon, useTheme } from "react-native-elements";
import {
  useNavigation,
  useRoute,
  RouteProp,
  useFocusEffect,
} from "@react-navigation/native";
import Animated from "react-native-reanimated";
import { Post, useSearchPost } from "@petfabula/common";
import PostFlatList, { Props } from "../components/PostFlatList";

const PostSearch = forwardRef<
  FlatList,
  Omit<Props, "posts"> & { keyword: string }
>((props, ref) => {
  const { keyword } = { ...props };
  const {
    search,
    posts,
    nextCursor,
    initializing,
    keyword: searchedWord,
  } = useSearchPost();
  const { theme } = useTheme();

  useFocusEffect(
    React.useCallback(() => {
      search(keyword, null);
    }, [])
  );

  const d = searchedWord == keyword ? posts : [];

  return (
    <PostFlatList
      ref={ref}
      posts={d}
      {...props}
      ListHeaderComponent={initializing ? <ActivityIndicator /> : null}
      //   ListEmptyComponent={
      //     <View
      //       style={{
      //         height: "100%",
      //         minHeight: 360,
      //         justifyContent: "center",
      //         alignItems: "center",
      //       }}
      //     >
      //       <Icon
      //         type="font-awesome-5"
      //         name="box-open"
      //         color={theme.colors?.grey3}
      //         size={80}
      //       />
      //       <Text
      //         style={{ fontSize: 20, color: theme.colors?.grey1 }}
      //       >{`Empty`}</Text>
      //     </View>
      //   }
      style={{ marginTop: 6, minHeight: 360 }}
      //   ListFooterComponent={hasMore ? <ActivityIndicator /> : null}
      //   onEndReached={() => {

      //   }}
      //   onEndReachedThreshold={0.2}
    />
  );
});

export default memo(PostSearch);
