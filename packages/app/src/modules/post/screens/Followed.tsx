import React, { forwardRef, useCallback, useEffect, useMemo } from "react";
import { FlatList, RefreshControl, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useLoadFollowedPosts, useCurrentUser } from "@petfabula/common";
import { usePostWidth } from "../components/PostItemNarrow";
import PostFlatList, { Props } from "../components/PostFlatList";
import { useFirstFocusEffect, ActivityIndicator } from "../../shared";

type ListProps = Omit<Props, "posts">;

const Followed = forwardRef<FlatList, ListProps>((props, ref) => {
  const { width: postWidth } = usePostWidth();
  const { posts, loadTimeline, nextCursor, initializing, pending, hasMore } =
    useLoadFollowedPosts();
  const { currentUser } = useCurrentUser();

  // useEffect(() => {
  //   loadTimeline(null);
  // }, []);

  useFirstFocusEffect(() => {
    loadTimeline(null);
  }, []);

  return (
    <PostFlatList
      refreshControl={
        <RefreshControl
          // progressViewOffset={70}
          refreshing={initializing}
          onRefresh={() => {
            loadTimeline(null);
          }}
        />
      }
      ref={ref}
      {...props}
      posts={posts}
      ListFooterComponent={hasMore ? <ActivityIndicator /> : null}
      onEndReached={() => {
        if (hasMore && !pending) {
          loadTimeline(nextCursor);
        }
      }}
      onEndReachedThreshold={0.2}
    />
  );
});

export default Followed;

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
