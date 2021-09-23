import React, { useEffect } from "react";
import { View, TouchableWithoutFeedback, RefreshControl } from "react-native";
import { useTheme, Text, Icon } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { useLoadTopicPosts } from "@petfabula/common";
import { LoadingMoreIndicator } from "../../shared";
import PostFlatList from "../components/PostFlatList";
import ParamTypes from "./ParamTypes";

const TopicPostList = () => {
  const {
    topicId: postTopicId,
    loadTopicPosts,
    posts,
    pending,
    nextCursor,
    initializing,
    hasMore,
    error,
  } = useLoadTopicPosts();
  const { top } = useSafeAreaInsets();
  const { theme } = useTheme();
  const navigation = useNavigation();

  const { params } = useRoute<RouteProp<ParamTypes, "TopicPostList">>();
  const topic = params.topic;
  const topicId = topic.id;

  useEffect(() => {
    loadTopicPosts(topicId, null);
  }, []);

  const data = postTopicId == topicId ? posts : [];

  return (
    <View style={{ flex: 1, paddingBottom: 20 }}>
      <View style={{ backgroundColor: theme.colors?.white, height: top }} />
      <View
        style={{
          width: "100%",
          height: 60,
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          backgroundColor: theme.colors?.white,
          shadowColor: theme.colors?.grey2,
          shadowOffset: { width: 2, height: 4 },
          shadowOpacity: 0.5,
          shadowRadius: 3,
          elevation: 2,
        }}
      >
        <View style={{ width: 50 }}>
          <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
            <Icon
              type="entypo"
              name="chevron-thin-left"
              size={24}
              color={theme.colors?.black}
            />
          </TouchableWithoutFeedback>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Icon
            containerStyle={{ marginRight: 6 }}
            type="fontisto"
            name="hashtag"
            size={16}
            color={theme.colors?.primary}
          />
          <Text h4>{topic.title}</Text>
        </View>
        <View style={{ width: 50 }} />
      </View>
      <PostFlatList
        contentContainerStyle={{ paddingTop: 10 }}
        refreshControl={
          <RefreshControl
            // progressViewOffset={70}
            refreshing={initializing}
            onRefresh={() => {
              loadTopicPosts(topicId, null);
            }}
          />
        }
        ListEmptyComponent={
          <View style={{ paddingTop: 120 }}>
            <Icon
              name="file-tray"
              type="ionicon"
              color={theme.colors?.grey3}
              size={70}
            />
            <Text
              style={{ textAlign: "center", color: theme.colors?.grey1 }}
            >{`データがありません`}</Text>
          </View>
        }
        posts={data}
        ListFooterComponent={hasMore ? <LoadingMoreIndicator /> : null}
        onEndReached={() => {
          if (hasMore && !pending && !error) {
            loadTopicPosts(topicId, nextCursor);
          }
        }}
        onEndReachedThreshold={0.2}
      />
    </View>
  );
};

export default TopicPostList;
