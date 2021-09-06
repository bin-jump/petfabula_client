import { all, fork } from 'redux-saga/effects';
import { createSagaWatcher } from '../../shared';
import {
  EmailCodeSendLoginCodeActionType,
  EmailCodeLoginActionType,
  EmailCodeSendRegisterCodeActionType,
  EmailCodeRegisterAndLoginActionType,
  OauthRegisterAndLoginActionType,
  GetUserAgreementActionType,
  GetCurrentUserActionType,
  LogoutActionType,
} from './actionTypes';

const watchGetCurrentUser = createSagaWatcher({
  url: `/api/identity/me`,
  method: 'GET',
  asyncAction: GetCurrentUserActionType,
  watchType: 'LATEST',
});

const watchEmailCodeSendRegisterCode = createSagaWatcher({
  url: `/api/identity/register-send-code`,
  method: 'POST',
  asyncAction: EmailCodeSendRegisterCodeActionType,
  watchType: 'EVERY',
});

const watchEmailCodeRegisterAndLogin = createSagaWatcher({
  url: `/api/identity/register-signin-email-code`,
  method: 'POST',
  asyncAction: EmailCodeRegisterAndLoginActionType,
  watchType: 'EVERY',
});

const watchEmailCodeSendLoginCode = createSagaWatcher({
  url: `/api/identity/signin-email-send-code`,
  method: 'POST',
  asyncAction: EmailCodeSendLoginCodeActionType,
  watchType: 'EVERY',
});

const watchEmailCodeLogin = createSagaWatcher({
  url: `/api/identity/signin-email-code`,
  method: 'POST',
  asyncAction: EmailCodeLoginActionType,
  watchType: 'EVERY',
});

const watchOauthRegisterOrLogin = createSagaWatcher({
  url: `/api/identity/register-signin-oauth`,
  method: 'POST',
  asyncAction: OauthRegisterAndLoginActionType,
  watchType: 'EVERY',
});

const watchGetUserAgreement = createSagaWatcher({
  url: `/api/identity/user-agreement`,
  method: 'GET',
  asyncAction: GetUserAgreementActionType,
  watchType: 'LATEST',
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
    fork(watchGetUserAgreement),
    fork(watchLogout),
  ]);
}
