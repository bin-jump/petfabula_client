import React, { forwardRef, useCallback, useEffect } from "react";
import {
  FlatList,
  FlatListProps,
  ListRenderItem,
  RefreshControl,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import Animated from "react-native-reanimated";
import { useLoadRecommendPosts, Post } from "@petfabula/common";
import PostItem from "../components/PostItemNarrow";

export const AnimatedFlatList = Animated.createAnimatedComponent(
  FlatList
) as typeof FlatList;

type Props = Omit<FlatListProps<Post>, "renderItem" | "data">;

const Recommends = forwardRef<FlatList, Props>((props, ref) => {
  const keyExtractor = (item: Post) => item.id.toString();
  const { posts, loadRecommendPosts, nextCursor, initializing, pending } =
    useLoadRecommendPosts();

  useEffect(() => {
    loadRecommendPosts(null);
  }, []);

  const renderItem = useCallback<ListRenderItem<Post>>(
    ({ item }) => <PostItem post={item} />,
    []
  );

  return (
    <AnimatedFlatList
      refreshControl={
        <RefreshControl
          // progressViewOffset={70}
          refreshing={initializing}
          onRefresh={() => {
            loadRecommendPosts(null);
          }}
        />
      }
      numColumns={2}
      ref={ref}
      data={posts}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      {...props}
    />
  );
});

export default Recommends;
