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
