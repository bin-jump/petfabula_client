import React, { forwardRef, memo } from "react";
import { FlatList } from "react-native";
import { useTheme } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSearchPost } from "@petfabula/common";
import PostFlatList, { Props } from "../components/PostFlatList";
import {
  useFirstFocusEffect,
  ActivityIndicator,
  LoadingMoreIndicator,
} from "../../shared";

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
    pending,
    hasMore,
    error,
    keyword: searchedWord,
  } = useSearchPost();
  const { theme } = useTheme();
  const { bottom } = useSafeAreaInsets();

  useFirstFocusEffect(() => {
    search(keyword, null);
  }, []);

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
      contentContainerStyle={{ paddingTop: 6, paddingBottom: bottom }}
      ListFooterComponent={hasMore ? <LoadingMoreIndicator /> : null}
      onEndReached={() => {
        if (hasMore && !pending && !error) {
          search(keyword, nextCursor);
        }
      }}
      onEndReachedThreshold={0.2}
    />
  );
});

export default memo(PostSearch);
