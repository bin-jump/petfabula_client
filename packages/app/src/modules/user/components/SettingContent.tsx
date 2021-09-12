import * as React from "react";
import {
  Platform,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import {
  Text,
  Button,
  Icon,
  useTheme,
  Divider,
  Switch,
} from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  useCurrentUser,
  useLoadMyProfile,
  useLoadMyPets,
  PetDetail,
} from "@petfabula/common";
import {
  Avatar,
  toAge,
  toAgeMonth,
  daysTillNow,
  useFirstFocusEffect,
} from "../../shared";

const Settings = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();

  return (
    <View
      style={{
        paddingVertical: 6,
        marginTop: 12,
        paddingHorizontal: 16,
        backgroundColor: theme.colors?.white,
        // flex: 1,
        shadowColor: theme.colors?.grey3,
        shadowOffset: { width: 2, height: 4 },
        shadowOpacity: 0.3,
        elevation: 2,
        shadowRadius: 6,
      }}
    >
      {/* <View style={styles.settingItem}>
        <View style={styles.settingTextContainer}>
          <Text style={styles.settingText}>
            {t("setting.notifyAnswerComment")}
          </Text>
        </View>
        <Switch />
      </View>
      <Divider />

      <View style={styles.settingItem}>
        <View style={styles.settingTextContainer}>
          <Text style={styles.settingText}>{t("setting.notifyLike")}</Text>
        </View>
        <Switch />
      </View>
      <Divider />

      <View style={styles.settingItem}>
        <View style={styles.settingTextContainer}>
          <Text style={styles.settingText}>{t("setting.notifyFollow")}</Text>
        </View>
        <Switch />
      </View>
      <Divider /> */}

      <TouchableWithoutFeedback
        onPress={() => {
          navigation.navigate("Setting");
        }}
      >
        <View style={styles.settingItem}>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingText}>{t("setting.setting")}</Text>
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

      <View style={styles.settingItem}>
        <View style={styles.settingTextContainer}>
          <Text style={styles.settingText}>{t("setting.userAgreement")}</Text>
        </View>
        <Icon
          type="entypo"
          name="chevron-right"
          color={theme.colors?.grey3}
          size={24}
        />
      </View>
      <Divider />

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
      <Divider />

      <TouchableWithoutFeedback
        onPress={() => {
          navigation.navigate("CreateNew", {
            screen: "CreateFeedback",
          });
        }}
      >
        <View style={styles.settingItem}>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingText}>{t("setting.feedback")}</Text>
          </View>
          <Icon
            type="entypo"
            name="chevron-right"
            color={theme.colors?.grey3}
            size={24}
          />
        </View>
      </TouchableWithoutFeedback>

      {/* <Divider />

      <View style={styles.settingItem}>
        <View style={styles.settingTextContainer}>
          <Text style={styles.settingText}>{t("setting.logout")}</Text>
        </View>
        <Icon
          type="entypo"
          name="chevron-right"
          color={theme.colors?.grey3}
          size={24}
        />
      </View> */}
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  settingItem: {
    paddingLeft: 12,
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
