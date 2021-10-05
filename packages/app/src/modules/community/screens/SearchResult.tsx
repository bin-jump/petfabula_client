import React, { useCallback } from "react";
import {
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, useTheme, Icon } from "react-native-elements";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import {
  createMaterialTopTabNavigator,
  MaterialTopTabBarProps,
  MaterialTopTabBar,
} from "@react-navigation/material-top-tabs";
import PostSearch from "./PostSearch";
import QuestionAnswerSearch from "./QuestionAnswerSearch";
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
  const { width } = useWindowDimensions();

  const TabIndicatorLeft = (width - 240) / 2 + (120 - 30) / 2;

  const { params } = useRoute<RouteProp<ParamTypes, "SearchResult">>();
  const { keyword } = params;

  const renderTabBar = useCallback<
    (props: MaterialTopTabBarProps) => React.ReactElement
  >(
    (props) => (
      <MaterialTopTabBar
        // scrollEnabled

        activeTintColor={theme.colors?.black}
        inactiveTintColor={theme.colors?.grey1}
        labelStyle={{
          fontSize: 16,
          fontWeight: "bold",
          paddingBottom: 18,
        }}
        tabStyle={{
          paddingBottom: 18,
          width: 120,
        }}
        indicatorStyle={{
          backgroundColor: theme.colors?.primary,
          // marginHorizontal: 35,
          width: 30,
          // marginBottom: 6,
          left: TabIndicatorLeft,
          height: 3,
          borderRadius: 3,
        }}
        {...props}
        style={{
          backgroundColor: theme.colors?.white,
        }}
        contentContainerStyle={{
          height: 42,
          justifyContent: "center",
        }}
      />
    ),
    [theme]
  );

  const renderPostSearchResult = () => <PostSearch keyword={keyword} />;

  const renderQuestionSearchResult = () => (
    <QuestionAnswerSearch keyword={keyword} />
  );

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          height: top,
          backgroundColor: theme.colors?.white,
          zIndex: 2,
        }}
      ></View>
      <Header keyword={keyword} />

      <Tab.Navigator tabBar={renderTabBar}>
        <Tab.Screen
          options={{ tabBarLabel: t("search.postSearch") }}
          name="PostSearch"
        >
          {renderPostSearchResult}
        </Tab.Screen>
        <Tab.Screen
          options={{ tabBarLabel: t("search.questionSearch") }}
          name="QuestionSearch"
        >
          {renderQuestionSearchResult}
        </Tab.Screen>
      </Tab.Navigator>
    </View>
  );
};

export default SearchResult;
