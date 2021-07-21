import React, {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from "react";
import {
  RefreshControl,
  View,
  StyleProp,
  Platform,
  ViewStyle,
  FlatList,
  useWindowDimensions,
  FlatListProps,
  ListRenderItem,
} from "react-native";
import { useTheme, Text, Divider } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useAnimatedGestureHandler,
} from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";
import {
  createMaterialTopTabNavigator,
  MaterialTopTabBarProps,
} from "@react-navigation/material-top-tabs";
import { useTranslation } from "react-i18next";
import {
  Post,
  useLoadUserProfile,
  useLoadUserPosts,
  useCurrentUser,
} from "@petfabula/common";
import {
  Avatar,
  useFirstFocusEffect,
  LoadingMoreIndicator,
} from "../../shared";
import ParamTypes from "./ParamTypes";
import PostItem from "../components/PostItem";
import TabBar from "../components/TabBar";

const Tab = createMaterialTopTabNavigator();

const AnimatedFlatList = Animated.createAnimatedComponent(
  FlatList
) as typeof FlatList;

export type ListProps = { userId: number };

const useCollpaseHeaderListTab = ({
  translateVal,
  headerHeight,
}: {
  translateVal: Animated.SharedValue<number>;
  headerHeight: number;
}) => {
  const listRef = useRef<FlatList>(null);
  const scrollValue = useSharedValue(0);

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
        if (event.contentOffset.y < 0) {
          return;
        }
        const diff = event.contentOffset.y - scrollValue.value;
        scrollValue.value = event.contentOffset.y;

        if (diff < 0 && event.contentOffset.y > headerHeight) {
          return;
        }
        const v = translateVal.value + diff;
        // translateVal.value = v;
        if (v >= 0 && v <= headerHeight) {
          translateVal.value = v;
        }

        // fix fast scroll glitch bug
        if (
          translateVal.value - event.contentOffset.y > 0 &&
          event.contentOffset.y == 0
        ) {
          translateVal.value = withTiming(0);
        }
      },
    },
    []
  );

  return {
    listSlideStyle,
    listRef,
    scrollValue,
    scrollHandler,
  };
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

  const keyExtractor = (item: Post) => item.id.toString();

  const renderItem = useCallback<ListRenderItem<Post>>(({ item }) => {
    return <PostItem post={item} />;
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

const UserProfile = () => {
  const { params } = useRoute<RouteProp<ParamTypes, "UserProfile">>();
  const { id } = params;
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { height: screenHeight } = useWindowDimensions();
  const { top, bottom } = useSafeAreaInsets();
  const { currentUser } = useCurrentUser();

  const HEADER_HEIGHT = 280;
  const TAB_BAR_HEIGHT = 42;
  const HeaderHeightWithMargin = top + HEADER_HEIGHT;
  const translateVal = useSharedValue(0);

  const { profile, pending, loadUserProfile } = useLoadUserProfile();

  useEffect(() => {
    loadUserProfile(id);
  }, []);

  const {
    listSlideStyle: userPostSlideStyle,
    listRef: userPostListRef,
    scrollHandler: userPostScrollHandler,
  } = useCollpaseHeaderListTab({
    translateVal: translateVal,
    headerHeight: HEADER_HEIGHT,
  });

  const {
    listSlideStyle: userQuestionSlideStyle,
    listRef: userQuestionListRef,
    scrollHandler: userQuestionScrollHandler,
  } = useCollpaseHeaderListTab({
    translateVal: translateVal,
    headerHeight: HEADER_HEIGHT,
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
        top: HEADER_HEIGHT,
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
            backgroundColor: "red",
            shadowColor: theme.colors?.grey2,
            shadowOffset: { width: 2, height: 4 },
            shadowOpacity: 0.3,
            elevation: 2,
          },
        ]}
      >
        <TabBar
          onIndexChange={() => {}}
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
        paddingTop: HEADER_HEIGHT + TAB_BAR_HEIGHT,
        // paddingTop: 6,
        paddingBottom: bottom,
        minHeight: screenHeight,
      },
      scrollEventThrottle: 5,
      // showsVerticalScrollIndicator: false,
      // scrollIndicatorInsets: { top: -20 },
    }),
    []
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
    []
  );

  const renderUserQuestions = useCallback(
    () => (
      <UserPosts
        ref={userQuestionListRef}
        onScroll={userQuestionScrollHandler}
        {...sharedProps}
        userId={id}
      />
    ),
    []
  );

  return (
    <Animated.View style={{ flex: 1 }}>
      <Divider style={{ zIndex: 9 }} />
      <Animated.View
        style={[
          {
            width: "100%",
            position: "absolute",
            zIndex: 1,
          },
          headerSlideStyle,
        ]}
      >
        <View
          style={{
            height: 140,
            width: "100%",
            backgroundColor: theme.colors?.white,
            padding: 16,
          }}
        >
          <Avatar source={{ uri: profile?.photo }} size={80} />
        </View>
        <Divider />
        <View
          style={{
            height: 140,
            width: "100%",
            backgroundColor: theme.colors?.white,
          }}
        ></View>
      </Animated.View>
      <Tab.Navigator initialRouteName="UserPosts" tabBar={renderTabBar}>
        <Tab.Screen
          options={{ tabBarLabel: t("post.recommends.tabLabel") }}
          name="UserPosts"
        >
          {renderUserPosts}
        </Tab.Screen>

        {/* <Tab.Screen
          options={{ tabBarLabel: t("post.recommends.tabLabel") }}
          name="UserQuestions"
        >
          {renderUserQuestions}
        </Tab.Screen> */}
      </Tab.Navigator>
    </Animated.View>
  );
};

export default UserProfile;
