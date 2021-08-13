import * as yup from 'yup';
import { petMessageKey, commonMessageKey } from './messageKeys';
import { endOfToday, isPositive } from './helper';

const validRecordNote = yup.string().max(200, petMessageKey.recordNote);

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
    .max(endOfToday().getTime(), commonMessageKey.birthday)
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

export const validFeedRecordFormSchema = yup.object().shape({
  petId: yup
    .number()
    .typeError(petMessageKey.petSelect)
    .required(petMessageKey.petSelect),
  amount: yup
    .number()
    .integer(commonMessageKey.validType)
    .typeError(commonMessageKey.validType)
    .max(100000, petMessageKey.feedAmount)
    .required(commonMessageKey.emptyValue)
    .test('IsPositive', commonMessageKey.emptyValue, isPositive),
  foodContent: yup.string().max(200, petMessageKey.foodContent),
  date: yup.number().max(endOfToday().getTime(), petMessageKey.recordDate),
  note: validRecordNote,
});

export const validWeightRecordFormSchema = yup.object().shape({
  petId: yup
    .number()
    .typeError(petMessageKey.petSelect)
    .required(petMessageKey.petSelect),
  weight: yup
    .number()
    .typeError(commonMessageKey.validType)
    .max(1000, petMessageKey.weight)
    .required(commonMessageKey.emptyValue)
    .test('IsPositive', commonMessageKey.emptyValue, isPositive),
  date: yup.number().max(endOfToday().getTime(), petMessageKey.recordDate),
});

export const validDisorderRecordFormSchema = yup.object().shape({
  petId: yup
    .number()
    .typeError(petMessageKey.petSelect)
    .required(petMessageKey.petSelect),
  content: yup
    .string()
    .max(500, petMessageKey.disorderContent)
    .required(commonMessageKey.emptyValue),
  dateTime: yup.number().max(endOfToday().getTime(), petMessageKey.recordDate),
});

export const validPetEventRecordFormSchema = yup.object().shape({
  petId: yup
    .number()
    .typeError(petMessageKey.petSelect)
    .required(petMessageKey.petSelect),
  eventType: yup.string().required(commonMessageKey.emptyValue),
  content: yup
    .string()
    .max(240, petMessageKey.eventContent)
    .required(commonMessageKey.emptyValue),
  dateTime: yup.number().max(endOfToday().getTime(), petMessageKey.recordDate),
});

export const validMedicalRecordFormSchema = yup.object().shape({
  petId: yup
    .number()
    .typeError(petMessageKey.petSelect)
    .required(petMessageKey.petSelect),
  dateTime: yup.number().max(endOfToday().getTime(), petMessageKey.recordDate),
  hospitalName: yup.string().max(30, petMessageKey.hospitalName),
  symptom: yup
    .string()
    .max(240, petMessageKey.symptom)
    .required(commonMessageKey.emptyValue),
  diagnosis: yup.string().max(240, petMessageKey.diagnosis),
  treatment: yup.string().max(240, petMessageKey.treatment),
  note: validRecordNote,
});
