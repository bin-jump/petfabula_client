import { all, fork } from 'redux-saga/effects';
import { createSagaWatcher } from '../../shared';
import {
  EmailCodeSendLoginCodeActionType,
  EmailCodeLoginActionType,
  EmailCodeSendRegisterCodeActionType,
  EmailCodeRegisterAndLoginActionType,
  OauthRegisterAndLoginActionType,
  OauthLoginActionType,
  GetCurrentUserActionType,
  LogoutActionType,
  AppleRegisterAndLoginActionType,
  AppleLoginActionType,
} from './actionTypes';

const watchGetCurrentUser = createSagaWatcher({
  url: `/api/identity/me`,
  method: 'GET',
  asyncAction: GetCurrentUserActionType,
  watchType: 'LATEST',
});

const watchEmailCodeSendRegisterCode = createSagaWatcher({
  url: `/api/auth/register-send-code`,
  method: 'POST',
  asyncAction: EmailCodeSendRegisterCodeActionType,
  watchType: 'EVERY',
});

const watchEmailCodeRegisterAndLogin = createSagaWatcher({
  url: `/api/auth/register-signin-email-code`,
  method: 'POST',
  asyncAction: EmailCodeRegisterAndLoginActionType,
  watchType: 'EVERY',
});

const watchEmailCodeSendLoginCode = createSagaWatcher({
  url: `/api/auth/signin-email-send-code`,
  method: 'POST',
  asyncAction: EmailCodeSendLoginCodeActionType,
  watchType: 'EVERY',
});

const watchEmailCodeLogin = createSagaWatcher({
  url: `/api/auth/signin-email-code`,
  method: 'POST',
  asyncAction: EmailCodeLoginActionType,
  watchType: 'EVERY',
});

const watchOauthRegisterOrLogin = createSagaWatcher({
  url: `/api/auth/register-signin-oauth`,
  method: 'POST',
  asyncAction: OauthRegisterAndLoginActionType,
  watchType: 'EVERY',
});

const watchOauthLogin = createSagaWatcher({
  url: `/api/auth/signin-oauth`,
  method: 'POST',
  asyncAction: OauthLoginActionType,
  watchType: 'EVERY',
});

const watchAppleRegisterOrLogin = createSagaWatcher({
  url: `/api/auth/register-signin-apple`,
  method: 'POST',
  asyncAction: AppleRegisterAndLoginActionType,
  watchType: 'EVERY',
});

const watchAppleLogin = createSagaWatcher({
  url: `/api/auth/register-signin-apple`,
  method: 'POST',
  asyncAction: AppleLoginActionType,
  watchType: 'EVERY',
});

const watchLogout = createSagaWatcher({
  url: `/api/identity/logout`,
  method: 'POST',
  asyncAction: LogoutActionType,
  watchType: 'EVERY',
});

export function* authenticationRootSaga() {
  yield all([
    fork(watchGetCurrentUser),
    fork(watchEmailCodeSendRegisterCode),
    fork(watchEmailCodeRegisterAndLogin),
    fork(watchEmailCodeSendLoginCode),
    fork(watchEmailCodeLogin),
    fork(watchOauthRegisterOrLogin),
    fork(watchOauthLogin),
    fork(watchAppleRegisterOrLogin),
    fork(watchAppleLogin),
    fork(watchLogout),
  ]);
}
