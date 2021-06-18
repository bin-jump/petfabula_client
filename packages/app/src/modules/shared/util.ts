import moment from "moment";
import "moment/locale/ja";

moment.locale("ja");

export const milisecToAgo = (mili: number) => {
  return moment(mili).fromNow();
};
