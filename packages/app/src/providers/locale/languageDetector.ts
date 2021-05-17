import { systemLanguage } from "./helper";

const languageDetector: {
  type: "languageDetector";
  async: boolean;
  detect: (callback: any) => void;
  init: () => void;
  cacheUserLanguage: () => void;
} = {
  type: "languageDetector",
  async: true,
  detect: (callback: any) => {
    callback(systemLanguage());
  },
  init: () => {},
  cacheUserLanguage: () => {},
};

export default languageDetector;
