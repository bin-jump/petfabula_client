import React, { forwardRef, useCallback, useEffect, useMemo } from "react";
import { FlatList, RefreshControl, StyleSheet } from "react-native";
import { useLoadRecommendPosts } from "@petfabula/common";
import { usePostWidth } from "../components/PostItemNarrow";
import PostFlatList, { Props } from "../components/PostFlatList";
import { useFirstFocusEffect, LoadingMoreIndicator } from "../../shared";

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

  // useEffect(() => {
  //   loadRecommendPosts(null);
  // }, []);

  // useFocusEffect(
  //   useCallback(() => {
  //     if (posts.length == 0 && !pending) {
  //       loadRecommendPosts(null);
  //     }
  //   }, [loadRecommendPosts, posts])
  // );

  useFirstFocusEffect(() => {
    loadRecommendPosts(null);
  }, []);

  // useFocusEffect(() => {
  //   if (posts.length == 0 && !pending) {
  //     loadRecommendPosts(null);
  //   }
  // });

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
      ListFooterComponent={hasMore ? <LoadingMoreIndicator /> : null}
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
