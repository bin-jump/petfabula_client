import * as yup from 'yup';
import { petMessageKey, commonMessageKey } from './messageKeys';

export const validPetFormSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .matches(/^[\w\-ぁ-んァ-ヶ一-龠々ー]{3,16}$/, petMessageKey.petName)
    // .min(1, petMessageKey.petName)
    // .max(12, petMessageKey.petName)
    .required(petMessageKey.petName),
  bio: yup.string().trim().max(300, petMessageKey.petName),
  birthday: yup
    .number()
    .nullable()
    .max(new Date().getTime(), commonMessageKey.birthday)
    .required(commonMessageKey.emptyValue),
  gender: yup.string().required(commonMessageKey.emptyValue),
  arrivalDay: yup
    .number()
    .nullable()
    .max(new Date().getTime(), petMessageKey.arrivalDay)
    .test('arrival test', petMessageKey.arrivalDay, function (value) {
      const birthday = this.resolve(yup.ref('birthday'));
      if (!birthday || !value) {
        return true;
      }
      const arrivalDay = value;
      return (birthday as number) <= arrivalDay;
    })
    .required(commonMessageKey.emptyValue),
  breedId: yup.number().nullable().required(petMessageKey.breedId),
});
