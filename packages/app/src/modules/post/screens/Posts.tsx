import React, {
  useState,
  useMemo,
  RefObject,
  useCallback,
  useRef,
} from "react";
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
  useDerivedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import Recommends from "./Recommends";
import Followed from "./Followed";
import SearchHeader from "../components/SearchHeader";
import TabBar from "../components/TabBar";

const Tab = createMaterialTopTabNavigator();

type ScrollMeta = {
  list: RefObject<FlatList>;
  position: Animated.SharedValue<number>;
  headerDist: number;
};

const useCollpaseHeaderListTab = ({
  currentIndex,
  translateVal,
  headerHeight,
  tabIndex,
}: {
  currentIndex: number;
  translateVal: Animated.SharedValue<number>;
  headerHeight: number;
  tabIndex: number;
}) => {
  const listRef = useRef<FlatList>(null);
  const scrollValue = useSharedValue(0);
  const headerDist = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(
    {
      onScroll: (event) => {
        if (event.contentOffset.y < 0) {
          return;
        }
        if (tabIndex == currentIndex) {
          const diff = event.contentOffset.y - scrollValue.value;
          const v = translateVal.value + diff * 0.3;
          if (v >= 0 && v <= headerHeight) {
            translateVal.value = v;
          }
          // fix fast scroll glitch bug
          if (
            translateVal.value - event.contentOffset.y > 0 &&
            event.contentOffset.y == 0
          ) {
            translateVal.value = event.contentOffset.y;
          }
          headerDist.value = translateVal.value - event.contentOffset.y;
        }
        scrollValue.value = event.contentOffset.y;
      },
    },
    [currentIndex]
  );

  return {
    listRef,
    scrollValue,
    headerDist,
    scrollHandler,
  };
};

const Posts = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { height: screenHeight } = useWindowDimensions();
  const { top, bottom } = useSafeAreaInsets();
  const [tabIndex, setTabIndex] = useState(0);

  const HEADER_HEIGHT = 46;
  const TAB_BAR_HEIGHT = 42;
  const TRANSLATE_SPEED_RATIO = 0.3;
  const HeaderHeightWithMargin = top + HEADER_HEIGHT;
  const headerTranslateMax = HEADER_HEIGHT;
  const translateVal = useSharedValue(0);

  // console.log("posts tabIndex", tabIndex, Math.random());
  const {
    listRef: recommendListRef,
    scrollHandler: recommendScrollHandler,
    headerDist: recommendHeaderDist,
  } = useCollpaseHeaderListTab({
    currentIndex: tabIndex,
    translateVal: translateVal,
    headerHeight: HEADER_HEIGHT,
    tabIndex: 0,
  });

  const {
    listRef: followListRef,
    scrollHandler: followScrollHandler,
    headerDist: followHeaderDist,
  } = useCollpaseHeaderListTab({
    currentIndex: tabIndex,
    translateVal: translateVal,
    headerHeight: HEADER_HEIGHT,
    tabIndex: 1,
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

  const contentContainerStyle = useMemo<StyleProp<ViewStyle>>(() => {
    return {
      paddingTop:
        Platform.OS == "android"
          ? HeaderHeightWithMargin + 8 + top
          : HeaderHeightWithMargin + 8,
      paddingBottom: bottom,
      minHeight: screenHeight,
    };
  }, [HeaderHeightWithMargin, bottom, screenHeight, tabIndex]);

  const adjust: NonNullable<FlatListProps<any>["onMomentumScrollEnd"]> = (
    event
  ) => {
    if (tabIndex != 0) {
      recommendListRef.current?.scrollToOffset({
        offset: translateVal.value - recommendHeaderDist.value,
        animated: false,
      });
    }
    if (tabIndex != 1) {
      followListRef.current?.scrollToOffset({
        offset: translateVal.value - followHeaderDist.value,
        animated: false,
      });
    }
  };

  const sharedProps = useMemo<Partial<FlatListProps<any>>>(
    () => ({
      // decelerationRate: 0.96,
      contentContainerStyle,
      onMomentumScrollEnd: adjust,
      onScrollEndDrag: adjust,
      scrollEventThrottle: 1,
      scrollIndicatorInsets: { top: HeaderHeightWithMargin },
    }),
    [contentContainerStyle, HeaderHeightWithMargin, tabIndex, adjust]
  );

  const renderRecommends = useCallback(
    () => (
      <Recommends
        bounces={false}
        ref={recommendListRef}
        onScroll={recommendScrollHandler}
        // data={[{}, {}, {}, {}, {}]}
        {...sharedProps}
      />
    ),
    [recommendListRef, recommendScrollHandler, sharedProps]
  );

  const renderFollowed = useCallback(
    () => (
      <Followed
        bounces={false}
        ref={followListRef}
        onScroll={followScrollHandler}
        data={[{}, {}, {}, {}, {}]}
        {...sharedProps}
      />
    ),
    [followListRef, followScrollHandler, sharedProps]
  );

  const headerContainerStyle = useMemo<StyleProp<ViewStyle>>(
    () => [styles.headerContainer, { paddingTop: top }, headerSlideStyle],

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
          onIndexChange={setTabIndex}
          tabIndex={tabIndex}
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
        <SearchHeader />
      </Animated.View>

      <Tab.Navigator
        // tabBarOptions={{ scrollEnabled: true }}
        tabBar={renderTabBar}
      >
        <Tab.Screen
          options={{ tabBarLabel: t("posts.recommends.tabLabel") }}
          name="Recommends"
        >
          {renderRecommends}
        </Tab.Screen>
        <Tab.Screen
          options={{ tabBarLabel: t("posts.followed.tabLabel") }}
          name="Timeline"
        >
          {renderFollowed}
        </Tab.Screen>
      </Tab.Navigator>
    </View>
  );
};

export default Posts;

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
