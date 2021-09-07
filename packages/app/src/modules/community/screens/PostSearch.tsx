import React, { forwardRef, memo } from "react";
import { View, TouchableWithoutFeedback, FlatList } from "react-native";
import { useTheme, Icon, Text } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSearchPost, Post } from "@petfabula/common";
import { useNavigation } from "@react-navigation/native";
import {
  useFirstFocusEffect,
  ActivityIndicator,
  LoadingMoreIndicator,
  Image,
  IconCount,
  AvatarField,
  milisecToAgo,
} from "../../shared";

const PostSearchItem = ({ post }: { post: Post }) => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        navigation.navigate("PostDetailView", { id: post.id });
      }}
    >
      <View
        style={{
          // borderRadius: 6,
          minHeight: 160,
          backgroundColor: theme.colors?.white,
          marginTop: 12,
          // marginHorizontal: 12,
          padding: 18,
          shadowColor: theme.colors?.grey2,
          shadowOffset: { width: 2, height: 4 },
          shadowOpacity: 0.3,
          elevation: 2,
        }}
      >
        <AvatarField
          nameStyle={{ marginLeft: 10 }}
          subContentStyle={{ marginLeft: 10 }}
          style={{ marginBottom: 12 }}
          name={post.participator.name}
          photo={post.participator.photo}
          subContent={milisecToAgo(post.createdDate)}
        />

        <View style={{ flexDirection: "row", flex: 1 }}>
          <Text
            ellipsizeMode="tail"
            // numberOfLines={post.images.length > 0 ? 3 : 9}
            numberOfLines={4}
            style={{
              flex: 1,
              fontSize: 18,
              marginBottom: 2,
            }}
          >
            {post.content}
          </Text>
          {post.images.length > 0 ? (
            <Image
              containerStyle={{
                marginLeft: 6,
                borderRadius: 6,
                marginBottom: 16,
              }}
              resizeMode="cover"
              style={{ width: 120, height: 100 }}
              source={{ uri: post.images[0]?.url }}
            />
          ) : null}
        </View>

        {/* <View
          style={{
            flexDirection: "row",
            marginTop: 14,
            justifyContent: "flex-end",
            alignItems: "center",
            marginRight: 12,
            marginBottom: 6,
          }}
        >
          <IconCount
            type="entypo"
            name="thumbs-up"
            count={post.likeCount}
            size={22}
            style={{ marginRight: 26 }}
          />
          <IconCount
            type="font-awesome"
            name="commenting"
            count={post.commentCount}
            size={22}
          />
        </View> */}
      </View>
    </TouchableWithoutFeedback>
  );
};

const renderItem = ({ item }: { item: Post }) => <PostSearchItem post={item} />;

const PostSearch = (props: { keyword: string }) => {
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

  const keyExtractor = (item: Post) => item.id.toString();

  return (
    <FlatList
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      data={d}
      ListHeaderComponent={initializing ? <ActivityIndicator /> : null}
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
};

export default memo(PostSearch);
