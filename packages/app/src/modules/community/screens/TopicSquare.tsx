import React, { useState, forwardRef, useCallback } from "react";
import {
  FlatList,
  FlatListProps,
  RefreshControl,
  ListRenderItem,
  View,
  ScrollView,
} from "react-native";
import { useTheme, Text, Divider } from "react-native-elements";
import { useLoadPostTopics, PostTopic } from "@petfabula/common";
import Animated from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import { useFirstFocusEffect } from "../../shared";
import { TouchableOpacity } from "@gorhom/bottom-sheet";

const AnimatedFlatList = Animated.createAnimatedComponent(
  FlatList
) as typeof FlatList;

export type Props = Omit<FlatListProps<PostTopic>, "renderItem" | "data">;

type TopicCategory = {
  title: string;
  topics: PostTopic[];
};

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

// const CategoryIcon = ({ category }: { category: TopicCategory }) => {
//   if (category.title) {
//   }
// };

const Header = ({
  categories,
  onCategoryPress,
  currentIndex,
}: {
  currentIndex: number;
  categories: TopicCategory[];
  onCategoryPress: (index: number) => void;
}) => {
  const { theme } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        height: 60,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {categories.map((item, index) => (
        <TouchableOpacity
          onPress={() => onCategoryPress(index)}
          key={item.title}
        >
          <View
            style={{
              padding: 12,
              marginHorizontal: 12,
              backgroundColor:
                currentIndex == index
                  ? theme.colors?.primary
                  : theme.colors?.white,
              shadowColor: theme.colors?.grey2,
              shadowOffset: { width: 1, height: 1 },
              shadowOpacity: 0.5,
              shadowRadius: 2,
              borderRadius: 6,
              flexDirection: "row",
            }}
          >
            <Text
              style={{
                color:
                  currentIndex == index
                    ? theme.colors?.white
                    : theme.colors?.black,
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              {item.title}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const TopicItem = ({
  topic,
  onPress,
}: {
  topic: PostTopic;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={{ height: 70, justifyContent: "center", padding: 16 }}>
        <Text style={{ fontSize: 18 }}>{`# ${topic.title}`}</Text>
      </View>
      <Divider />
    </TouchableOpacity>
  );
};

const TopicSquare = forwardRef<FlatList, Props>((props, ref) => {
  const [index, setIndex] = useState(0);
  const { loadPostTopics, topics, pending } = useLoadPostTopics();
  const { theme } = useTheme();
  const navigation = useNavigation();
  const categories = makeData(topics);

  const curTopicList = categories.length > 0 ? categories[index].topics : [];

  const keyExtractor = (item: PostTopic) => item.id.toString();

  const renderItem = useCallback<ListRenderItem<PostTopic>>(({ item }) => {
    return (
      <TopicItem
        topic={item}
        onPress={() => {
          navigation.navigate("SecondaryStack", {
            screen: "TopicPostList",
            params: {
              topic: item,
            },
          });
        }}
      />
    );
  }, []);

  useFirstFocusEffect(() => {
    loadPostTopics();
  }, []);

  return (
    <AnimatedFlatList
      ListHeaderComponent={() => (
        <Header
          categories={categories}
          onCategoryPress={setIndex}
          currentIndex={index}
        />
      )}
      refreshControl={
        <RefreshControl
          // progressViewOffset={70}
          refreshing={pending}
          onRefresh={() => {
            loadPostTopics();
          }}
        />
      }
      keyExtractor={keyExtractor}
      ref={ref}
      {...props}
      data={curTopicList}
      renderItem={renderItem}
      onEndReachedThreshold={0.2}
    />
  );
});

export default TopicSquare;
