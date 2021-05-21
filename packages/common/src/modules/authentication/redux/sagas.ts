import { all, fork } from 'redux-saga/effects';

import { createSagaWatcher } from '../../shared';
import {
  EmailCodeSendLoginCodeActionType,
  EmailCodeLoginActionType,
  EmailCodeSendRegisterCodeActionType,
  EmailCodeRegisterAndLoginActionType,
  OauthRegisterAndLoginActionType,
} from './actionTypes';

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

export function* authenticationRootSaga() {
  yield all([
    fork(watchEmailCodeSendRegisterCode),
    fork(watchEmailCodeRegisterAndLogin),
    fork(watchEmailCodeSendLoginCode),
    fork(watchEmailCodeLogin),
    fork(watchOauthRegisterOrLogin),
  ]);
}
