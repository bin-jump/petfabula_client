export {
  EmailCodeLoginForm,
  OauthForm,
  EmailCodeRegisterForm,
  EmailCodeSendLoginCodeForm,
  EmailCodeSendRegisterCodeForm,
  useEmailCodeLogin,
  useEmailCodeRegisterAndLogin,
  useEmailCodeSendLoginCode,
  useEmailCodeSendRegisterCode,
  useLogout,
  useOauthRegisterAndLogin,
  useUserAgreement,
} from './authentication';

export { resolveResponseFormError, checkFailedResponse } from './shared';
