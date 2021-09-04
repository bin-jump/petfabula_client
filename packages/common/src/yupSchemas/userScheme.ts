import * as yup from 'yup';
import { userMessageKey, commonMessageKey } from './messageKeys';
import { endOfToday, isPositive, recordDateTimeSpan } from './helper';

export const validAccountSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .matches(/^[\w\-ぁ-んァ-ヶ一-龠々ー]{3,16}$/, userMessageKey.userName)
    // .min(1, petMessageKey.petName)
    // .max(12, petMessageKey.petName)
    .required(userMessageKey.userName),
  bio: yup.string().trim().max(140, userMessageKey.userBio),
  birthday: yup
    .number()
    .nullable()
    .max(endOfToday().getTime(), commonMessageKey.birthday),
});
