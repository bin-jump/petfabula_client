import * as yup from 'yup';
import { authenticationMessageKey, commonMessageKey } from './messageKeys';

export const emaliValidation = yup
  .string()
  .trim()
  .email(authenticationMessageKey.emailNotValid)
  .max(120, authenticationMessageKey.emailNotValid)
  .required(commonMessageKey.emptyValue);

export const usernameValidation = yup
  .string()
  .trim()
  .min(3, authenticationMessageKey.nameLength)
  .max(20, authenticationMessageKey.nameLength)
  .matches(
    /^[\w\-ぁ-んァ-ヶ一-龠々ー]{3,20}$/,
    authenticationMessageKey.namePattern,
  )
  .required(commonMessageKey.emptyValue);

// const passwordValidation = yup
//   .string()
//   .min(8, authenticationMessageKey.passwordPattern)
//   .max(16, authenticationMessageKey.passwordPattern)
//   .matches(
//     /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]){8, 16}$/,
//     authenticationMessageKey.namePattern,
//   )
//   .required(commonMessageKey.emptyValue);

// const confirmPasswordValidation = yup
//   .string()
//   .test(
//     'confirm password',
//     authenticationMessageKey.passwordNotMatch,
//     function (value) {
//       const password = this.resolve(yup.ref('password')) as string;
//       const confirmPassword = value as string;
//       return password == confirmPassword;
//     },
//   );

const userAgreementValidation = yup
  .bool()
  .oneOf([true], authenticationMessageKey.agreementNotAgreed);

const verificationCodeValidation = yup
  .string()
  .trim()
  .test('len', commonMessageKey.emptyValue, (val) => val?.length === 6)
  .required(commonMessageKey.emptyValue);

export const validSendLoginCodeFormSchema = yup.object().shape({
  email: emaliValidation,
});

export const validEmailCodeLoginFormSchema = yup.object().shape({
  email: emaliValidation,
  code: verificationCodeValidation,
});

export const validSendRegisterCodeFormSchema = yup.object().shape({
  name: usernameValidation,
  email: emaliValidation,
  userAgreement: userAgreementValidation,
});

export const validEmailCodeRegisterFormSchema = yup.object().shape({
  name: usernameValidation,
  email: emaliValidation,
  code: verificationCodeValidation,
  userAgreement: userAgreementValidation,
});
