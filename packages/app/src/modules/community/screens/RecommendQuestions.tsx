import React, { forwardRef, useCallback, useEffect } from "react";
import {
  FlatList,
  FlatListProps,
  RefreshControl,
  ListRenderItem,
} from "react-native";
import { Question, useLoadRecommendsQuestions } from "@petfabula/common";
import Animated from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import {
  useFirstFocusEffect,
  LoadingMoreIndicator,
  EmptyListComponent,
} from "../../shared";
import QuestionItem from "../components/QuestionItem";

const AnimatedFlatList = Animated.createAnimatedComponent(
  FlatList
) as typeof FlatList;

export type Props = Omit<FlatListProps<Question>, "renderItem" | "data">;

const RecommendQuestions = forwardRef<FlatList, Props>((props, ref) => {
  const {
    loadQuestions: loadRecommendQuestion,
    questions,
    pending,
    nextCursor,
    initializing,
    hasMore,
    error,
  } = useLoadRecommendsQuestions();
  const navigation = useNavigation();

  const keyExtractor = (item: Question) => item.id.toString();

  const renderItem = useCallback<ListRenderItem<Question>>(({ item }) => {
    return (
      <QuestionItem
        onPress={() => {
          navigation.navigate("SecondaryStack", {
            screen: "QuestionDetailView",
            params: {
              id: item.id,
            },
          });
        }}
        question={item}
      />
    );
  }, []);

  useFirstFocusEffect(() => {
    loadRecommendQuestion(null);
  }, []);

  return (
    <AnimatedFlatList
      refreshControl={
        <RefreshControl
          // progressViewOffset={70}
          refreshing={initializing}
          onRefresh={() => {
            loadRecommendQuestion(null);
          }}
        />
      }
      ListEmptyComponent={<EmptyListComponent />}
      keyExtractor={keyExtractor}
      ref={ref}
      {...props}
      data={questions}
      renderItem={renderItem}
      ListFooterComponent={hasMore ? <LoadingMoreIndicator /> : null}
      onEndReached={() => {
        if (hasMore && !pending && !error) {
          loadRecommendQuestion(nextCursor);
        }
      }}
      onEndReachedThreshold={0.2}
    />
  );
});

export default RecommendQuestions;
