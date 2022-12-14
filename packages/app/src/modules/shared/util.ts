import { Alert } from "react-native";
import { TFunction } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import moment from "moment";
import "moment/locale/ja";
import { logoutHandleRegister, LogoutHandler } from "@petfabula/common";

// clear storage on logout
const logoutHandler: LogoutHandler = {
  handle() {
    AsyncStorage.getAllKeys().then((keys) => AsyncStorage.multiRemove(keys));
  },
};
logoutHandleRegister.register(logoutHandler);

moment.locale("ja");

export const milisecToAgo = (mili: number) => {
  return moment(mili).fromNow();
};

export const toDate = (mili: number) => {
  const d = moment(mili).toDate();
  return d;
};

export const toDateText = (mili: number) => {
  const d = toDate(mili);
  const year = d.getFullYear();
  let month = "" + (d.getMonth() + 1);
  let day = "" + d.getDate();
  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;
  return `${year}, ${month}/${day}`;
};

export const getMonthDateText = (mili: number) => {
  let d = toDate(mili),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate();

  return `${month}/${day}`;
};

export const getTimeText = (mili: number) => {
  let d = toDate(mili);
  let hour = d.getHours().toString();
  let minute = d.getMinutes().toString();

  if (hour.length < 2) hour = "0" + hour;
  if (minute.length < 2) minute = "0" + minute;

  return `${hour}:${minute}`;
};

export const toAge = (birth: number) => {
  const today = new Date();
  const birthDate = new Date(birth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export const toAgeMonth = (birth: number) => {
  const today = new Date();
  const birthDate = new Date(birth);
  const m = (today.getMonth() + 12 - birthDate.getMonth()) % 12;

  return m;
};

export const daysTillNow = (mili: number) => {
  const today = new Date().getTime();
  const res = (today - mili) / (1000 * 60 * 60 * 24);

  return Math.floor(res);
};

export const parseUrlParams = (url: string): { [key: string]: string } => {
  const queryParamIndex = url.indexOf("?");
  if (queryParamIndex < 0) {
    return {};
  }
  url = url.substring(queryParamIndex + 1);
  const hashes = url.split("&");
  return hashes.reduce((params, hash) => {
    const split = hash.indexOf("=");
    const key = hash.slice(0, split);
    const val = hash.slice(split + 1);
    return { ...params, [key]: decodeURIComponent(val) };
  }, {});
};

export const formatNumber = (num: number) => {
  if (num < 1000) {
    return `${num}`;
  }
  let res = "";
  let f = 1000;
  while (num > 1000) {
    let m = `${num % f}`;
    m = "0".repeat(3 - m.length) + m;
    num = Math.floor(num / f);
    res = res ? `${m},${res}` : `${m}`;
    f *= 1000;
  }

  return `${num},${res}`;
};

export const sameDay = (m1: number, m2: number) => {
  const d1 = new Date(m1),
    d2 = new Date(m2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

// export const imageSizeUrl = (
//   url: string | undefined,
//   sz: "LG" | "MD" | "SM"
// ) => {
//   if (!url) {
//     return url;
//   }

//   return `${url}!${sz.toLowerCase()}`;
// };

export class AlertAction {
  static AlertDelele(t: TFunction<"translation">, action: () => void) {
    Alert.alert(t("common.alertDelete"), "", [
      {
        text: t("common.cancel"),
        // onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: t("common.ok"), onPress: action },
    ]);
  }

  static AlertWithMessage(
    t: TFunction<"translation">,
    messageKey: string,
    action: () => void
  ) {
    Alert.alert(t(messageKey), "", [
      {
        text: t("common.cancel"),
        // onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: t("common.ok"), onPress: action },
    ]);
  }

  static AlertLogout(t: TFunction<"translation">, action: () => void) {
    Alert.alert(t("setting.alertLogout"), "", [
      {
        text: t("common.cancel"),
        // onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: t("common.ok"), onPress: action },
    ]);
  }
}

export class Storage {
  static async setItem(key: string, value: any) {
    return await AsyncStorage.setItem(key, JSON.stringify(value));
  }

  static async getItem(key: string) {
    const data = await AsyncStorage.getItem(key);
    if (!data) {
      return null;
    }
    return JSON.parse(data);
  }

  static async removeItem(key: string) {
    return await AsyncStorage.removeItem(key);
  }

  static async mergeItem(key: string, value: any) {
    return await AsyncStorage.mergeItem(key, JSON.stringify(value));
  }
}

export const getFileName = (path: string) => {
  return path.substring(path.lastIndexOf("/") + 1);
};

export const changeExtName = (filename: string, ext: string) => {
  const fileWithoutExt = filename.split(".").slice(0, -1).join(".");
  return `${fileWithoutExt}.${ext}`;
};

export const validSelect = (item: any) => {
  return (
    item &&
    !(item && Object.keys(item).length === 0 && item.constructor === Object)
  );
};

export class SecureStorage {
  static async setItem(key: string, value: any) {
    return await SecureStore.setItemAsync(key, JSON.stringify(value));
  }

  static async getItem(key: string) {
    const data = await SecureStore.getItemAsync(key);
    if (!data) {
      return null;
    }
    return JSON.parse(data);
  }

  static async removeItem(key: string) {
    return await SecureStore.deleteItemAsync(key);
  }
}
