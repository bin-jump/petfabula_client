import { all, fork } from 'redux-saga/effects';
import { createSagaWatcher } from '../../shared';
import {
  LoadUserAgreementActionType,
  LoadPrivacyAgreementActionType,
} from './actionTypes';

const watchLoadUserAgreement = createSagaWatcher({
  url: `/api/document/user-agreement`,
  method: 'GET',
  asyncAction: LoadUserAgreementActionType,
  watchType: 'LATEST',
});

const watchLoadPrivacyAgreement = createSagaWatcher({
  url: `/api/document/privacy-agreement`,
  method: 'GET',
  asyncAction: LoadPrivacyAgreementActionType,
  watchType: 'LATEST',
});

export function* documentRootSaga() {
  yield all([fork(watchLoadUserAgreement), fork(watchLoadPrivacyAgreement)]);
}
