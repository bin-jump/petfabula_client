import { Alert } from "react-native";
import { TFunction } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import "moment/locale/ja";

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
  const hour = d.getHours();
  const minute = d.getMinutes();

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

export const imageSizeUrl = (
  url: string | undefined,
  sz: "LG" | "MD" | "SM"
) => {
  if (!url) {
    return url;
  }

  return `${url}!${sz.toLowerCase()}`;
};

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
