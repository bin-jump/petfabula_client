import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { Platform, View, Text } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { ThemeContext, Icon } from "react-native-elements";
import { useTranslation } from "react-i18next";
import AuthenticaionScreen from "../modules/authentication";
import Community from "../modules/community";
import Ask from "../modules/ask";
import User from "../modules/user";
import NotificationScreen from "../modules/notification";

const Tabs = createBottomTabNavigator();
const TopStack = createStackNavigator();

const AppScreen = () => {
  const { theme } = React.useContext(ThemeContext);
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
      <TopStack.Navigator>
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
          name="AuthenticaionScreen"
          component={AuthenticaionScreen}
        />
      </TopStack.Navigator>
    </NavigationContainer>
  );
};

const TabScreen = () => {
  const { theme } = React.useContext(ThemeContext);
  const { t } = useTranslation();
  const focusedColor = theme.colors?.primary;
  const unFocusedColor = theme.colors?.grey1;

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
          borderTopWidth: 1,
          elevation: 0,
          height: Platform.OS == "ios" ? 86 : 70,
          backgroundColor: theme.colors?.white,
          justifyContent: "center",
        },
      }}
    >
      <Tabs.Screen
        name="Community"
        component={Community}
        options={(navigation) => {
          return {
            tabBarVisible:
              !getFocusedRouteNameFromRoute(navigation.route) ||
              getFocusedRouteNameFromRoute(navigation.route) == "Community",
            tabBarIcon: ({ focused }) => {
              return (
                <View style={{ alignContent: "center" }}>
                  <Icon
                    type="ionicon"
                    name={focused ? "home" : "home-outline"}
                    size={24}
                    color={focused ? focusedColor : unFocusedColor}
                  />
                  <Text
                    style={{
                      textAlign: "center",
                      color: focused ? focusedColor : unFocusedColor,
                    }}
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
        name="Ask"
        component={Ask}
        options={(navigation) => {
          return {
            tabBarLabel: "aaa",
            tabBarVisible:
              !getFocusedRouteNameFromRoute(navigation.route) ||
              getFocusedRouteNameFromRoute(navigation.route) == "Ask",
            tabBarIcon: ({ focused }) => {
              return (
                <View style={{ alignContent: "center" }}>
                  <Icon
                    type="font-awesome"
                    name={focused ? "file-text" : "file-text-o"}
                    size={20}
                    color={focused ? focusedColor : unFocusedColor}
                  />
                  <Text
                    style={{
                      marginTop: 6,
                      textAlign: "center",
                      color: focused ? focusedColor : unFocusedColor,
                    }}
                  >
                    {t("mainTab.question")}
                  </Text>
                </View>
              );
            },
          };
        }}
      />

      <Tabs.Screen
        name="NotificationScreen"
        component={NotificationScreen}
        options={(navigation) => {
          return {
            tabBarVisible:
              !getFocusedRouteNameFromRoute(navigation.route) ||
              getFocusedRouteNameFromRoute(navigation.route) ==
                "NotificationScreen",
            tabBarIcon: ({ focused }) => {
              return (
                <View style={{ alignContent: "center" }}>
                  <Icon
                    type="ionicon"
                    name={focused ? "notifications" : "notifications-outline"}
                    size={28}
                    color={focused ? focusedColor : unFocusedColor}
                  />
                  <Text
                    style={{
                      marginTop: 6,
                      textAlign: "center",
                      color: focused ? focusedColor : unFocusedColor,
                    }}
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
                <View style={{ alignContent: "center" }}>
                  <Icon
                    type="font-awesome"
                    name={focused ? "user" : "user-o"}
                    size={26}
                    color={focused ? focusedColor : unFocusedColor}
                  />
                  <Text
                    style={{
                      marginTop: 3,
                      textAlign: "center",
                      color: focused ? focusedColor : unFocusedColor,
                    }}
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
