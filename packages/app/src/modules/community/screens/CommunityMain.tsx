import React, { useMemo, useCallback, useRef } from "react";
import {
  Platform,
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  FlatList,
  useWindowDimensions,
  FlatListProps,
} from "react-native";
import { useTheme } from "react-native-elements";
import {
  createMaterialTopTabNavigator,
  MaterialTopTabBarProps,
} from "@react-navigation/material-top-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import { useCurrentUser } from "@petfabula/common";
import Recommends from "./Recommends";
import Followed from "./Followed";
import RecommendQuestions from "./RecommendQuestions";
import TopicSquare from "./TopicSquare";
import SearchHeader from "../components/SearchHeader";
import TabBar from "../components/TabBar";

const Tab = createMaterialTopTabNavigator();

// type ScrollMeta = {
//   list: RefObject<FlatList>;
//   position: Animated.SharedValue<number>;
//   headerDist: number;
// };
const TRANSLATE_SPEED_RATIO = 0.3;

// all return value should not change
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
        const df =
          diff > 0
            ? diff * TRANSLATE_SPEED_RATIO
            : diff * (TRANSLATE_SPEED_RATIO + 0.1);
        const v = translateVal.value + df;
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
        scrollValue.value = event.contentOffset.y;
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

const CommunityMain = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { height: screenHeight } = useWindowDimensions();
  const { top, bottom } = useSafeAreaInsets();
  const { currentUser } = useCurrentUser();

  const HEADER_HEIGHT = 46;
  const TAB_BAR_HEIGHT = 42;
  const HeaderHeightWithMargin = top + HEADER_HEIGHT;
  const translateVal = useSharedValue(0);

  const {
    listSlideStyle: recommendSlideStyle,
    listRef: recommendListRef,
    scrollHandler: recommendScrollHandler,
  } = useCollpaseHeaderListTab({
    translateVal: translateVal,
    headerHeight: HEADER_HEIGHT,
  });

  const {
    listSlideStyle: followSlideStyle,
    listRef: followListRef,
    scrollHandler: followScrollHandler,
  } = useCollpaseHeaderListTab({
    translateVal: translateVal,
    headerHeight: HEADER_HEIGHT,
  });

  const {
    listSlideStyle: questionSlideStyle,
    listRef: questionListRef,
    scrollHandler: questionScrollHandler,
  } = useCollpaseHeaderListTab({
    translateVal: translateVal,
    headerHeight: HEADER_HEIGHT,
  });

  const {
    listSlideStyle: topicSlideStyle,
    listRef: topicListRef,
    scrollHandler: topicScrollHandler,
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

  const headerOpacityStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        translateVal.value,
        [0, TAB_BAR_HEIGHT - 10],
        [1, 0]
      ),
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

  const listViewStyle = useMemo(
    () => ({
      marginTop:
        Platform.OS == "android"
          ? HeaderHeightWithMargin + top - 6
          : HeaderHeightWithMargin - 6,
      marginBottom: bottom + 10,
    }),
    []
  );

  const sharedProps = useMemo<Partial<FlatListProps<any>>>(
    () => ({
      // decelerationRate: 0.96,
      contentContainerStyle: {
        paddingTop: 6,
        paddingBottom: bottom,
        minHeight: screenHeight,
      },
      scrollEventThrottle: 5,
      // showsVerticalScrollIndicator: false,
      // scrollIndicatorInsets: { top: -20 },
    }),
    []
  );

  const renderRecommends = useCallback(
    () => (
      <Recommends
        style={[listViewStyle, recommendSlideStyle]}
        ref={recommendListRef}
        onScroll={recommendScrollHandler}
        {...sharedProps}
      />
    ),
    [sharedProps, listViewStyle]
  );

  const renderFollowed = useCallback(
    () => (
      <Followed
        style={[listViewStyle, followSlideStyle]}
        ref={followListRef}
        onScroll={followScrollHandler}
        {...sharedProps}
      />
    ),
    [sharedProps, listViewStyle]
  );

  const renderQuestion = useCallback(
    () => (
      <RecommendQuestions
        style={[listViewStyle, questionSlideStyle]}
        ref={questionListRef}
        onScroll={questionScrollHandler}
        {...sharedProps}
      />
    ),
    [sharedProps, listViewStyle]
  );

  const renderTopicSquare = useCallback(
    () => (
      <TopicSquare
        style={[
          listViewStyle,
          topicSlideStyle,
          { backgroundColor: theme.colors?.white },
        ]}
        ref={topicListRef}
        onScroll={topicScrollHandler}
        {...sharedProps}
      />
    ),
    [sharedProps, listViewStyle]
  );

  const headerContainerStyle = useMemo<StyleProp<ViewStyle>>(
    () => [
      styles.headerContainer,
      { paddingTop: top, backgroundColor: theme.colors?.white },
      headerSlideStyle,
    ],

    [headerSlideStyle, top]
  );

  const tabBarStyle = useMemo<StyleProp<ViewStyle>>(
    () => [styles.tabBarContainer, { top: HEADER_HEIGHT }, tabSlideStyle],
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

  return (
    <View style={{ flex: 1 }}>
      {/* <SafeAreaView
        style={{ flex: 0, backgroundColor: theme.colors?.white, zIndex: 2 }}
      /> */}
      <View
        style={{ height: top, backgroundColor: theme.colors?.white, zIndex: 2 }}
      />
      <Animated.View style={headerContainerStyle}>
        <Animated.View style={headerOpacityStyle}>
          <SearchHeader />
        </Animated.View>
      </Animated.View>

      <Tab.Navigator
        screenOptions={{}}
        tabBarOptions={{ scrollEnabled: true, tabStyle: { width: 120 } }}
        initialRouteName="Recommends"
        tabBar={renderTabBar}
      >
        {currentUser ? (
          <Tab.Screen
            options={{ tabBarLabel: t("post.followed.tabLabel") }}
            name="Followed"
          >
            {renderFollowed}
          </Tab.Screen>
        ) : null}

        <Tab.Screen
          options={{ tabBarLabel: t("post.recommends.tabLabel") }}
          name="Recommends"
        >
          {renderRecommends}
        </Tab.Screen>

        <Tab.Screen
          options={{ tabBarLabel: t("question.tabLabel") }}
          name="Questions"
        >
          {renderQuestion}
        </Tab.Screen>

        <Tab.Screen
          options={{ tabBarLabel: t("post.topicSquare") }}
          name="TopicSquare"
        >
          {renderTopicSquare}
        </Tab.Screen>
      </Tab.Navigator>
    </View>
  );
};

export default CommunityMain;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: "white",
  },
  tabBarContainer: {
    top: 0,
    left: 0,
    right: 0,
    position: "absolute",
    zIndex: 1,
  },
  headerContainer: {
    top: 0,
    left: 0,
    right: 0,
    position: "absolute",
    zIndex: 1,
  },
});
