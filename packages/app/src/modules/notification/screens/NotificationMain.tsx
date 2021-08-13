import React, { useEffect } from "react";
import {
  Platform,
  View,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import { Text, useTheme, Icon, Divider } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { useCheckNotifications } from "@petfabula/common";

const Badge = ({ count }: { count: number }) => {
  const { theme } = useTheme();
  if (count == 0) {
    return null;
  }
  let val = count > 99 ? `99+` : `${count}`;
  if (count == 1) {
    val = " ";
  }

  return (
    <View
      style={{
        borderColor: "#ffffff",
        borderWidth: 2,
        minWidth: 20,
        backgroundColor: "red",
        paddingHorizontal: 4,
        position: "absolute",
        borderRadius: 16,
        top: -10,
        right: -10,
      }}
    >
      <Text
        style={{
          lineHeight: 16,
          color: "#ffffff",
          fontSize: 14,
        }}
      >
        {val}
      </Text>
    </View>
  );
};

const IconButton = ({
  count,
  type,
  name,
  color,
  text,
  onPress,
}: {
  count: number;
  type: string;
  name: string;
  text: string;
  color: string;
  onPress: () => void;
}) => {
  const { theme } = useTheme();

  return (
    <View style={{ alignItems: "center", width: 120 }}>
      <TouchableWithoutFeedback onPress={onPress}>
        <View>
          <View
            style={{
              width: 50,
              height: 50,
              borderRadius: 8,
              backgroundColor: color,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon
              type={type}
              name={name}
              size={30}
              color={theme.colors?.white}
            />
          </View>
          {/* {renderBadge(count)} */}
          <Badge count={count} />
        </View>
      </TouchableWithoutFeedback>
      <Text
        style={{
          textAlign: "center",
          paddingTop: 8,
          fontSize: 15,
          fontWeight: "bold",
        }}
      >
        {text}
      </Text>
    </View>
  );
};

const NotificationMain = () => {
  const { top } = useSafeAreaInsets();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { checkNotifications, checkResult } = useCheckNotifications();

  useEffect(() => {
    checkNotifications();
  }, []);

  return (
    <View
      style={{
        height: "100%",
        width: "100%",
        alignItems: "center",
        // justifyContent: "center",
        backgroundColor: theme.colors?.white,
        minHeight: 160,
      }}
    >
      <View
        style={{
          width: "100%",
          height: top,
          backgroundColor: theme.colors?.white,
        }}
      ></View>
      <View
        style={{
          width: "100%",
          height: 60,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.colors?.white,
          shadowColor: theme.colors?.grey2,
          shadowOffset: { width: 2, height: 4 },
          shadowOpacity: 0.3,
          elevation: 2,
          zIndex: 2,
        }}
      >
        <Text h2>{t("notification.title")}</Text>
      </View>

      {/* <ScrollView style={{}}> */}
      <View style={{ width: "100%", backgroundColor: theme.colors?.white }}>
        <View
          style={{
            paddingTop: 26,
            paddingBottom: 16,
            paddingHorizontal: 8,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
            width: "100%",
            backgroundColor: theme.colors?.white,
          }}
        >
          <IconButton
            type="font-awesome"
            name="comment"
            color="#6ebefb"
            count={checkResult?.answerCommentCount || 0}
            onPress={() => {
              navigation.navigate("SecondaryStack", {
                screen: "AnswerCommentNotifications",
              });
            }}
            text={t("notification.answerComment")}
          />
          <IconButton
            type="font-awesome"
            name="heart"
            color="#fdab90"
            text={t("notification.upvote")}
            count={checkResult?.voteCount || 0}
            onPress={() => {
              navigation.navigate("SecondaryStack", {
                screen: "UpvoteNotifications",
              });
            }}
          />
          <IconButton
            type="ionicons"
            name="people"
            color="#90b5fa"
            text={t("notification.follow")}
            count={checkResult?.followCount || 0}
            onPress={() => {
              navigation.navigate("SecondaryStack", {
                screen: "FollowNotifications",
              });
            }}
          />
        </View>
        <View
          style={{ height: 6, backgroundColor: theme.colors?.grey5 }}
        ></View>
        <View style={{}}>
          <View
            style={{
              height: 90,
              width: "100%",
              flexDirection: "row",
              paddingVertical: 16,
              paddingHorizontal: 20,
            }}
          >
            <View>
              <View
                style={{
                  borderRadius: 60,
                  width: 50,
                  height: 50,
                  backgroundColor: "#31d2c0",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Icon
                  type="materialIcons"
                  name="notifications"
                  color="white"
                  size={32}
                />
              </View>
              {checkResult?.hasSystemNotificationUnread ? (
                <Badge count={1} />
              ) : null}
            </View>

            <View
              style={{
                marginLeft: 12,
                justifyContent: "center",
              }}
            >
              <Text h4>{t("notification.systemNotification")}</Text>
            </View>
          </View>
          <Divider />
        </View>
      </View>
      {/* </ScrollView> */}
    </View>
  );
};

export default NotificationMain;
