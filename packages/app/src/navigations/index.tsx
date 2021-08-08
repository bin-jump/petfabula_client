import React, { useEffect, useRef, useCallback } from "react";
import { View, AppState, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  NavigationContainer,
  DefaultTheme,
  useNavigation,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { useTheme, Icon, Text } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import Toast from "react-native-root-toast";
import {
  useCurrentUser,
  registerToastHandler,
  registerLoginReqiureHandler,
  useCheckNotifications,
} from "@petfabula/common";
import { LoginRequire } from "../modules/aspect";
import AuthenticaionScreen from "../modules/authentication";
import CommunityMain from "../modules/community";
import PetMain from "../modules/pet";
import User from "../modules/user";
import NotificationMain from "../modules/notification";
import CreateNew from "../modules/createNew";
import SecondaryStack from "./SecondaryStack";

const Tabs = createBottomTabNavigator();
const TopStack = createStackNavigator();

const AppScreen = () => {
  const { theme } = useTheme();

  return (
    <NavigationContainer
      theme={{
        ...DefaultTheme,

        colors: {
          ...DefaultTheme.colors,
          background: theme.colors?.grey5
            ? theme.colors?.grey5
            : DefaultTheme.colors.background,
        },
      }}
    >
      <TopStack.Navigator mode="modal">
        <TopStack.Screen
          options={{
            headerShown: false,
          }}
          name="TabScreen"
          component={TabScreen}
        />

        <TopStack.Screen
          options={{
            headerShown: false,
          }}
          name="SecondaryStack"
          component={SecondaryStack}
        />

        <TopStack.Screen
          options={{
            headerShown: false,
            cardStyle: { backgroundColor: "transparent" },
            cardOverlayEnabled: true,
            cardStyleInterpolator: ({ current: { progress } }) => ({
              cardStyle: {
                opacity: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1],
                }),
              },
              overlayStyle: {
                opacity: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.3],
                  extrapolate: "clamp",
                }),
              },
            }),
          }}
          name="LoginRequire"
          component={LoginRequire}
        />
        <TopStack.Screen
          options={{
            headerShown: false,
            cardStyle: { backgroundColor: "transparent" },
            cardOverlayEnabled: true,
            cardStyleInterpolator: ({ current: { progress } }) => ({
              cardStyle: {
                opacity: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1],
                }),
              },
              overlayStyle: {
                opacity: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.5],
                  extrapolate: "clamp",
                }),
              },
            }),
          }}
          name="CreateNew"
          component={CreateNew}
        />
        <TopStack.Screen
          options={{
            headerShown: false,
          }}
          name="AuthenticaionScreen"
          component={AuthenticaionScreen}
        />
      </TopStack.Navigator>
    </NavigationContainer>
  );
};

const createNewPlaceholder = () => <View />;

// application main functionalities
const TabScreen = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { bottom } = useSafeAreaInsets();
  const focusedColor = theme.colors?.primary;
  const unFocusedColor = theme.colors?.grey1;
  const fontSize = 14;
  const iconSize = 22;

  const { checkResult } = useCheckNotifications();
  const { getCurrentUser } = useCurrentUser();

  const hasNotification =
    checkResult &&
    (checkResult.hasSystemNotificationUnread ||
      checkResult.voteCount > 0 ||
      checkResult.followCount > 0 ||
      checkResult.answerCommentCount > 0);
  // check login on active
  // const appState = useRef(AppState.currentState);
  const _handleAppStateChange = useCallback(
    (nextAppState: any) => {
      if (nextAppState === "active") {
        getCurrentUser();
      }
    },
    [getCurrentUser]
  );
  useEffect(() => {
    AppState.addEventListener("change", _handleAppStateChange);

    return () => {
      AppState.removeEventListener("change", _handleAppStateChange);
    };
  }, []);

  const navigation = useNavigation();
  registerLoginReqiureHandler({
    handle: () => {
      navigation.navigate("LoginRequire");
      // navigation.navigate("AuthenticaionScreen");
    },
  });
  // register toast related to redux action
  registerToastHandler({
    handleSuccess: (msg: string) =>
      Toast.show(`✓ ${t(msg)}`, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.TOP + 30,
        shadow: true,
        animation: true,
        hideOnPress: true,
      }),

    handleFailure: (msg: string) =>
      Toast.show(`⚠ ${t(msg)}`, {
        duration: Toast.durations.LONG,
        position: Toast.positions.TOP + 30,
        shadow: true,
        animation: true,
        hideOnPress: true,
      }),
  });

  return (
    <Tabs.Navigator
      tabBarOptions={{
        showLabel: false,
        keyboardHidesTabBar: true,
        style: {
          position: "absolute",
          left: 0,
          bottom: 0,
          right: 0,
          borderTopWidth: 0,
          //elevation: 0,
          height: 70 + bottom / 2,
          backgroundColor: theme.colors?.white,
          justifyContent: "center",
          elevation: 1,
          shadowOffset: {
            width: 2,
            height: 1,
          },
          shadowOpacity: 0.7,
          shadowRadius: 3,
          shadowColor: theme.colors?.grey2,
        },
      }}
    >
      <Tabs.Screen
        name="CommunityMain"
        component={CommunityMain}
        options={(navigation) => {
          return {
            tabBarVisible:
              !getFocusedRouteNameFromRoute(navigation.route) ||
              getFocusedRouteNameFromRoute(navigation.route) == "CommunityMain",
            tabBarIcon: ({ focused }) => {
              return (
                <View style={styles.tabIconContainer}>
                  <Icon
                    type="ionicon"
                    name={focused ? "home" : "home-outline"}
                    size={iconSize}
                    color={focused ? focusedColor : unFocusedColor}
                  />
                  <Text
                    style={[
                      styles.tabText,
                      {
                        color: focused ? focusedColor : unFocusedColor,
                      },
                    ]}
                  >
                    {t("mainTab.home")}
                  </Text>
                </View>
              );
            },
          };
        }}
      />

      <Tabs.Screen
        name="PetMain"
        component={PetMain}
        options={(navigation) => {
          return {
            tabBarLabel: "PetMain",
            tabBarVisible:
              !getFocusedRouteNameFromRoute(navigation.route) ||
              getFocusedRouteNameFromRoute(navigation.route) == "PetMain",
            tabBarIcon: ({ focused }) => {
              return (
                <View style={styles.tabIconContainer}>
                  <Icon
                    type="material-community"
                    name={
                      focused
                        ? "bookmark-multiple"
                        : "bookmark-multiple-outline"
                    }
                    size={iconSize}
                    color={focused ? focusedColor : unFocusedColor}
                  />
                  <Text
                    style={[
                      styles.tabText,
                      {
                        color: focused ? focusedColor : unFocusedColor,
                      },
                    ]}
                  >
                    {t("mainTab.pet")}
                  </Text>
                </View>
              );
            },
          };
        }}
      />

      <Tabs.Screen
        name="Create"
        component={createNewPlaceholder}
        options={(navigation) => {
          return {
            tabBarIcon: ({}) => {
              return (
                <View
                  style={{
                    // position: "absolute",
                    // bottom: 0,
                    // height: 72,
                    // width: 72,
                    // borderRadius: 36,
                    justifyContent: "center",
                    alignItems: "center",
                    alignContent: "center",
                    shadowOffset: {
                      width: 2,
                      height: 1,
                    },
                    shadowOpacity: 0.8,
                    shadowRadius: 3,
                    shadowColor: theme.colors?.grey2,
                    backgroundColor: focusedColor,
                    borderRadius: 30,
                    height: 46,
                    width: 46,
                  }}
                >
                  <Icon
                    containerStyle={{}}
                    type="material"
                    name="add"
                    size={32}
                    color="#fff"
                  />
                </View>
              );
            },
          };
        }}
        listeners={({ navigation }) => ({
          tabPress: (event) => {
            event.preventDefault();
            navigation.navigate("CreateNew");
          },
        })}
      />

      <Tabs.Screen
        name="NotificationMain"
        component={NotificationMain}
        options={(navigation) => {
          return {
            tabBarVisible:
              !getFocusedRouteNameFromRoute(navigation.route) ||
              getFocusedRouteNameFromRoute(navigation.route) ==
                "NotificationMain",
            tabBarIcon: ({ focused }) => {
              return (
                <View style={styles.tabIconContainer}>
                  <View>
                    <Icon
                      type="ionicon"
                      name={focused ? "notifications" : "notifications-outline"}
                      size={iconSize}
                      color={focused ? focusedColor : unFocusedColor}
                    />
                    {hasNotification ? (
                      <View
                        style={{
                          borderColor: "#ffffff",
                          borderWidth: 1,
                          width: 12,
                          height: 12,
                          backgroundColor: "red",
                          paddingHorizontal: 4,
                          position: "absolute",
                          borderRadius: 16,
                          right: 1,
                        }}
                      ></View>
                    ) : null}
                  </View>

                  <Text
                    style={[
                      styles.tabText,
                      {
                        color: focused ? focusedColor : unFocusedColor,
                      },
                    ]}
                  >
                    {t("mainTab.notification")}
                  </Text>
                </View>
              );
            },
          };
        }}
      />

      <Tabs.Screen
        name="User"
        component={User}
        options={(navigation) => {
          return {
            tabBarVisible:
              !getFocusedRouteNameFromRoute(navigation.route) ||
              getFocusedRouteNameFromRoute(navigation.route) == "User",
            tabBarIcon: ({ focused }) => {
              return (
                <View style={styles.tabIconContainer}>
                  <Icon
                    type="font-awesome"
                    name={focused ? "user" : "user-o"}
                    size={iconSize}
                    color={focused ? focusedColor : unFocusedColor}
                  />
                  <Text
                    style={[
                      styles.tabText,
                      {
                        color: focused ? focusedColor : unFocusedColor,
                      },
                    ]}
                  >
                    {t("mainTab.user")}
                  </Text>
                </View>
              );
            },
          };
        }}
      />
    </Tabs.Navigator>
  );
};

export default AppScreen;

const styles = StyleSheet.create({
  tabIconContainer: {
    alignContent: "center",
    minWidth: 30,
  },
  tabText: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 2,
  },
});
