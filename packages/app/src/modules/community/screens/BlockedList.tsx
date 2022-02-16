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

import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Participator, useLoadMyBlocked } from "@petfabula/common";
import { useTheme, Text, Divider, Icon, Button } from "react-native-elements";
import {
  Avatar,
  useFirstFocusEffect,
  LoadingMoreIndicator,
  useRefocusEffect,
  AvatarField,
  FlatList,
  ActivityIndicator,
} from "../../shared";

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

const BlockList = () => {
  const { theme } = useTheme();

  const {
    loadMyBlocked,
    users,
    pending,
    nextCursor,
    initializing,
    hasMore,
    error,
  } = useLoadMyBlocked();

  useEffect(() => {
    loadMyBlocked(null);
  }, []);

  const keyExtractor = (item: Participator) => item.id.toString();

  const renderItem = useCallback<ListRenderItem<Participator>>(({ item }) => {
    return <UserItem user={item} />;
  }, []);

  return (
    <View>
      <Divider />
      <FlatList
        contentContainerStyle={{ paddingBottom: 20, minHeight: "100%" }}
        style={{ backgroundColor: theme.colors?.white }}
        keyExtractor={keyExtractor}
        data={users}
        // data={new Array(20).fill(users).flat()}
        renderItem={renderItem}
        pending={initializing}
        ListFooterComponent={hasMore ? <LoadingMoreIndicator /> : null}
        onEndReached={() => {
          if (hasMore && !pending && !error) {
            loadMyBlocked(nextCursor);
          }
        }}
        onEndReachedThreshold={0.2}
      />
    </View>
  );
};

export default BlockList;
