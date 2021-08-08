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
  useReadUpvoteNotifications,
  useLoadUpvoteNotifications,
  VoteNotification,
} from "@petfabula/common";
import {
  Avatar,
  Image,
  milisecToAgo,
  LoadingMoreIndicator,
} from "../../shared";

const resolveAction = (notification: VoteNotification) => {
  if (notification.targetEntityType == "POST") {
    return "notification.action.upvotePost";
  }

  if (notification.targetEntityType == "QUESTION") {
    return "notification.action.upvoteQuestion";
  }
  return "notification.action.upvoteAnswer";
};

const resolveContent = (notification: VoteNotification) => {
  if (
    notification.targetEntityType == "POST" &&
    notification.images.length > 0
  ) {
    return "";
  }
  return `${notification.content}`;
};

const resolveNavigationAction = (
  navigation: any,
  notification: VoteNotification
) => {
  if (notification.targetEntityType == "POST") {
    return () =>
      navigation.navigate("PostDetailView", {
        id: notification.targetEntity.id,
      });
  } else {
    return () =>
      navigation.navigate("QuestionDetailView", {
        id: notification.targetEntity.id,
      });
  }
};

const VoteNotificationItem = ({
  notification,
}: {
  notification: VoteNotification;
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigation = useNavigation();

  const navigationAction = resolveNavigationAction(navigation, notification);

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        navigationAction();
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
          <Avatar source={{ uri: notification.actor.photo }} size={50} />
          <View
            style={{
              flexDirection: "row",
              flex: 1,
              justifyContent: "space-between",
            }}
          >
            <View style={{ marginLeft: 10 }}>
              <View style={{ flexDirection: "row" }}>
                <Text h4>{notification.actor.name}</Text>
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
                  {`${t(resolveAction(notification))} `}
                </Text>
                <Text
                  style={{ color: theme.colors?.grey0, fontWeight: "bold" }}
                >
                  {`${resolveContent(notification)}`}
                </Text>
              </Text>
            </View>

            {notification.targetEntityType == "POST" &&
            notification.images.length > 0 ? (
              <Image
                style={{ width: 60, height: 60, borderRadius: 6 }}
                source={{ uri: notification.images[0].url }}
              />
            ) : null}
          </View>
        </View>
        <Divider />
      </View>
    </TouchableWithoutFeedback>
  );
};

const UpvoteNotifications = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { readNotifications } = useReadUpvoteNotifications();
  const {
    loadNotifications,
    notifications,
    pending,
    nextCursor,
    initializing,
    hasMore,
    error,
  } = useLoadUpvoteNotifications();

  useEffect(() => {
    loadNotifications(null);
    readNotifications();
  }, []);

  const keyExtractor = (item: VoteNotification) => item.id.toString();
  const renderItem = useCallback<ListRenderItem<VoteNotification>>(
    ({ item }) => {
      return <VoteNotificationItem notification={item} />;
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

export default UpvoteNotifications;
