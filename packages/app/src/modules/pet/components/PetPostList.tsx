import React, { useCallback } from "react";
import {
  View,
  FlatList,
  ListRenderItem,
  TouchableWithoutFeedback,
} from "react-native";
import { useTheme, Text } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useLoadPetPosts, Post } from "@petfabula/common";
import {
  Image,
  LoadingMoreIndicator,
  toDateText,
  toDate,
  getMonthDateText,
  useRefocusEffect,
  useFirstFocusEffect,
} from "../../shared";

type ShowDate = { showDate: boolean };
type PostItem = Post & ShowDate;

export const makeListData = (records: Post[]) => {
  const res: any[] = [];
  if (records.length == 0) {
    return res;
  }

  let date = "";
  for (let r of records) {
    const item = { ...r, showDate: false };
    let curDate = toDateText(r.createdDate);
    if (curDate != date) {
      item.showDate = true;
      date = curDate;
    }
    // item.showDate = true;
    res.push(item);
  }

  return res;
};

const Item = ({ item }: { item: PostItem }) => {
  const { theme } = useTheme();
  const navigation = useNavigation<StackNavigationProp<any>>();

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        navigation.push("PostDetailView", { id: item.id });
      }}
    >
      <View
        style={{
          height: 120,
          flex: 1,
          marginVertical: 10,
          marginRight: 16,
          backgroundColor: theme.colors?.white,
          borderRadius: 4,
          flexDirection: "row",
          padding: 16,

          shadowColor: theme.colors?.grey2,
          shadowOffset: { width: 2, height: 2 },
          shadowOpacity: 0.7,
          shadowRadius: 3,
          elevation: 2,
        }}
      >
        <Text
          numberOfLines={3}
          style={{
            fontSize: 18,
            flex: 1,
            marginRight: 8,
            color: theme.colors?.black,
          }}
        >
          {item.content}
        </Text>

        {item.images.length > 0 ? (
          <Image
            containerStyle={{ borderRadius: 6 }}
            style={{ width: 100, height: 100 }}
            source={{ uri: item.images[0].url }}
          />
        ) : null}
      </View>
    </TouchableWithoutFeedback>
  );
};

const PostListItem = ({ item }: { item: PostItem }) => {
  const { theme } = useTheme();

  return (
    <View style={{ flexDirection: "row", flex: 1 }}>
      <View style={{ width: 120, flexDirection: "row" }}>
        {item.showDate ? (
          <View style={{ width: 70, alignItems: "flex-end" }}>
            <Text
              style={{
                lineHeight: 24,
                color: theme.colors?.grey0,
                fontWeight: "bold",
                fontSize: 22,
              }}
            >
              {getMonthDateText(item.createdDate)}
            </Text>
            <Text
              style={{
                marginTop: 3,
                color: theme.colors?.grey0,
                fontWeight: "bold",
              }}
            >
              {toDate(item.createdDate).getFullYear()}
            </Text>
          </View>
        ) : (
          <View style={{ width: 70 }} />
        )}

        <View>
          {item.showDate ? (
            <View
              style={{
                marginLeft: 11,
                borderRadius: 20,
                height: 20,
                width: 20,
                backgroundColor: theme.colors?.white,
                borderWidth: 3,
                borderColor: theme.colors?.grey3,
              }}
            />
          ) : null}

          <View
            style={{
              marginLeft: 20,
              //   width: 3,
              borderLeftWidth: 3,
              borderRadius: 1,
              borderLeftColor: theme.colors?.grey3,
              //   borderStyle: "dotted",
              flex: 1,
            }}
          />
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <Item item={item} />
      </View>
    </View>
  );
};

const PetPostList = ({ petId }: { petId: number }) => {
  const { theme } = useTheme();
  const {
    petId: postPetId,
    posts,
    loadPetPosts,
    hasMore,
    pending: petPostPending,
    error,
    nextCursor,
  } = useLoadPetPosts();
  const navigation = useNavigation<StackNavigationProp<any>>();

  const keyExtractor = (item: PostItem) => item.id.toString();

  const renderItem = useCallback<ListRenderItem<PostItem>>(({ item }) => {
    return <PostListItem item={item} />;
  }, []);

  useFirstFocusEffect(() => {
    loadPetPosts(petId, null);
  }, [petId, loadPetPosts]);

  useRefocusEffect(() => {
    if (petId != postPetId) {
      loadPetPosts(petId, null);
    }
  }, [petId, postPetId, loadPetPosts]);

  return (
    <FlatList
      contentContainerStyle={{
        paddingTop: 20,
        paddingBottom: 40,
      }}
      keyExtractor={keyExtractor}
      data={makeListData(posts)}
      renderItem={renderItem}
      ListFooterComponent={hasMore ? <LoadingMoreIndicator /> : null}
      onEndReached={() => {
        if (hasMore && !petPostPending && !error) {
          loadPetPosts(petId, nextCursor);
        }
      }}
      onEndReachedThreshold={0.2}
    />
  );
};

export default PetPostList;
