import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  TextInput,
  ListRenderItem,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import {
  Text,
  useTheme,
  Icon,
  Divider,
  Button,
  Switch,
} from "react-native-elements";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import {
  useLoadMyNotifySetting,
  useLoadUpdateNotifySetting,
  NotifySetting,
  useLogout,
} from "@petfabula/common";
import { ActivityIndicator } from "../../shared";

const Setting = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [nofitySetting, setNotifySetting] = useState<NotifySetting>({
    receiveAnswerComment: false,
    receiveFollow: false,
    receiveUpvote: false,
  });
  const {
    loadNotifySetting,
    setting,
    pending: loadNotifySettingPending,
  } = useLoadMyNotifySetting();
  const { updateNotifySetting } = useLoadUpdateNotifySetting();

  useEffect(() => {
    loadNotifySetting();
  }, []);

  useEffect(() => {
    if (setting) {
      setNotifySetting(setting);
    }
  }, [setting]);

  const resetNavigationState = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "TabScreen" }],
      })
    );
  };

  const handleAnswerCommentChange = () => {
    const val = {
      ...nofitySetting,
      receiveAnswerComment: !nofitySetting.receiveAnswerComment,
    };
    setNotifySetting(val);
    updateNotifySetting(val);
  };

  const handleVoteChange = () => {
    const val = {
      ...nofitySetting,
      receiveUpvote: !nofitySetting.receiveUpvote,
    };
    setNotifySetting(val);
    updateNotifySetting(val);
  };

  const handleFollowChange = () => {
    const val = {
      ...nofitySetting,
      receiveFollow: !nofitySetting.receiveFollow,
    };
    setNotifySetting(val);
    updateNotifySetting(val);
  };

  return (
    <View style={{}}>
      <View
        style={{
          paddingVertical: 6,
          marginTop: 12,
          paddingHorizontal: 16,
          backgroundColor: theme.colors?.white,
          shadowColor: theme.colors?.grey3,
          shadowOffset: { width: 2, height: 4 },
          shadowOpacity: 0.3,
          elevation: 2,
          shadowRadius: 6,
        }}
      >
        <View style={styles.settingItem}>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingText}>
              {t("setting.notifyAnswerComment")}
            </Text>
            {loadNotifySettingPending ? <ActivityIndicator /> : null}
          </View>
          <Switch
            disabled={loadNotifySettingPending}
            value={nofitySetting.receiveAnswerComment}
            onValueChange={handleAnswerCommentChange}
          />
        </View>
        <Divider />

        <View style={styles.settingItem}>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingText}>{t("setting.notifyVote")}</Text>
            {loadNotifySettingPending ? <ActivityIndicator /> : null}
          </View>
          <Switch
            disabled={loadNotifySettingPending}
            value={nofitySetting.receiveUpvote}
            onValueChange={handleVoteChange}
          />
        </View>
        <Divider />

        <View style={styles.settingItem}>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingText}>{t("setting.notifyFollow")}</Text>
            {loadNotifySettingPending ? <ActivityIndicator /> : null}
          </View>
          <Switch
            disabled={loadNotifySettingPending}
            value={nofitySetting.receiveFollow}
            onValueChange={handleFollowChange}
          />
        </View>
      </View>

      <View
        style={{
          paddingVertical: 6,
          marginTop: 12,
          paddingHorizontal: 16,
          backgroundColor: theme.colors?.white,
          shadowColor: theme.colors?.grey3,
          shadowOffset: { width: 2, height: 4 },
          shadowOpacity: 0.3,
          elevation: 2,
          shadowRadius: 6,
        }}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            // resetNavigationState()
          }}
        >
          <View style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              <Text
                style={[styles.settingText, { color: theme.colors?.error }]}
              >
                {t("setting.logout")}
              </Text>
            </View>
            <Icon
              type="entypo"
              name="chevron-right"
              color={theme.colors?.grey3}
              size={24}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};

export default Setting;

const styles = StyleSheet.create({
  settingBlock: {},
  settingItem: {
    paddingLeft: 12,
    paddingRight: 12,
    height: 60,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  settingText: {
    fontSize: 18,
    marginLeft: 4,
  },
  settingTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});
