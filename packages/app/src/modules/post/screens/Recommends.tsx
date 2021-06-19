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
import PostItem, {
  usePostWidth,
  resovePostItemHeight,
} from "../components/PostItemNarrow";

type ItemWrapper = Post & { postHeight: number; marginTop: number };
type RowWrapper = {
  id: number;
  marginTop: number;
  itemLeft: ItemWrapper;
  itemRight: ItemWrapper;
};

const makeData = (data: Post[], contentWidth: number) => {
  const res: ItemWrapper[] = [];

  data.forEach((item) => {
    var l = resovePostItemHeight(contentWidth, item);
    // console.log("l", l, contentWidth);
    const o: ItemWrapper = { ...item, postHeight: l, marginTop: 0 };
    res.push(o);
  });

  return res;
};

const makeRow = (data: ItemWrapper[]) => {
  const res: RowWrapper[] = [];
  if (!data.length) {
    return res;
  }

  let tl = 0;
  let tr = 0;
  let diff = 0;

  for (let i = 0; i < data.length; i++) {
    let lg = data[i];

    if (i % 2) {
      let sm = data[i - 1];
      diff = Math.abs(tl - tr);

      if (lg.postHeight < sm.postHeight) {
        const tmp = lg;
        lg = sm;
        sm = tmp;
      }

      // assume left is shorter
      let r: RowWrapper = {
        id: lg.id,
        marginTop: -diff,
        itemLeft: lg,
        itemRight: sm,
      };
      r.itemRight.marginTop = diff;
      // if right is shorter, put longer one to right
      if (tl > tr) {
        r = {
          id: lg.id,
          marginTop: -diff,
          itemLeft: sm,
          itemRight: lg,
        };
        r.itemLeft.marginTop = diff;
        r.itemRight.marginTop = 0;
      }
      tl += r.itemLeft.postHeight;
      tr += r.itemRight.postHeight;

      res.push(r);
    }
  }

  if (data.length % 2) {
    diff = Math.abs(tl - tr);
    const last = data[data.length - 1];
    // if left is shorter
    if (tl <= tr) {
      res.push({
        id: last.id,
        marginTop: -diff,
        itemLeft: last,
        itemRight: null as any,
      });
    } else {
      res.push({
        id: last.id,
        marginTop: -diff,
        itemLeft: null as any,
        itemRight: last,
      });
    }
  }

  return res;
};

export const AnimatedFlatList = Animated.createAnimatedComponent(
  FlatList
) as typeof FlatList;

type Props = Omit<FlatListProps<RowWrapper>, "renderItem" | "data">;

const Recommends = forwardRef<FlatList, Props>((props, ref) => {
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

  const keyExtractor = (item: RowWrapper) => item.id.toString();
  const renderItem = useCallback<ListRenderItem<RowWrapper>>(
    ({ item }) => (
      <View
        style={[
          styles.viewRow,
          { justifyContent: !item.itemLeft ? "flex-end" : "flex-start" },
        ]}
      >
        {item.itemLeft ? (
          <PostItem
            post={item.itemLeft}
            height={item.itemLeft.postHeight}
            marginTop={item.itemLeft.marginTop}
          />
        ) : (
          <View style={{ height: 20, width: 100 }} />
        )}
        {item.itemRight ? (
          <PostItem
            post={item.itemRight}
            height={item.itemRight.postHeight}
            marginTop={item.itemRight.marginTop}
          />
        ) : null}
      </View>
    ),
    []
  );

  const d = useMemo(() => makeRow(makeData(posts, postWidth)), [posts]);

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
      // numColumns={2}
      ref={ref}
      data={d}
      CellRendererComponent={({ children, item, ...props }) => {
        return (
          <View {...props} style={{ marginTop: item.marginTop }}>
            {children}
          </View>
        );
      }}
      // data={posts}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      {...props}
      ListFooterComponent={hasMore ? <ActivityIndicator /> : null}
      onEndReached={() => {
        if (hasMore && !pending) {
          loadRecommendPosts(nextCursor);
          console.log("onEndReached");
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
