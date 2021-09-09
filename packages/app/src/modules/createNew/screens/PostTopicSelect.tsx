import React, { FC, useEffect, useCallback } from "react";
import {
  View,
  ScrollView,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import { Divider, ListItem, useTheme, Text } from "react-native-elements";
import { useNavigation, RouteProp, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import {
  createMaterialTopTabNavigator,
  MaterialTopTabBar,
  MaterialTopTabBarProps,
} from "@react-navigation/material-top-tabs";
import { useLoadPostTopics, PostTopic } from "@petfabula/common";
import { ActivityIndicator } from "../../shared";

type TopicCategory = {
  title: string;
  topics: PostTopic[];
};

const Tab = createMaterialTopTabNavigator();

const makeData = (topics: PostTopic[]) => {
  const res: TopicCategory[] = [];

  // topics.sort((a, b) => a.id - b.id);
  for (const t of topics) {
    let cate = res.find((item) => item.title == t.topicCategoryTitle);
    if (!cate) {
      cate = { title: t.topicCategoryTitle, topics: [] };
      res.push(cate);
    }
    cate.topics.push(t);
  }

  return res;
};

const TabBar: FC<MaterialTopTabBarProps> = ({ ...props }) => {
  const { index } = props.state;
  const { theme } = useTheme();

  return (
    <MaterialTopTabBar
      contentContainerStyle={{
        height: 42,
      }}
      activeTintColor={theme.colors?.black}
      inactiveTintColor={theme.colors?.grey1}
      labelStyle={{
        fontSize: 16,
        fontWeight: "bold",
        paddingBottom: 18,
      }}
      renderIndicator={(route: any) => {
        if (!route.getTabWidth()) {
          return null;
        }
        return (
          <View
            style={{
              width: route.getTabWidth(),
              height: "100%",
              left: route.navigationState.index * route.getTabWidth(),
              alignItems: "center",
              justifyContent: "flex-end",
              // paddingBottom: 8,
            }}
          >
            <View
              style={{
                width: "80%",
                backgroundColor: theme.colors?.primary,
                borderRadius: 3,
                height: 3,
              }}
            ></View>
          </View>
        );
      }}
      {...props}
      style={{
        backgroundColor: theme.colors?.white,
      }}
    />
  );
};

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

const EmptyTopicItem = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { t } = useTranslation();

  return (
    <View
      style={{
        backgroundColor: theme.colors?.white,
        paddingHorizontal: 8,
      }}
    >
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("CreatePost", { topic: {} });
        }}
      >
        <View style={{ paddingVertical: 16 }}>
          <Text style={{ fontSize: 18, color: theme.colors?.grey1 }}>{`# ${t(
            "createNew.topicSelect"
          )}`}</Text>
        </View>
      </TouchableOpacity>
      <Divider />
    </View>
  );
};

const TopicList = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { params } =
    useRoute<
      RouteProp<
        { params: { category: TopicCategory; index: number } },
        "params"
      >
    >();

  const category = params.category;
  const index = params.index;

  return (
    <ScrollView style={{ backgroundColor: theme.colors?.white }}>
      {index == 0 ? <EmptyTopicItem /> : null}

      {category.topics.map((item) => (
        <TopicItem key={item.id} item={item} />
      ))}
    </ScrollView>
  );
};

const PostTopicSelect = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { loadPostTopics, topics, pending } = useLoadPostTopics();

  useEffect(() => {
    loadPostTopics();
  }, []);

  const renderTabBar = useCallback<
    (props: MaterialTopTabBarProps) => React.ReactElement
  >((props) => <TabBar {...props} />, []);

  const catetories = makeData(topics);

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
        <Tab.Navigator
          tabBar={renderTabBar}
          tabBarOptions={{ scrollEnabled: true }}
        >
          {catetories.map((category, index) => (
            <Tab.Screen
              key={category.title}
              name={category.title}
              component={TopicList}
              options={{ tabBarLabel: category.title }}
              initialParams={{ category, index }}
            />
          ))}
        </Tab.Navigator>
      )}
    </View>
  );
};

export default PostTopicSelect;
