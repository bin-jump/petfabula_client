import React, {
  useState,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import {
  View,
  StyleProp,
  ViewStyle,
  FlatList,
  useWindowDimensions,
  ScrollView,
  ListRenderItem,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import { useTheme, Text, Divider, Icon, Button } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Animated from "react-native-reanimated";
import {
  createMaterialTopTabNavigator,
  MaterialTopTabBarProps,
} from "@react-navigation/material-top-tabs";
import { useTranslation } from "react-i18next";
import {
  Participator,
  ParticipatorDetail,
  Post,
  Question,
  AnswerWithQuestion,
  useLoadUserProfile,
  useLoadUserPosts,
  useCurrentUser,
  useLoadUserQuestions,
  useLoadUserAnswers,
  useLoadUserCollectedPosts,
  useLoadUserPets,
  useFollowUser,
  useUnfollowUser,
  Pet,
} from "@petfabula/common";
import {
  Avatar,
  useFirstFocusEffect,
  LoadingMoreIndicator,
  useRefocusEffect,
  ActivityIndicator,
} from "../../shared";
import ParamTypes from "./ParamTypes";
import PostItem from "../components/PostItem";
import QuestionItem from "../components/QuestionItem";
import AnswerWithQuestionItem from "../components/AnswerWithQuestionItem";
import TabBar from "../components/TabBar";
import { UserDetailSkeleton } from "../components/Skeletons";

const Tab = createMaterialTopTabNavigator();

const AnimatedFlatList = Animated.createAnimatedComponent(
  FlatList
) as typeof FlatList;

export type ListProps = { userId: number };

const UserPosts = forwardRef<FlatList, ListProps>((props, ref) => {
  const { userId } = props;
  const {
    userId: postUserId,
    loadUserPosts,
    posts,
    pending,
    nextCursor,
    initializing,
    hasMore,
    error,
  } = useLoadUserPosts();
  const navigation = useNavigation<StackNavigationProp<any>>();

  const keyExtractor = (item: Post) => item.id.toString();

  const renderItem = useCallback<ListRenderItem<Post>>(({ item }) => {
    return (
      <PostItem
        post={item}
        onPress={(post) => {
          navigation.push("PostDetailView", { id: post.id });
        }}
      />
    );
  }, []);

  // useFirstFocusEffect(() => {
  //   loadUserPosts(userId, null);
  // }, [userId]);

  useRefocusEffect(() => {
    if (userId != postUserId) {
      loadUserPosts(userId, null);
    }
  }, [userId, postUserId, loadUserPosts]);

  useFirstFocusEffect(() => {
    loadUserPosts(userId, null);
  }, [loadUserPosts, userId]);

  if (userId != postUserId) {
    return <ActivityIndicator style={{ marginTop: 12 }} />;
  }

  return (
    <AnimatedFlatList
      keyExtractor={keyExtractor}
      ref={ref}
      {...props}
      data={posts}
      renderItem={renderItem}
      ListFooterComponent={hasMore ? <LoadingMoreIndicator /> : null}
      onEndReached={() => {
        if (hasMore && !pending && !error) {
          loadUserPosts(userId, nextCursor);
        }
      }}
      onEndReachedThreshold={0.2}
    />
  );
});

const UserQuestions = forwardRef<FlatList, ListProps>((props, ref) => {
  const { userId } = props;
  const {
    userId: questionUserId,
    loadUserQuestions,
    questions,
    pending,
    nextCursor,
    initializing,
    hasMore,
    error,
  } = useLoadUserQuestions();
  const navigation = useNavigation<StackNavigationProp<any>>();

  const keyExtractor = (item: Question) => item.id.toString();

  const renderItem = useCallback<ListRenderItem<Question>>(({ item }) => {
    return (
      <QuestionItem
        onPress={() => {
          navigation.push("QuestionDetailView", {
            id: item.id,
          });
        }}
        question={item}
      />
    );
  }, []);

  useRefocusEffect(() => {
    if (userId != questionUserId) {
      loadUserQuestions(userId, null);
    }
  }, [userId, questionUserId, loadUserQuestions]);

  useFirstFocusEffect(() => {
    loadUserQuestions(userId, null);
  }, [loadUserQuestions, userId]);

  if (userId != questionUserId) {
    return <ActivityIndicator style={{ marginTop: 12 }} />;
  }

  return (
    <AnimatedFlatList
      keyExtractor={keyExtractor}
      ref={ref}
      {...props}
      data={questions}
      renderItem={renderItem}
      ListFooterComponent={hasMore ? <LoadingMoreIndicator /> : null}
      onEndReached={() => {
        if (hasMore && !pending && !error) {
          loadUserQuestions(userId, nextCursor);
        }
      }}
      onEndReachedThreshold={0.2}
    />
  );
});

const UserAnswers = forwardRef<FlatList, ListProps>((props, ref) => {
  const { userId } = props;
  const {
    userId: answerUserId,
    loadUserAnswers,
    answers,
    pending,
    nextCursor,
    initializing,
    hasMore,
    error,
  } = useLoadUserAnswers();
  const navigation = useNavigation<StackNavigationProp<any>>();

  const keyExtractor = (item: AnswerWithQuestion) => item.id.toString();

  const renderItem = useCallback<ListRenderItem<AnswerWithQuestion>>(
    ({ item }) => {
      return (
        <AnswerWithQuestionItem
          answer={item}
          onPress={(answer) => {
            navigation.push("QuestionDetailView", { id: answer.questionId });
          }}
        />
      );
    },
    []
  );

  useRefocusEffect(() => {
    if (userId != answerUserId) {
      loadUserAnswers(userId, null);
    }
  }, [userId, answerUserId, loadUserAnswers]);

  useFirstFocusEffect(() => {
    loadUserAnswers(userId, null);
  }, [userId, loadUserAnswers]);

  if (userId != answerUserId) {
    return <ActivityIndicator style={{ marginTop: 12 }} />;
  }

  return (
    <AnimatedFlatList
      keyExtractor={keyExtractor}
      ref={ref}
      {...props}
      data={answers}
      renderItem={renderItem}
      ListFooterComponent={hasMore ? <LoadingMoreIndicator /> : null}
      onEndReached={() => {
        if (hasMore && !pending && !error) {
          loadUserAnswers(userId, nextCursor);
        }
      }}
      onEndReachedThreshold={0.2}
    />
  );
});

const UserCollectedPosts = forwardRef<FlatList, ListProps>((props, ref) => {
  const { userId } = props;
  const {
    userId: postUserId,
    loadCollectedPosts,
    posts,
    pending,
    nextCursor,
    initializing,
    hasMore,
    error,
  } = useLoadUserCollectedPosts();
  const navigation = useNavigation<StackNavigationProp<any>>();

  const keyExtractor = (item: Post) => item.id.toString();

  const renderItem = useCallback<ListRenderItem<Post>>(({ item }) => {
    return (
      <PostItem
        post={item}
        onPress={(post) => {
          navigation.push("PostDetailView", { id: post.id });
        }}
      />
    );
  }, []);

  useRefocusEffect(() => {
    if (userId != postUserId) {
      loadCollectedPosts(userId, null);
    }
  }, [userId, postUserId, loadCollectedPosts]);

  useFirstFocusEffect(() => {
    loadCollectedPosts(userId, null);
  }, [userId, loadCollectedPosts]);

  if (userId != postUserId) {
    return <ActivityIndicator style={{ marginTop: 12 }} />;
  }

  return (
    <AnimatedFlatList
      keyExtractor={keyExtractor}
      ref={ref}
      {...props}
      data={posts}
      renderItem={renderItem}
      ListFooterComponent={hasMore ? <LoadingMoreIndicator /> : null}
      onEndReached={() => {
        if (hasMore && !pending && !error) {
          loadCollectedPosts(userId, nextCursor);
        }
      }}
      onEndReachedThreshold={0.2}
    />
  );
});

const TextNumber = ({ text, count }: { count: number; text: string }) => {
  const { theme } = useTheme();

  return (
    <View style={{}}>
      <Text
        style={{
          textAlign: "center",
          marginRight: 3,
          fontSize: 18,
          fontWeight: "bold",
        }}
      >
        {count}
      </Text>
      <Text style={{ fontSize: 14, color: theme.colors?.grey0 }}>{text}</Text>
    </View>
  );
};

const UserPart = ({
  profile,
  id,
}: {
  profile: ParticipatorDetail | null;
  id: number;
}) => {
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { theme } = useTheme();
  const { currentUser } = useCurrentUser();
  const { followUser } = useFollowUser();
  const { unfollowUser } = useUnfollowUser();

  return (
    <View>
      <View
        style={{
          alignItems: "flex-start",
          flexDirection: "row",
        }}
      >
        <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
          <Icon
            type="entypo"
            name="chevron-thin-left"
            size={24}
            color={theme.colors?.black}
          />
        </TouchableWithoutFeedback>
        <View style={{ flex: 1, alignItems: "center" }}>
          {profile?.id == id ? <Text h3>{profile?.name}</Text> : null}
        </View>
      </View>
      {profile?.id == id ? (
        <View style={{ paddingBottom: 12 }}>
          <View style={{ flexDirection: "row" }}>
            <Avatar
              containerStyle={{ marginTop: 8 }}
              source={{ uri: profile?.photo }}
              size={74}
            />
            <View
              style={{
                flex: 1,
                marginTop: 3,
                marginLeft: 18,
              }}
            >
              <View
                style={{
                  marginHorizontal: 16,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    navigation.push("FollowList", {
                      user: profile,
                      initialTab: "Followed",
                    });
                  }}
                >
                  <TextNumber
                    count={profile.followedCount}
                    text={t("user.followCount")}
                  />
                </TouchableOpacity>

                {/* <Divider style={{ height: "100%", width: 1 }} /> */}
                <TouchableOpacity
                  onPress={() => {
                    navigation.push("FollowList", {
                      user: profile,
                      initialTab: "Follower",
                    });
                  }}
                >
                  <TextNumber
                    count={profile.followerCount}
                    text={t("user.followerCount")}
                  />
                </TouchableOpacity>
                <TextNumber
                  count={profile.postCount}
                  text={t("user.postCount")}
                />
              </View>

              <View
                style={{
                  flexDirection: "row",
                  // justifyContent: "space-between",
                  justifyContent: "flex-end",
                  marginHorizontal: 8,
                  marginTop: 6,
                }}
              >
                {/* <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text
                    onPress={() => {
                      navigation.navigate("UserInfomation", { user: profile });
                    }}
                    style={{ color: theme.colors?.grey0 }}
                  >
                    {`${t("user.detail")} >>`}
                  </Text>
                </View> */}
                {currentUser?.id != profile.id ? (
                  <Button
                    loading={profile.followPending}
                    containerStyle={{
                      flex: 1,
                      height: 34,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    style={{ flex: 1, alignSelf: "stretch" }}
                    buttonStyle={{
                      flex: 1,
                      backgroundColor: profile.followed
                        ? theme.colors?.grey4
                        : theme.colors?.primary,
                      height: 34,
                      // width: 140,
                    }}
                    titleStyle={{
                      fontSize: 18,
                      fontWeight: "bold",
                      color: profile.followed
                        ? theme.colors?.black
                        : theme.colors?.white,
                    }}
                    title={
                      !profile.followed
                        ? t("user.followAction")
                        : t("user.unfollowAction")
                    }
                    onPress={() => {
                      if (profile.followed) {
                        unfollowUser(profile.id);
                      } else {
                        followUser(profile.id);
                      }
                    }}
                  />
                ) : null}
              </View>
            </View>
          </View>
          <Text
            numberOfLines={1}
            style={{
              marginTop: 6,
              marginLeft: 100,
              color: profile.bio ? theme.colors?.grey0 : theme.colors?.grey1,
            }}
          >
            {profile.bio ? profile.bio : `${t("user.unsetBio")}...`}
          </Text>
        </View>
      ) : (
        <UserDetailSkeleton />
      )}
    </View>
  );
};

const PetItem = ({ pet }: { pet: Pet }) => {
  const { theme } = useTheme();
  const navigation = useNavigation<StackNavigationProp<any>>();

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        navigation.push("PetDetailView", {
          petId: pet.id,
        });
      }}
    >
      <View
        style={{
          marginRight: 12,
          height: 50,
          width: 150,
          backgroundColor: theme.colors?.white,
          padding: 8,
          flexDirection: "row",
          alignItems: "center",

          borderRadius: 80,
          shadowColor: theme.colors?.grey2,
          shadowOffset: { width: 2, height: 1 },
          shadowOpacity: 0.5,
          elevation: 2,
          shadowRadius: 3,
        }}
      >
        <Avatar iconType="PET" source={{ uri: pet.photo }} size={32} />
        <View
          style={{
            marginLeft: 10,
            marginVertical: 6,
            minHeight: 40,
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 20,
              color: theme.colors?.black,
            }}
          >
            {pet.name}
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const UserPets = ({ userId }: { userId: number }) => {
  const { theme } = useTheme();
  const { feederId, pets, loadPets, pending } = useLoadUserPets();
  const { t } = useTranslation();

  useRefocusEffect(() => {
    if (userId != feederId) {
      loadPets(userId);
    }
  }, [userId, feederId, loadPets]);

  useFirstFocusEffect(() => {
    loadPets(userId);
  }, [userId, loadPets]);

  // useEffect(() => {
  //   loadPets(userId);
  // }, [userId]);

  if (pending) {
    return (
      <View style={{ height: 60 }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ScrollView
      showsHorizontalScrollIndicator={false}
      horizontal
      contentContainerStyle={{
        alignItems: "center",
        height: 60,
        width: "100%",
        backgroundColor: theme.colors?.white,
        // paddingVertical: 3,
        paddingHorizontal: 16,
        paddingBottom: 6,
      }}
    >
      {/* <View style={{ marginBottom: 3, marginTop: 3 }}>
    <Text
      style={{ color: theme.colors?.grey1, fontWeight: "bold" }}
    >{`${t("user.petCount")} ${profile.petCount}`}</Text>
  </View> */}
      {pets.length == 0 ? (
        <View>
          <Text style={{ fontSize: 18, color: theme.colors?.grey1 }}>
            {`${t("user.noPet")}...`}
          </Text>
        </View>
      ) : (
        pets.map((item) => <PetItem key={item.id} pet={item} />)
      )}
    </ScrollView>
  );
};

const UserProfile = () => {
  const { params } = useRoute<RouteProp<ParamTypes, "UserProfile">>();
  const { id } = params;
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { top, bottom } = useSafeAreaInsets();
  const { currentUser } = useCurrentUser();
  const navigation = useNavigation();
  const { profile, pending, loadUserProfile } = useLoadUserProfile();

  useRefocusEffect(() => {
    if (id != profile?.id) {
      loadUserProfile(id);
    }
  }, [id, profile, loadUserProfile]);

  useEffect(() => {
    loadUserProfile(id);
  }, []);

  // useRefocusEffect(() => {
  //   if (id != feederId) {
  //     loadPets(id);
  //   }
  // }, [feederId, id, loadPets]);

  // useEffect(() => {
  //   loadPets(id);
  // }, []);

  const renderTabBar = useCallback<
    (props: MaterialTopTabBarProps) => React.ReactElement
  >((props) => <TabBar {...props} />, []);

  const renderUserPosts = useCallback(() => <UserPosts userId={id} />, [id]);

  const renderUserQuestions = useCallback(
    () => <UserQuestions userId={id} />,
    [id]
  );

  const renderUserAnswers = useCallback(
    () => <UserAnswers userId={id} />,
    [id]
  );

  const renderUserCollectedPosts = useCallback(
    () => <UserCollectedPosts userId={id} />,
    [id]
  );

  return (
    <Animated.View style={{ flex: 1 }}>
      <Animated.View
        style={[
          {
            paddingTop: top,
            width: "100%",
            zIndex: 1,
            backgroundColor: theme.colors?.white,
          },
        ]}
      >
        <View
          style={{
            height: 160,
            width: "100%",
            padding: 16,
          }}
        >
          <UserPart profile={profile} id={id} />
        </View>
        {/* <Divider /> */}

        <UserPets userId={id} />
      </Animated.View>

      {profile ? (
        <Tab.Navigator initialRouteName="UserPosts" tabBar={renderTabBar}>
          <Tab.Screen
            options={{ tabBarLabel: t("user.userPost") }}
            name="UserPosts"
          >
            {renderUserPosts}
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

          {currentUser?.id == profile.id ? (
            <Tab.Screen
              options={{ tabBarLabel: t("user.userfavouritePost") }}
              name="UserCollectedPosts"
            >
              {renderUserCollectedPosts}
            </Tab.Screen>
          ) : null}
        </Tab.Navigator>
      ) : null}
    </Animated.View>
  );
};

export default UserProfile;
