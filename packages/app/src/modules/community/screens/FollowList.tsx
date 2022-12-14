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
  useWindowDimensions,
  ScrollView,
  ListRenderItem,
  TouchableWithoutFeedback,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useTheme, Text, Divider, Icon, Button } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  createMaterialTopTabNavigator,
  MaterialTopTabBarProps,
  MaterialTopTabBar,
} from "@react-navigation/material-top-tabs";
import { useTranslation } from "react-i18next";
import {
  Participator,
  ParticipatorDetail,
  useLoadUserFollower,
  useLoadUserFollowed,
} from "@petfabula/common";
import {
  Avatar,
  useFirstFocusEffect,
  LoadingMoreIndicator,
  useRefocusEffect,
  AvatarField,
  FlatList,
  ActivityIndicator,
} from "../../shared";
import ParamTypes from "./ParamTypes";
import TabBar from "../components/TabBar";

const Tab = createMaterialTopTabNavigator();

const UserItem = ({ user }: { user: Participator }) => {
  const navigation = useNavigation<StackNavigationProp<any>>();

  return (
    <View>
      <TouchableWithoutFeedback
        onPress={() => {
          navigation.push("UserProfile", { id: user.id });
        }}
      >
        <View style={{ height: 80, justifyContent: "center", paddingLeft: 16 }}>
          <AvatarField
            photo={user.photo}
            size={42}
            name={user.name}
            nameStyle={{ marginLeft: 10, fontWeight: "bold" }}
          />
        </View>
      </TouchableWithoutFeedback>
      <Divider />
    </View>
  );
};

const Followed = ({ id }: { id: number }) => {
  const {
    userId,
    loadFollowed,
    users,
    pending,
    nextCursor,
    initializing,
    hasMore,
    error,
  } = useLoadUserFollowed();
  const { theme } = useTheme();

  useRefocusEffect(() => {
    if (userId != id) {
      loadFollowed(id, null);
    }
  }, [userId, id, loadFollowed]);

  useFirstFocusEffect(() => {
    loadFollowed(id, null);
  }, [id, loadFollowed]);

  const keyExtractor = (item: Participator) => item.id.toString();

  const renderItem = useCallback<ListRenderItem<Participator>>(({ item }) => {
    return <UserItem user={item} />;
  }, []);

  return (
    <FlatList
      contentContainerStyle={[styles.listContainer]}
      style={{ backgroundColor: theme.colors?.white }}
      keyExtractor={keyExtractor}
      data={users}
      renderItem={renderItem}
      pending={initializing}
      ListFooterComponent={hasMore ? <LoadingMoreIndicator /> : null}
      onEndReached={() => {
        if (hasMore && !pending && !error && userId) {
          loadFollowed(userId, nextCursor);
        }
      }}
      onEndReachedThreshold={0.2}
    />
  );
};

const Follower = ({ id }: { id: number }) => {
  const {
    userId,
    loadFollower,
    users,
    pending,
    nextCursor,
    initializing,
    hasMore,
    error,
  } = useLoadUserFollower();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { theme } = useTheme();

  useRefocusEffect(() => {
    if (userId != id) {
      loadFollower(id, null);
    }
  }, [userId, id, loadFollower]);

  useFirstFocusEffect(() => {
    loadFollower(id, null);
  }, [id, loadFollower]);

  const keyExtractor = (item: Participator) => item.id.toString();

  const renderItem = useCallback<ListRenderItem<Participator>>(({ item }) => {
    return <UserItem user={item} />;
  }, []);

  return (
    <FlatList
      contentContainerStyle={[styles.listContainer]}
      style={{ backgroundColor: theme.colors?.white }}
      keyExtractor={keyExtractor}
      data={users}
      renderItem={renderItem}
      pending={initializing}
      ListFooterComponent={hasMore ? <LoadingMoreIndicator /> : null}
      onEndReached={() => {
        if (hasMore && !pending && !error && userId) {
          loadFollower(userId, nextCursor);
        }
      }}
      onEndReachedThreshold={0.2}
    />
  );
};

const FollowList = () => {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const { theme } = useTheme();
  const { params } = useRoute<RouteProp<ParamTypes, "FollowList">>();
  const user = params.user;
  const id = user.id;
  const initialTab = params.initialTab ? params.initialTab : "Followed";

  const navigation = useNavigation<StackNavigationProp<any>>();

  const TabIndicatorLeft = (width - 240) / 2 + (120 - 30) / 2;

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

  const renderFollowed = useCallback(() => <Followed id={id} />, [id]);

  const renderFollower = useCallback(() => <Follower id={id} />, []);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <AvatarField
            photo={user.photo}
            size={42}
            name={user.name}
            nameStyle={{ marginLeft: 10, fontWeight: "bold" }}
          />
        </View>
      ),
    });
  }, [user, navigation]);

  return (
    <Tab.Navigator initialRouteName={initialTab} tabBar={renderTabBar}>
      <Tab.Screen
        options={{ tabBarLabel: t("user.userFollowed") }}
        name="Followed"
      >
        {renderFollowed}
      </Tab.Screen>

      <Tab.Screen
        options={{ tabBarLabel: t("user.userFollower") }}
        name="Follower"
      >
        {renderFollower}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default FollowList;

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 30,
  },
});
