import * as Localization from "expo-localization";

export const systemLanguage = () => {
  return Localization.locale.split("-")[0].toLowerCase();
};
