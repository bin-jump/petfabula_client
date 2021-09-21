import React, { useCallback, memo } from "react";
import {
  View,
  FlatList,
  ListRenderItem,
  TouchableWithoutFeedback,
} from "react-native";
import { useTheme, Text } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  useSearchQuestionAnswer,
  QuestionAnswerSearch,
} from "@petfabula/common";
import {
  useFirstFocusEffect,
  ActivityIndicator,
  LoadingMoreIndicator,
  AvatarField,
  milisecToAgo,
  Image,
} from "../../shared";
import { QuestionSearchSkeleton } from "../components/Skeletons";

const QuestionAnswerItem = ({ item }: { item: QuestionAnswerSearch }) => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  return (
    <View
      style={{
        minHeight: 160,
        backgroundColor: theme.colors?.white,
        marginBottom: 12,
        padding: 12,
      }}
    >
      <TouchableWithoutFeedback
        onPress={() => {
          navigation.navigate("QuestionDetailView", { id: item.questionId });
        }}
      >
        {/* <Text>{item.category}</Text> */}
        {item.category == "ANSWER" ? (
          <View>
            <AvatarField
              style={{ marginBottom: 3, marginTop: 12 }}
              name={item.participator.name}
              photo={item.participator.photo}
              nameStyle={{
                marginLeft: 6,
                fontWeight: "bold",
                fontSize: 16,
                color: theme.colors?.grey0,
              }}
              size={26}
            />
            <Text h3>{item.title}</Text>
            <Text numberOfLines={5} style={{ fontSize: 18, marginTop: 6 }}>
              {item.answerContent}
            </Text>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={{ color: theme.colors?.grey1 }}>
                {milisecToAgo(item.createdDate)}
              </Text>
            </View>
          </View>
        ) : (
          <View
            style={{
              padding: 8,
              flex: 1,
              justifyContent: "space-between",
            }}
          >
            <View>
              <Text h3>{item.title}</Text>
              <AvatarField
                style={{ marginBottom: 3, marginTop: 8 }}
                name={item.participator.name}
                photo={item.participator.photo}
                nameStyle={{
                  marginLeft: 6,
                  fontWeight: "bold",
                  fontSize: 16,
                  color: theme.colors?.grey0,
                }}
                size={26}
              />
            </View>

            <View style={{ flexDirection: "row", flex: 1, marginTop: 10 }}>
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
                {item.content}
              </Text>
              {item.images.length > 0 ? (
                <Image
                  containerStyle={{
                    marginLeft: 6,
                    borderRadius: 6,
                    marginBottom: 16,
                  }}
                  resizeMode="cover"
                  style={{ width: 120, height: 100 }}
                  source={{ uri: item.images[0]?.url }}
                />
              ) : null}
            </View>

            <View style={{ alignItems: "flex-end" }}>
              <Text style={{ color: theme.colors?.grey1 }}>
                {milisecToAgo(item.createdDate)}
              </Text>
            </View>
          </View>
        )}
      </TouchableWithoutFeedback>
    </View>
  );
};

const renderItem = ({ item }: { item: QuestionAnswerSearch }) => (
  <QuestionAnswerItem item={item} />
);

const QuestionAnswerSearchView = ({ keyword }: { keyword: string }) => {
  const {
    search,
    questions,
    nextCursor,
    initializing,
    pending,
    hasMore,
    error,
    keyword: searchedWord,
  } = useSearchQuestionAnswer();
  const { theme } = useTheme();
  const { bottom } = useSafeAreaInsets();

  useFirstFocusEffect(() => {
    search(keyword, null);
  }, []);

  const d = searchedWord == keyword ? questions : [];

  const keyExtractor = (item: QuestionAnswerSearch) => item.id.toString();

  if (searchedWord != keyword) {
    return <QuestionSearchSkeleton />;
  }

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

export default memo(QuestionAnswerSearchView);
