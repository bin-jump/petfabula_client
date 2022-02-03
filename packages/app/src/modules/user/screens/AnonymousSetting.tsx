import React, { useState, useEffect, useRef } from "react";
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
import { useCurrentUser } from "@petfabula/common";
import {
  ActivityIndicator,
  useDidUpdateEffect,
  AlertAction,
  CacheManager,
  useIsMounted,
  PendingOverlay,
} from "../../shared";

const cacheSizeText = (size: number) => {
  const gb = Math.floor(size / (1024 * 1024 * 1024));
  const remain = size % (1024 * 1024 * 1024);
  const mb = (remain / (1024 * 1024)).toFixed(1);

  if (gb == 0) {
    return `${mb} MB`;
  }

  return `${gb} GB ${mb} MbB`;
};

const AnonymousSetting = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { isMounted } = useIsMounted();
  const [cacheStatus, setCacheStatus] = useState({
    cacheSize: "",
    pending: false,
    clearing: false,
  });
  const { currentUser } = useCurrentUser();

  useEffect(() => {
    setCacheStatus({ ...cacheStatus, pending: true });
    CacheManager.getCacheSize().then((value) => {
      if (isMounted.current) {
        setCacheStatus({
          clearing: false,
          pending: false,
          cacheSize: cacheSizeText(value),
        });
      }
    });
  }, []);

  return (
    <View style={{}}>
      <PendingOverlay pending={cacheStatus.clearing} />
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
          disabled={cacheStatus.pending}
          onPress={() => {
            // resetNavigationState()
            AlertAction.AlertWithMessage(t, "setting.alertCacheClear", () => {
              setCacheStatus({ ...cacheStatus, clearing: true });
              CacheManager.clearCache().then(() => {
                if (isMounted.current) {
                  setCacheStatus({
                    ...cacheStatus,
                    cacheSize: cacheSizeText(0),
                    clearing: false,
                  });
                }
              });
            });
          }}
        >
          <View style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              <Text>
                <Text style={[styles.settingText]}>{`${t(
                  "setting.cacheClear"
                )}  `}</Text>
                <Text
                  style={[styles.settingText, { color: theme.colors?.grey1 }]}
                >{`${cacheStatus.cacheSize} `}</Text>
              </Text>
              {cacheStatus.pending ? <ActivityIndicator /> : null}
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
            navigation.navigate("UserAgreement");
          }}
        >
          <View style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingText}>
                {t("setting.userAgreement")}
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
        <Divider />

        <TouchableWithoutFeedback
          onPress={() => {
            navigation.navigate("PrivacyAgreement");
          }}
        >
          <View style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              {/* <Icon
            name="eye-outline"
            type="ionicon"
            size={28}
            color={theme.colors?.black}
          /> */}
              <Text style={styles.settingText}>
                {t("setting.privacyAgreement")}
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

export default AnonymousSetting;

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
