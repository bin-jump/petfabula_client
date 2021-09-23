import React, { useEffect, useCallback } from "react";
import {
  Platform,
  View,
  TouchableWithoutFeedback,
  ListRenderItem,
} from "react-native";
import { Text, useTheme, Icon, Divider } from "react-native-elements";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import {
  useLoadSystemNotifications,
  useReadSystemNotifications,
  SystemNotification,
} from "@petfabula/common";
import {
  toDateText,
  LoadingMoreIndicator,
  FlatList,
  ActivityIndicator,
} from "../../shared";

const SystemNotificationItem = ({
  notification,
}: {
  notification: SystemNotification;
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <View style={{ paddingHorizontal: 24, paddingBottom: 30 }}>
      <Text
        style={{
          textAlign: "center",
          marginBottom: 12,
          color: theme.colors?.grey0,
        }}
      >
        {toDateText(notification.createdDate)}
      </Text>
      <View
        style={{
          minHeight: 160,
          backgroundColor: theme.colors?.white,
          borderRadius: 8,
          shadowOffset: {
            width: 2,
            height: 1,
          },
          shadowOpacity: 0.5,
          shadowRadius: 3,
          shadowColor: theme.colors?.grey2,
          elevation: 2,
          padding: 20,
          paddingBottom: 24,
        }}
      >
        <View style={{ marginBottom: 12 }}>
          <Text style={{ textAlign: "center", marginBottom: 12 }} h3>
            {notification.title}
          </Text>
          <Divider />
        </View>

        <View>
          <Text style={{ fontSize: 18, lineHeight: 24 }}>
            {notification.content}
          </Text>
        </View>
      </View>
    </View>
  );
};

const SystemNotifications = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { readNotifications } = useReadSystemNotifications();
  const {
    loadNotifications,
    notifications,
    pending,
    nextCursor,
    initializing,
    hasMore,
    error,
  } = useLoadSystemNotifications();

  useEffect(() => {
    loadNotifications(null);
    readNotifications();
  }, []);

  const keyExtractor = (item: SystemNotification) => item.id.toString();
  const renderItem = useCallback<ListRenderItem<SystemNotification>>(
    ({ item }) => {
      return <SystemNotificationItem notification={item} />;
    },
    []
  );

  return (
    <View style={{ flex: 1 }}>
      <Divider />
      <FlatList
        style={{ flexGrow: 1 }}
        contentContainerStyle={{ paddingTop: 24 }}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        data={notifications}
        pending={initializing}
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

export default SystemNotifications;
