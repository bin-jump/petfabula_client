import React, { useEffect, useCallback } from "react";
import {
  View,
  ScrollView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Divider, ListItem, useTheme, Text } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import {
  createMaterialTopTabNavigator,
  MaterialTopTabBarProps,
} from "@react-navigation/material-top-tabs";
import {
  useLoadPostTopics,
  PostTopic,
  PostTopicCategory,
} from "@petfabula/common";

const Tab = createMaterialTopTabNavigator();

const TopicItem = ({ item }: { item: PostTopic }) => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  return (
    <View
      style={{
        backgroundColor: theme.colors?.white,
        paddingHorizontal: 8,
      }}
    >
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("CreatePost", { topic: item });
        }}
      >
        <View style={{ paddingVertical: 16 }}>
          <Text style={{ fontSize: 20 }}>{`# ${item.title}`}</Text>
        </View>
      </TouchableOpacity>
      <Divider />
    </View>
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

  const commonStyle = { backgroundColor: theme.colors?.white };

  const renderCategory1 = () => (
    <ScrollView style={commonStyle}>
      <View
        style={{
          backgroundColor: theme.colors?.white,
          paddingHorizontal: 8,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("CreatePost", { topic: undefined });
          }}
        >
          <View style={{ paddingVertical: 16 }}>
            <Text style={{ fontSize: 18 }}>{`# ${t(
              "createNew.topicSelect"
            )}`}</Text>
          </View>
        </TouchableOpacity>
        <Divider />
      </View>

      {topics[0].topics.map((item) => (
        <TopicItem key={item.id} item={item} />
      ))}
    </ScrollView>
  );

  const renderCategory2 = () => (
    <ScrollView style={commonStyle}>
      {topics[1].topics.map((item) => (
        <TopicItem key={item.id} item={item} />
      ))}
    </ScrollView>
  );

  return (
    <View
      style={{
        height: "100%",
        width: "100%",
      }}
    >
      {topics.length == 0 ? (
        <ActivityIndicator color={theme.colors?.grey3} />
      ) : (
        <Tab.Navigator tabBarOptions={{ scrollEnabled: true }}>
          <Tab.Screen
            options={{ tabBarLabel: topics[0].title }}
            name={topics[0].title}
          >
            {renderCategory1}
          </Tab.Screen>
          <Tab.Screen
            options={{ tabBarLabel: topics[1].title }}
            name={topics[1].title}
          >
            {renderCategory2}
          </Tab.Screen>
        </Tab.Navigator>
      )}
      {/* <Divider />
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
      ))} */}
    </View>
  );
};

export default PostTopics;
