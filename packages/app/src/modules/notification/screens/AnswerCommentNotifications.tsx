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
  useReadAnswerCommentNotifications,
  useLoadAnswerCommentNotifications,
  AnswerCommentNotification,
} from "@petfabula/common";
import { Avatar, Image, milisecToAgo } from "../../shared";

const resolveAction = (notification: AnswerCommentNotification) => {
  if (notification.actionType == "ANSWER") {
    return "notification.action.answerQuestion";
  }
  if (notification.actionType == "REPLY") {
    return "notification.action.replyComment";
  }
  if (notification.targetEntityType == "POST") {
    return "notification.action.commentPost";
  }
  return "notification.action.commentAnswer";
};

const resolveContent = (notification: AnswerCommentNotification) => {
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
  notification: AnswerCommentNotification
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

const AnswerCommentNotificationItem = ({
  notification,
}: {
  notification: AnswerCommentNotification;
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

const AnswerCommentNotifications = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { readNotifications } = useReadAnswerCommentNotifications();
  const {
    loadNotifications,
    notifications,
    pending,
    nextCursor,
    initializing,
  } = useLoadAnswerCommentNotifications();

  useEffect(() => {
    loadNotifications(null);
  }, []);

  const keyExtractor = (item: AnswerCommentNotification) => item.id.toString();
  const renderItem = useCallback<ListRenderItem<AnswerCommentNotification>>(
    ({ item }) => {
      return (
        <AnswerCommentNotificationItem
          // onPress={() => {
          //   navigation.navigate("SecondaryStack", {
          //     screen: "QuestionDetailView",
          //     params: {
          //       id: item.id,
          //     },
          //   });
          // }}
          notification={item}
        />
      );
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
      />
    </View>
  );
};

export default AnswerCommentNotifications;
