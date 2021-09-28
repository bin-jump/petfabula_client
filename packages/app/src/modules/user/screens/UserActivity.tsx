import React, { useCallback } from "react";
import { ListRenderItem, StyleSheet } from "react-native";
import { useTheme, Text, Divider, Icon } from "react-native-elements";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  createMaterialTopTabNavigator,
  MaterialTopTabBarProps,
  MaterialTopTabBar,
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
import {
  useFirstFocusEffect,
  LoadingMoreIndicator,
  FlatList,
} from "../../shared";
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
      pending={initializing}
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
      pending={initializing}
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
      pending={initializing}
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
      pending={initializing}
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

  const TabIndicatorLeft = (110 - 30) / 2;

  const renderTabBar = useCallback<
    (props: MaterialTopTabBarProps) => React.ReactElement
  >(
    (props) => (
      <MaterialTopTabBar
        // scrollEnabled
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
        tabStyle={{
          paddingBottom: 18,
          width: 110,
        }}
        indicatorStyle={{
          backgroundColor: theme.colors?.primary,
          // marginHorizontal: 20,
          width: 30,
          left: TabIndicatorLeft,
          // marginBottom: 6,
          height: 3,
          borderRadius: 3,
        }}
        {...props}
        style={{
          backgroundColor: theme.colors?.white,
        }}
      />
    ),
    [theme]
  );

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
