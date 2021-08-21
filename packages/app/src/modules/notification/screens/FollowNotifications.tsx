import React, { useEffect, useCallback } from "react";
import {
  Platform,
  View,
  TouchableWithoutFeedback,
  ListRenderItem,
  FlatList,
} from "react-native";
import { Text, useTheme, Icon, Divider } from "react-native-elements";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import {
  useReadFollowNotifications,
  useLoadFollowNotifications,
  FollowNotification,
} from "@petfabula/common";
import {
  Avatar,
  Image,
  milisecToAgo,
  LoadingMoreIndicator,
} from "../../shared";

const FollowNotificationItem = ({
  notification,
}: {
  notification: FollowNotification;
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigation = useNavigation();

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        navigation.navigate("UserProfile", {
          id: notification.follower.id,
        });
      }}
    >
      <View>
        <View
          style={{
            height: 90,
            backgroundColor: theme.colors?.white,
            // justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 16,
            flexDirection: "row",
          }}
        >
          <Avatar source={{ uri: notification.follower.photo }} size={50} />
          <View
            style={{
              flexDirection: "row",
              flex: 1,
              justifyContent: "space-between",
            }}
          >
            <View style={{ marginLeft: 10 }}>
              <View style={{ flexDirection: "row" }}>
                <Text h4>{notification.follower.name}</Text>
                <Text
                  style={{
                    marginLeft: 20,
                    color: theme.colors?.grey1,
                    fontSize: 14,
                  }}
                >
                  {`${milisecToAgo(notification.createdDate)}`}
                </Text>
              </View>

              <Text numberOfLines={2}>
                <Text style={{ color: theme.colors?.grey0 }}>
                  {`${t("notification.action.follow")} `}
                </Text>
              </Text>
            </View>
          </View>
        </View>
        <Divider />
      </View>
    </TouchableWithoutFeedback>
  );
};

const FollowNotifications = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { readNotifications } = useReadFollowNotifications();
  const {
    loadNotifications,
    notifications,
    pending,
    nextCursor,
    initializing,
    hasMore,
    error,
  } = useLoadFollowNotifications();

  useEffect(() => {
    loadNotifications(null);
    readNotifications();
  }, []);

  const keyExtractor = (item: FollowNotification) => item.id.toString();
  const renderItem = useCallback<ListRenderItem<FollowNotification>>(
    ({ item }) => {
      return <FollowNotificationItem notification={item} />;
    },
    []
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors?.white }}>
      <Divider />
      <FlatList
        style={{ flexGrow: 1 }}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        data={notifications}
        ListFooterComponent={hasMore ? <LoadingMoreIndicator /> : null}
        onEndReached={() => {
          if (hasMore && !pending && !error) {
            loadNotifications(nextCursor);
          }
        }}
        onEndReachedThreshold={0.2}
      />
    </View>
  );
};

export default FollowNotifications;
