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
  .min(3, authenticationMessageKey.namePattern)
  .max(20, authenticationMessageKey.namePattern)
  .matches(
    /^[\.\w\-ぁ-んァ-ヶ一-龠々ー]{3, 20}$/,
    authenticationMessageKey.namePattern,
  )
  .required(commonMessageKey.emptyValue);

const passwordValidation = yup
  .string()
  .min(8, authenticationMessageKey.passwordPattern)
  .max(16, authenticationMessageKey.passwordPattern)
  .matches(
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]){8, 16}$/,
    authenticationMessageKey.namePattern,
  )
  .required(commonMessageKey.emptyValue);

const confirmPasswordValidation = yup
  .string()
  .test(
    'confirm password',
    authenticationMessageKey.passwordNotMatch,
    function (value) {
      const password = this.resolve(yup.ref('password')) as string;
      const confirmPassword = value as string;
      return password == confirmPassword;
    },
  );

const confirmTokenValidation = yup
  .string()
  .trim()
  .required(commonMessageKey.emptyValue);

export const validEmailPasswordLoginFormSchema = yup.object().shape({
  email: emaliValidation,
  password: passwordValidation,
});

export const validEmailPasswordRegisterFormSchema = yup.object().shape({
  name: usernameValidation,
  email: emaliValidation,
  password: passwordValidation,
  confirmPassword: confirmPasswordValidation,
});
