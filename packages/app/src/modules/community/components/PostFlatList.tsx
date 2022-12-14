import React, { forwardRef, useCallback, useMemo } from "react";
import {
  FlatList,
  FlatListProps,
  ListRenderItem,
  View,
  StyleSheet,
} from "react-native";
import Animated from "react-native-reanimated";
import { Post } from "@petfabula/common";
import PostItem, { usePostWidth, resovePostItemHeight } from "./PostItemNarrow";
import { EmptyListComponent } from "../../shared";

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

const AnimatedFlatList = Animated.createAnimatedComponent(
  FlatList
) as typeof FlatList;

export type Props = Omit<FlatListProps<RowWrapper>, "renderItem" | "data"> & {
  posts: Post[];
};

const ListRow = ({ item }: { item: RowWrapper }) => {
  return (
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
  );
};

class CellView extends React.Component<any, any> {
  render() {
    return (
      <View {...this.props} style={{ marginTop: this.props.item.marginTop }}>
        {this.props.children}
      </View>
    );
  }
}

const PostFlatList = forwardRef<FlatList, Props>((props, ref) => {
  const { width: postWidth } = usePostWidth();
  const posts = props.posts;

  const keyExtractor = (item: RowWrapper) => item.id.toString();

  const renderItem = useCallback<ListRenderItem<RowWrapper>>(
    ({ item }) => <ListRow item={item} />,
    []
  );

  const d = useMemo(() => makeRow(makeData(posts, postWidth)), [posts]);

  return (
    <AnimatedFlatList
      ref={ref}
      data={d}
      // CellRendererComponent={({ children, item, ...props }) => {
      //   return (
      //     <View {...props} style={{ marginTop: item.marginTop }}>
      //       {children}
      //     </View>
      //   );
      // }}

      CellRendererComponent={CellView}
      ListEmptyComponent={<EmptyListComponent />}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      {...props}
    />
  );
});

export default PostFlatList;

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
