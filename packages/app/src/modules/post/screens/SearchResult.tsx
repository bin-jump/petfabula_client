import React, { useState, useRef, useCallback } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, useTheme, Icon } from "react-native-elements";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import {
  createMaterialTopTabNavigator,
  MaterialTopTabBarProps,
} from "@react-navigation/material-top-tabs";
import {
  BlankInput,
  useDidUpdateEffect,
  DismissKeyboardView,
  PendingOverlay,
} from "../../shared";
import PostSearch from "./PostSearch";
import TabBar from "../components/TabBar";
import ParamTypes from "./paramTypes";

const Tab = createMaterialTopTabNavigator();

const Header = ({ keyword }: { keyword: string }) => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  return (
    <View
      style={{
        backgroundColor: theme.colors?.white,
        height: 70,
        width: "100%",
        paddingHorizontal: 12,
        justifyContent: "center",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-between",
          marginRight: 12,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={{
            justifyContent: "center",
          }}
        >
          <Icon
            type="antdesign"
            name="left"
            size={24}
            color={theme.colors?.grey0}
          />
        </TouchableOpacity>

        <TouchableWithoutFeedback
          onPress={() => {
            navigation.goBack();
          }}
          style={{
            alignItems: "center",
            flex: 1,
          }}
        >
          <View
            style={{
              marginLeft: 12,
              flexDirection: "row",
              backgroundColor: theme.colors?.grey4,
              height: 40,
              borderRadius: 10,
              paddingLeft: 12,
              alignItems: "center",
              flex: 1,
            }}
          >
            <Icon
              type="font-awesome"
              name="search"
              size={20}
              color={theme.colors?.grey0}
            />
            {/* <TextInput
              editable={false}
              value={keyword}
              style={{ fontSize: 18, marginLeft: 8, marginRight: 8, flex: 1 }}
            /> */}
            <View style={{ marginLeft: 8, marginRight: 8, flex: 1 }}>
              <Text style={{ fontSize: 18 }}>{keyword}</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};

const SearchResult = () => {
  const navigation = useNavigation();
  const { top, bottom } = useSafeAreaInsets();
  const { t } = useTranslation();
  const { theme } = useTheme();

  const { params } = useRoute<RouteProp<ParamTypes, "SearchResult">>();
  const { keyword } = params;

  const renderTabBar = useCallback<
    (props: MaterialTopTabBarProps) => React.ReactElement
  >(
    (props) => (
      <TabBar onIndexChange={() => {}} style={{ height: 40 }} {...props} />
    ),
    []
  );

  const renderRecommends = () => <PostSearch keyword={keyword} />;

  return (
    <DismissKeyboardView>
      <View>
        <View
          style={{
            height: top,
            backgroundColor: theme.colors?.white,
            zIndex: 2,
          }}
        ></View>
        <Header keyword={keyword} />

        <View style={{ width: "100%", height: "100%" }}>
          <Tab.Navigator tabBar={renderTabBar}>
            <Tab.Screen
              options={{ tabBarLabel: t("search.postSearch") }}
              name="PostSearch"
            >
              {renderRecommends}
            </Tab.Screen>
          </Tab.Navigator>
        </View>
      </View>
    </DismissKeyboardView>
  );
};

export default SearchResult;
