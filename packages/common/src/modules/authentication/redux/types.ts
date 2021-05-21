import { AsyncDataBase } from '../../shared';

export interface User {
  id: number;
  name: string;
  avatarUrl: string;
}

export interface EmailCodeSendRegisterCodeForm {
  email: string;
  name: string;
}

export interface EmailCodeRegisterForm {
  name: string;
  email: string;
  code: string;
}

export interface EmailCodeSendLoginCodeForm {
  email: string;
}

export interface EmailCodeLoginForm {
  email: string;
  code: string;
}

export interface OauthForm {
  code: string;
  serverName: 'GITHUB' | 'GOOGLE' | 'FACEBOOK';
}

// export interface EmailPasswordRegisterForm {
//   name: string;
//   email: string;
//   password: string;
//   code: string;
// }

export interface RegisterConfirmTokenRequest {
  email: string;
}

// export interface ForgotPasswordForm {
//   email: string;
//   code: string;
//   password: string;
// }

// export interface ForgotPasswordConfirmTokenRequest {
//   email: string;
// }

export interface AuthenticationState {
  currentUser: AsyncDataBase<User>;

  // emailPassordLoginResult: AsyncDataBase<User>;
  emailCodeSendRegisterCodeResult: AsyncDataBase<{ done: boolean }>;
  emailCodeRegisterAndLoginResult: AsyncDataBase<User>;

  emailCodeSendLoginCodeResult: AsyncDataBase<{ done: boolean }>;
  emailCodeLoginResult: AsyncDataBase<User>;
  oauthRegisterLoginResult: AsyncDataBase<User>;
  logoutResult: AsyncDataBase<{ done: boolean }>;

  // registerResult: AsyncDataBase<User>;
  // registerTokenResult: AsyncDataBase<string>;
  // checkedToken: AsyncDataBase<{ email: string }>;

  // forgotPasswordResult: AsyncDataBase<string>;
  // tokenResult: AsyncDataBase<{ email: string }>;
}
