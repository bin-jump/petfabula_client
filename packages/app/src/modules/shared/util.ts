import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import "moment/locale/ja";

moment.locale("ja");

export const milisecToAgo = (mili: number) => {
  return moment(mili).fromNow();
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
