import React, { forwardRef, useCallback, useEffect, useMemo } from "react";
import {
  FlatList,
  FlatListProps,
  ListRenderItem,
  RefreshControl,
  View,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import Animated from "react-native-reanimated";
import { useLoadRecommendPosts, Post } from "@petfabula/common";
import PostItem, { usePostWidth } from "../components/PostItemNarrow";
import PostFlatList, { Props } from "../components/PostFlatList";

type ListProps = Omit<Props, "posts">;

const Recommends = forwardRef<FlatList, ListProps>((props, ref) => {
  const { width: postWidth } = usePostWidth();
  const {
    posts,
    loadRecommendPosts,
    nextCursor,
    initializing,
    pending,
    hasMore,
  } = useLoadRecommendPosts();

  useEffect(() => {
    loadRecommendPosts(null);
  }, []);

  return (
    <PostFlatList
      refreshControl={
        <RefreshControl
          // progressViewOffset={70}
          refreshing={initializing}
          onRefresh={() => {
            loadRecommendPosts(null);
          }}
        />
      }
      ref={ref}
      {...props}
      posts={posts}
      ListFooterComponent={hasMore ? <ActivityIndicator /> : null}
      onEndReached={() => {
        if (hasMore && !pending) {
          loadRecommendPosts(nextCursor);
        }
      }}
      onEndReachedThreshold={0.2}
    />
  );
});

export default Recommends;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatList: {
    width: "100%",
    height: "100%",
  },
  viewRow: {
    flexDirection: "row",
  },
  image: {
    width: "50%",
    resizeMode: "cover",
  },
});
