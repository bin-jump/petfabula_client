import React, { forwardRef, useCallback } from "react";
import {
  FlatList,
  FlatListProps,
  RefreshControl,
  ListRenderItem,
} from "react-native";
import { Question, useLoadRecommendsQuestions } from "@petfabula/common";
import Animated from "react-native-reanimated";
import { useFirstFocusEffect, LoadingMoreIndicator } from "../../shared";
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
  } = useLoadRecommendsQuestions();

  const keyExtractor = (item: Question) => item.id.toString();

  const renderItem = useCallback<ListRenderItem<Question>>(({ item }) => {
    return <QuestionItem question={item} />;
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
      keyExtractor={keyExtractor}
      ref={ref}
      {...props}
      data={questions}
      renderItem={renderItem}
      ListFooterComponent={hasMore ? <LoadingMoreIndicator /> : null}
      onEndReached={() => {
        if (hasMore && !pending) {
          loadRecommendQuestion(nextCursor);
        }
      }}
      onEndReachedThreshold={0.2}
    />
  );
});

export default RecommendQuestions;