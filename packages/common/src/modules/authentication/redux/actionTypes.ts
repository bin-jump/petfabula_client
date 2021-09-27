import { createAsyncActionType } from '../../shared';

export const GetCurrentUserActionType = createAsyncActionType(
  'AUTHENTICATION_CURRENT_USER',
);

// export const EmailPasswordLoginActionType = createAsyncActionType(
//   'AUTHENTICATION_LOGIN_EMAIL_PASSWORD',
// );
export const EmailCodeSendLoginCodeActionType = createAsyncActionType(
  'AUTHENTICATION_LOGIN_EMAIL_SEND_CODE',
);
export const EmailCodeLoginActionType = createAsyncActionType(
  'AUTHENTICATION_LOGIN_EMAIL_CODE',
);
export const LogoutActionType = createAsyncActionType('AUTHENTICATION_LOGOUT');
// export const EmailPassowrdRegisterActionType = createAsyncActionType(
//   'AUTHENTICATION_REGISTER_EMAIL_PASSWORD',
// );
export const EmailCodeSendRegisterCodeActionType = createAsyncActionType(
  'AUTHENTICATION_REGISTER_EMAIL_SEND_CODE',
);
export const EmailCodeRegisterAndLoginActionType = createAsyncActionType(
  'AUTHENTICATION_REGISTER_LOGIN_EMAIL_CODE',
);
export const OauthRegisterAndLoginActionType = createAsyncActionType(
  'AUTHENTICATION_REGISTER_LOGIN_OAUTH',
);
