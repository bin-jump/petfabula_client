import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import languageDetector from "./languageDetector";
import translationJA from "./lang/ja.json";

const resources = {
  ja: {
    translation: translationJA,
  },
};

i18n
  .use(initReactI18next)
  .use(languageDetector)
  .init({
    resources,
    lng: "ja",

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
