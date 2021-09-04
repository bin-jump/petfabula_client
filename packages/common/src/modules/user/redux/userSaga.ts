import { all, fork } from 'redux-saga/effects';
import { createSagaWatcher } from '../../shared';
import {
  LoadMyAccountActionType,
  UpdateMyAccountActionType,
  LoadCitiesActionType,
  LoadNotificationSettingActionType,
  UpdateNotificationSettingActionType,
} from './actionTypes';

const watchLoadMyAccount = createSagaWatcher({
  url: `/api/account/account`,
  method: 'GET',
  asyncAction: LoadMyAccountActionType,
  watchType: 'LATEST',
});

const watchUpdateMyAccount = createSagaWatcher({
  url: `/api/account/account`,
  method: 'PUT',
  asyncAction: UpdateMyAccountActionType,
  watchType: 'EVERY',
});

const watchLoadCities = createSagaWatcher({
  url: `/api/account/cities`,
  method: 'GET',
  asyncAction: LoadCitiesActionType,
  watchType: 'EVERY',
});

const watchLoadNotifySetting = createSagaWatcher({
  url: `/api/account/notify-setting`,
  method: 'GET',
  asyncAction: LoadNotificationSettingActionType,
  watchType: 'LATEST',
});

const watchUpdateNotifySetting = createSagaWatcher({
  url: `/api/account/notify-setting`,
  method: 'PUT',
  asyncAction: UpdateNotificationSettingActionType,
  watchType: 'EVERY',
});

export function* userRootSaga() {
  yield all([
    fork(watchLoadMyAccount),
    fork(watchUpdateMyAccount),
    fork(watchLoadCities),

    fork(watchLoadNotifySetting),
    fork(watchUpdateNotifySetting),
  ]);
}
