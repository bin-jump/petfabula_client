import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { Platform, View, Text } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { ThemeContext, Icon } from "react-native-elements";

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
      </TopStack.Navigator>
    </NavigationContainer>
  );
};

const TabScreen = () => {
  const { theme } = React.useContext(ThemeContext);

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
                    type="ionicons"
                    name="home"
                    size={32}
                    color={
                      focused ? theme.colors?.primary : theme.colors?.grey3
                    }
                  />
                  <Text
                    style={{
                      color: focused
                        ? theme.colors?.primary
                        : theme.colors?.grey3,
                    }}
                  >
                    {"Home"}
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
                    name="file-text"
                    size={24}
                    color={
                      focused ? theme.colors?.primary : theme.colors?.grey3
                    }
                  />
                  <Text
                    style={{
                      color: focused
                        ? theme.colors?.primary
                        : theme.colors?.grey3,
                    }}
                  >
                    {"Question"}
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
                    type="font-awesome"
                    name="bell"
                    size={26}
                    color={
                      focused ? theme.colors?.primary : theme.colors?.grey3
                    }
                  />
                  <Text
                    style={{
                      color: focused
                        ? theme.colors?.primary
                        : theme.colors?.grey3,
                    }}
                  >
                    {"Notification"}
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
                    name="user"
                    size={30}
                    color={
                      focused ? theme.colors?.primary : theme.colors?.grey3
                    }
                  />
                  <Text
                    style={{
                      color: focused
                        ? theme.colors?.primary
                        : theme.colors?.grey3,
                    }}
                  >
                    {"User"}
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
