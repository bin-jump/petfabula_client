import React, { useCallback } from "react";
import { ListRenderItem, FlatList, StyleSheet } from "react-native";
import { useTheme, Text, Divider, Icon } from "react-native-elements";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  createMaterialTopTabNavigator,
  MaterialTopTabBarProps,
} from "@react-navigation/material-top-tabs";
import { useTranslation } from "react-i18next";
import {
  Post,
  Question,
  AnswerWithQuestion,
  useLoadMyPosts,
  useLoadMyQuestions,
  useLoadMyAnswers,
  useLoadMyFavoritePosts,
} from "@petfabula/common";
import { useFirstFocusEffect, LoadingMoreIndicator } from "../../shared";
import ParamTypes from "./ParamTypes";
import {
  PostItem,
  QuestionItem,
  AnswerWithQuestionItem,
  TabBar,
} from "../../community/components";

const Tab = createMaterialTopTabNavigator();

const UserPosts = () => {
  const {
    loadMyPosts,
    posts,
    pending,
    nextCursor,
    initializing,
    hasMore,
    error,
  } = useLoadMyPosts();
  const navigation = useNavigation<StackNavigationProp<any>>();

  const keyExtractor = (item: Post) => item.id.toString();

  const renderItem = useCallback<ListRenderItem<Post>>(({ item }) => {
    return (
      <PostItem
        post={item}
        onPress={(post) => {
          //   navigation.push("PostDetailView", { id: post.id });
          navigation.push("SecondaryStack", {
            screen: "PostDetailView",
            params: {
              id: post.id,
            },
          });
        }}
      />
    );
  }, []);

  useFirstFocusEffect(() => {
    loadMyPosts(null);
  }, [loadMyPosts]);

  return (
    <FlatList
      contentContainerStyle={styles.listContainer}
      keyExtractor={keyExtractor}
      data={posts}
      renderItem={renderItem}
      ListFooterComponent={hasMore ? <LoadingMoreIndicator /> : null}
      onEndReached={() => {
        if (hasMore && !pending && !error) {
          loadMyPosts(nextCursor);
        }
      }}
      onEndReachedThreshold={0.2}
    />
  );
};

const UserQuestions = () => {
  const {
    loadMyQuestions,
    questions,
    pending,
    nextCursor,
    initializing,
    hasMore,
    error,
  } = useLoadMyQuestions();
  const navigation = useNavigation<StackNavigationProp<any>>();

  const keyExtractor = (item: Question) => item.id.toString();

  const renderItem = useCallback<ListRenderItem<Question>>(({ item }) => {
    return (
      <QuestionItem
        onPress={() => {
          navigation.push("SecondaryStack", {
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
    loadMyQuestions(null);
  }, [loadMyQuestions]);

  return (
    <FlatList
      contentContainerStyle={styles.listContainer}
      keyExtractor={keyExtractor}
      data={questions}
      renderItem={renderItem}
      ListFooterComponent={hasMore ? <LoadingMoreIndicator /> : null}
      onEndReached={() => {
        if (hasMore && !pending && !error) {
          loadMyQuestions(nextCursor);
        }
      }}
      onEndReachedThreshold={0.2}
    />
  );
};

const UserAnswers = () => {
  const {
    loadMyAnswers,
    answers,
    pending,
    nextCursor,
    initializing,
    hasMore,
    error,
  } = useLoadMyAnswers();
  const navigation = useNavigation<StackNavigationProp<any>>();

  const keyExtractor = (item: AnswerWithQuestion) => item.id.toString();

  const renderItem = useCallback<ListRenderItem<AnswerWithQuestion>>(
    ({ item }) => {
      return (
        <AnswerWithQuestionItem
          answer={item}
          onPress={(answer) => {
            // navigation.push("QuestionDetailView", { id: answer.questionId });
            navigation.push("SecondaryStack", {
              screen: "QuestionDetailView",
              params: {
                id: answer.questionId,
              },
            });
          }}
        />
      );
    },
    []
  );

  useFirstFocusEffect(() => {
    loadMyAnswers(null);
  }, [loadMyAnswers]);

  return (
    <FlatList
      contentContainerStyle={styles.listContainer}
      keyExtractor={keyExtractor}
      data={answers}
      renderItem={renderItem}
      ListFooterComponent={hasMore ? <LoadingMoreIndicator /> : null}
      onEndReached={() => {
        if (hasMore && !pending && !error) {
          loadMyAnswers(nextCursor);
        }
      }}
      onEndReachedThreshold={0.2}
    />
  );
};

const UserFavoritePosts = () => {
  const {
    loadMyFavoritePosts,
    posts,
    pending,
    nextCursor,
    initializing,
    hasMore,
    error,
  } = useLoadMyFavoritePosts();
  const navigation = useNavigation<StackNavigationProp<any>>();

  const keyExtractor = (item: Post) => item.id.toString();

  const renderItem = useCallback<ListRenderItem<Post>>(({ item }) => {
    return (
      <PostItem
        post={item}
        onPress={(post) => {
          //   navigation.push("PostDetailView", { id: post.id });
          navigation.push("SecondaryStack", {
            screen: "PostDetailView",
            params: {
              id: post.id,
            },
          });
        }}
      />
    );
  }, []);

  useFirstFocusEffect(() => {
    loadMyFavoritePosts(null);
  }, [loadMyFavoritePosts]);

  return (
    <FlatList
      contentContainerStyle={styles.listContainer}
      keyExtractor={keyExtractor}
      data={posts}
      renderItem={renderItem}
      ListFooterComponent={hasMore ? <LoadingMoreIndicator /> : null}
      onEndReached={() => {
        if (hasMore && !pending && !error) {
          loadMyFavoritePosts(nextCursor);
        }
      }}
      onEndReachedThreshold={0.2}
    />
  );
};

const UserActivity = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { params } = useRoute<RouteProp<ParamTypes, "UserActivity">>();
  const initial = params.initial;

  const renderTabBar = useCallback<
    (props: MaterialTopTabBarProps) => React.ReactElement
  >((props) => <TabBar {...props} />, []);

  const renderUserPosts = useCallback(() => <UserPosts />, []);

  const renderUserQuestions = useCallback(() => <UserQuestions />, []);

  const renderUserAnswers = useCallback(() => <UserAnswers />, []);

  const renderUserFavoritePosts = useCallback(() => <UserFavoritePosts />, []);

  return (
    <Tab.Navigator initialRouteName={initial} tabBar={renderTabBar}>
      <Tab.Screen
        options={{ tabBarLabel: t("user.userPost") }}
        name="UserPosts"
      >
        {renderUserPosts}
      </Tab.Screen>

      <Tab.Screen
        options={{ tabBarLabel: t("user.userfavouritePost") }}
        name="UserFavoritePosts"
      >
        {renderUserFavoritePosts}
      </Tab.Screen>

      <Tab.Screen
        options={{ tabBarLabel: t("user.userQuestion") }}
        name="UserQuestions"
      >
        {renderUserQuestions}
      </Tab.Screen>

      <Tab.Screen
        options={{ tabBarLabel: t("user.userAnswer") }}
        name="UserAnswers"
      >
        {renderUserAnswers}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default UserActivity;

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 30,
  },
});
