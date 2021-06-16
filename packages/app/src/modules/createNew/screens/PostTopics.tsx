import React, { useEffect } from "react";
import { View, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { Divider, ListItem, useTheme } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useLoadPostTopics, PostTopic } from "@petfabula/common";

const TopicItem = ({ item }: { item: PostTopic }) => {
  const navigation = useNavigation();

  return (
    <ListItem
      bottomDivider
      onPress={() => {
        navigation.navigate("CreatePost", { topic: item });
      }}
    >
      <ListItem.Content>
        <ListItem.Title
          style={{ fontWeight: "bold" }}
        >{`# ${item.title}`}</ListItem.Title>
        <ListItem.Subtitle>{item.intro}</ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );
};

const PostTopics = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { loadPostTopics, topics, pending } = useLoadPostTopics();

  useEffect(() => {
    loadPostTopics();
  }, []);

  const emptyTopic: PostTopic = { id: -1, title: "No topic", intro: "no" };
  const tList = topics.length ? [emptyTopic, ...topics] : [];

  return (
    <View
      style={{
        height: "100%",
        width: "100%",
      }}
    >
      <Divider />
      <ListItem
        bottomDivider
        onPress={() => {
          navigation.navigate("CreatePost", { topic: undefined });
        }}
      >
        <ListItem.Content>
          <ListItem.Title style={{ color: theme.colors?.grey0 }}>
            {t("createNew.topicSelect")}
          </ListItem.Title>
        </ListItem.Content>
      </ListItem>
      {topics.map((item) => (
        <TopicItem key={item.id} item={item} />
      ))}
    </View>
  );
};

export default PostTopics;
