import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import "moment/locale/ja";

moment.locale("ja");

export const milisecToAgo = (mili: number) => {
  return moment(mili).fromNow();
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
