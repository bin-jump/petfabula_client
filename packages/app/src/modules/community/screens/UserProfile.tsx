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
  FlatListProps,
  ListRenderItem,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import { useTheme, Text, Divider, Icon } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useAnimatedRef,
  interpolate,
} from "react-native-reanimated";
import {
  createMaterialTopTabNavigator,
  MaterialTopTabBarProps,
} from "@react-navigation/material-top-tabs";
import { useTranslation } from "react-i18next";
import {
  Participator,
  Post,
  Question,
  AnswerWithQuestion,
  useLoadUserProfile,
  useLoadUserPosts,
  useCurrentUser,
  useLoadUserQuestions,
  useLoadUserAnswers,
  useLoadUserCollectedPosts,
} from "@petfabula/common";
import {
  Avatar,
  useFirstFocusEffect,
  LoadingMoreIndicator,
  useRefocusEffect,
} from "../../shared";
import ParamTypes from "./ParamTypes";
import PostItem from "../components/PostItem";
import QuestionItem from "../components/QuestionItem";
import AnswerWithQuestionItem from "../components/AnswerWithQuestionItem";
import TabBar from "../components/TabBar";

const Tab = createMaterialTopTabNavigator();

const AnimatedFlatList = Animated.createAnimatedComponent(
  FlatList
) as typeof FlatList;

export type ListProps = { userId: number };

const useCollpaseHeaderListTab = ({
  translateVal,
  headerHeight,
  curTabIndex,
  myTabIndex,
}: {
  translateVal: Animated.SharedValue<number>;
  headerHeight: number;
  curTabIndex: number;
  myTabIndex: number;
}) => {
  const listRef = useAnimatedRef<FlatList>();
  const scrollValue = useSharedValue(0);
  const offsetDist = useSharedValue(0);

  const listSlideStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: -translateVal.value,
        },
      ],
    };
  }, []);

  const scrollHandler = useAnimatedScrollHandler(
    {
      onScroll: (event) => {
        if (curTabIndex != myTabIndex) {
          return;
        }
        if (event.contentOffset.y < 0) {
          return;
        }
        const diff = event.contentOffset.y - scrollValue.value;
        scrollValue.value = event.contentOffset.y;

        if (diff < 0 && event.contentOffset.y > headerHeight) {
          return;
        }
        const v = translateVal.value + diff;
        if (v >= 0 && v <= headerHeight) {
          translateVal.value = v;
        }

        offsetDist.value = event.contentOffset.y - translateVal.value;

        if (
          translateVal.value - event.contentOffset.y > 0 &&
          event.contentOffset.y == 0
        ) {
          translateVal.value = withTiming(0);
        }
      },
    },
    [curTabIndex]
  );

  return {
    listSlideStyle,
    listRef,
    scrollValue,
    scrollHandler,
    offsetDist,
  };
};

const Header = ({
  height,
  profile,
}: {
  height: number;
  profile: Participator | null;
}) => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { top } = useSafeAreaInsets();

  return (
    <Animated.View
      style={{
        height: height,
        backgroundColor: theme.colors?.white,
        paddingLeft: 18,
        flexDirection: "row",
        alignItems: "center",
        paddingTop: top,
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
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {profile ? <Text h3>{profile.name}</Text> : null}
      </View>
    </Animated.View>
  );
};

const UserPosts = forwardRef<FlatList, ListProps>((props, ref) => {
  const { userId } = props;
  const {
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

  useFirstFocusEffect(() => {
    loadUserPosts(userId, null);
  }, []);

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

  useFirstFocusEffect(() => {
    loadUserQuestions(userId, null);
  }, []);

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

  useFirstFocusEffect(() => {
    loadUserAnswers(userId, null);
  }, []);

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

  useFirstFocusEffect(() => {
    loadCollectedPosts(userId, null);
  }, []);

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

const UserPart = ({ profile }: { profile: Participator | null }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();

  const TextNumber = ({ text, count }: { count: number; text: string }) => {
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
        <Text style={{ fontSize: 16, color: theme.colors?.grey0 }}>{text}</Text>
      </View>
    );
  };

  return (
    <View>
      <View style={{ alignItems: "flex-start", flexDirection: "row" }}>
        <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
          <Icon
            type="entypo"
            name="chevron-thin-left"
            size={24}
            color={theme.colors?.black}
          />
        </TouchableWithoutFeedback>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text h3>{profile?.name}</Text>
        </View>
      </View>
      {profile ? (
        <View style={{ marginTop: 3, paddingBottom: 12 }}>
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
                <TextNumber
                  count={profile.followedCount}
                  text={t("user.followCount")}
                />
                {/* <Divider style={{ height: "100%", width: 1 }} /> */}
                <TextNumber
                  count={profile.followedCount}
                  text={t("user.followedCount")}
                />
                <TextNumber
                  count={profile.postCount}
                  text={t("user.postCount")}
                />
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginHorizontal: 8,
                  marginTop: 6,
                }}
              >
                <View
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
                </View>

                <TouchableOpacity
                  style={{
                    width: 160,
                    borderRadius: 6,
                    marginHorizontal: 6,
                    height: 30,
                    backgroundColor: theme.colors?.primary,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{ color: theme.colors?.white, fontWeight: "bold" }}
                  >
                    {t("user.followAction")}
                  </Text>
                </TouchableOpacity>
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
      ) : null}
    </View>
  );
};

const UserProfile = () => {
  const { params } = useRoute<RouteProp<ParamTypes, "UserProfile">>();
  const { id } = params;
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { height: screenHeight } = useWindowDimensions();
  const { top, bottom } = useSafeAreaInsets();
  const { currentUser } = useCurrentUser();
  const [tabIndex, setTabIndex] = useState(0);
  const navigation = useNavigation();

  const HEADER_HEIGHT = 270;
  const FOLD_HEADER_HEIGHT = 60;
  const HEADER_FOLD_HEIGHT = HEADER_HEIGHT - FOLD_HEADER_HEIGHT;
  const TAB_BAR_HEIGHT = 42;
  const translateVal = useSharedValue(0);

  const { profile, pending, loadUserProfile } = useLoadUserProfile();

  useRefocusEffect(() => {
    if (id != profile?.id) {
      loadUserProfile(id);
    }
  }, [id, profile, loadUserProfile]);

  useEffect(() => {
    loadUserProfile(id);
  }, []);

  const {
    listSlideStyle: userPostSlideStyle,
    listRef: userPostListRef,
    scrollHandler: userPostScrollHandler,
    offsetDist: userPostScrollHeaderDist,
  } = useCollpaseHeaderListTab({
    translateVal: translateVal,
    headerHeight: HEADER_FOLD_HEIGHT,
    curTabIndex: tabIndex,
    myTabIndex: 0,
  });

  const {
    listSlideStyle: userQuestionSlideStyle,
    listRef: userQuestionListRef,
    scrollHandler: userQuestionScrollHandler,
    offsetDist: questionScrollHeaderDist,
  } = useCollpaseHeaderListTab({
    translateVal: translateVal,
    headerHeight: HEADER_FOLD_HEIGHT,
    curTabIndex: tabIndex,
    myTabIndex: 1,
  });

  const {
    listSlideStyle: userAnswerSlideStyle,
    listRef: userAnswerListRef,
    scrollHandler: userAnswerScrollHandler,
    offsetDist: answerScrollHeaderDist,
  } = useCollpaseHeaderListTab({
    translateVal: translateVal,
    headerHeight: HEADER_FOLD_HEIGHT,
    curTabIndex: tabIndex,
    myTabIndex: 2,
  });

  const {
    listSlideStyle: userCollectedPostSlideStyle,
    listRef: userCollectedPostListRef,
    scrollHandler: userCollectedPostScrollHandler,
    offsetDist: collectedPostScrollHeaderDist,
  } = useCollpaseHeaderListTab({
    translateVal: translateVal,
    headerHeight: HEADER_FOLD_HEIGHT,
    curTabIndex: tabIndex,
    myTabIndex: 3,
  });

  const scrollPairs = [
    { listRef: userPostListRef, dist: userPostScrollHeaderDist },
    { listRef: userQuestionListRef, dist: questionScrollHeaderDist },
    { listRef: userAnswerListRef, dist: answerScrollHeaderDist },
    { listRef: userCollectedPostListRef, dist: collectedPostScrollHeaderDist },
  ];

  const adjust: NonNullable<FlatListProps<any>["onMomentumScrollEnd"]> = (
    event
  ) => {
    let i = -1;
    for (const { listRef, dist } of scrollPairs) {
      i += 1;
      if (tabIndex == i) {
        continue;
      }
      if (true) {
        listRef.current?.scrollToOffset({
          offset: translateVal.value + dist.value,
          animated: false,
        });
      }
    }
  };

  const foldHeaderSlideStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        translateVal.value,
        [100, HEADER_HEIGHT - top - 20],
        [0, 1]
      ),
      transform: [
        {
          translateY: Math.min(translateVal.value, 100 + top),
        },
      ],
    };
  });

  const headerSlideStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: -translateVal.value,
        },
      ],
    };
  });

  const tabSlideStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: -translateVal.value,
        },
      ],
    };
  });

  const tabBarStyle = useMemo<StyleProp<ViewStyle>>(
    () => [
      {
        top: HEADER_HEIGHT + top,
        position: "absolute",
        zIndex: 10,
      },
      tabSlideStyle,
    ],
    [tabSlideStyle]
  );

  const renderTabBar = useCallback<
    (props: MaterialTopTabBarProps) => React.ReactElement
  >(
    (props) => (
      <Animated.View
        style={[
          tabBarStyle,
          {
            width: "100%",
            shadowColor: theme.colors?.grey2,
            shadowOffset: { width: 2, height: 4 },
            shadowOpacity: 0.3,
            elevation: 2,
          },
        ]}
      >
        <TabBar
          onIndexChange={(index) => {
            setTabIndex(index);
          }}
          style={{ height: TAB_BAR_HEIGHT }}
          {...props}
        />
      </Animated.View>
    ),
    [tabBarStyle]
  );

  const sharedProps = useMemo<Partial<FlatListProps<any>>>(
    () => ({
      decelerationRate: 0.96,
      contentContainerStyle: {
        paddingTop: HEADER_HEIGHT + TAB_BAR_HEIGHT + top,
        // paddingTop: 6,
        paddingBottom: bottom,
        minHeight: screenHeight + HEADER_HEIGHT,
      },
      scrollEventThrottle: 5,
      onMomentumScrollEnd: adjust,
      onScrollEndDrag: adjust,
      // showsVerticalScrollIndicator: false,
      // scrollIndicatorInsets: { top: -20 },
    }),
    [adjust]
  );

  const renderUserPosts = useCallback(
    () => (
      <UserPosts
        ref={userPostListRef}
        onScroll={userPostScrollHandler}
        {...sharedProps}
        userId={id}
      />
    ),
    [sharedProps]
  );

  const renderUserQuestions = useCallback(
    () => (
      <UserQuestions
        ref={userQuestionListRef}
        onScroll={userQuestionScrollHandler}
        {...sharedProps}
        userId={id}
      />
    ),
    [sharedProps]
  );

  const renderUserAnswers = useCallback(
    () => (
      <UserAnswers
        ref={userAnswerListRef}
        onScroll={userAnswerScrollHandler}
        {...sharedProps}
        userId={id}
      />
    ),
    [sharedProps]
  );

  const renderUserCollectedPosts = useCallback(
    () => (
      <UserCollectedPosts
        ref={userCollectedPostListRef}
        onScroll={userCollectedPostScrollHandler}
        {...sharedProps}
        userId={id}
      />
    ),
    [sharedProps]
  );

  return (
    <Animated.View style={{ flex: 1 }}>
      <Animated.View
        style={[
          {
            marginTop: -100 - top,
            width: "100%",
            position: "absolute",
            zIndex: 9,
          },
          foldHeaderSlideStyle,
        ]}
      >
        <Header height={FOLD_HEADER_HEIGHT + top} profile={profile} />
        <Divider />
      </Animated.View>

      <Animated.View
        style={[
          {
            height: HEADER_HEIGHT,
            paddingTop: top,
            width: "100%",
            position: "absolute",
            zIndex: 1,
            backgroundColor: theme.colors?.white,
          },
          headerSlideStyle,
        ]}
      >
        <View
          style={{
            height: 165,
            width: "100%",
            padding: 16,
          }}
        >
          <UserPart profile={profile} />
        </View>
        <Divider />

        <View
          style={{
            height: 105,
            width: "100%",
            backgroundColor: theme.colors?.white,
            // paddingVertical: 3,
            paddingHorizontal: 16,
          }}
        >
          {profile ? (
            <View>
              <View style={{ marginBottom: 3, marginTop: 3 }}>
                <Text
                  style={{ color: theme.colors?.grey1, fontWeight: "bold" }}
                >{`${t("user.petCount")} ${profile.petCount}`}</Text>
              </View>
              <View
                style={{
                  height: 75,
                  width: 180,
                  backgroundColor: theme.colors?.grey5,
                  borderRadius: 8,
                  padding: 8,
                  flexDirection: "row",
                  alignItems: "center",

                  borderColor: theme.colors?.grey4,
                  // borderWidth: 1,

                  // shadowColor: theme.colors?.grey2,
                  // shadowOffset: { width: 2, height: 1 },
                  // shadowOpacity: 0.5,
                  // elevation: 2,
                }}
              >
                <Avatar
                  iconType="PET"
                  source={{ uri: profile?.photo }}
                  size={50}
                />
                <View
                  style={{ marginLeft: 12, marginVertical: 6, minHeight: 40 }}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 18,
                      color: theme.colors?.grey0,
                    }}
                  >{`name`}</Text>
                </View>
              </View>
            </View>
          ) : null}
        </View>
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
              options={{ tabBarLabel: t("user.userCollectedPost") }}
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
