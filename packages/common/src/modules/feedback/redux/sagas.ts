import { all, fork } from 'redux-saga/effects';
import { createSagaWatcher } from '../../shared';
import {
  FeedbackCreateReportActionType,
  FeedbackCreateFeedbackkActionType,
} from './actionTypes';

const watchCreateReport = createSagaWatcher({
  url: `/api/feedback/report`,
  method: 'POST',
  asyncAction: FeedbackCreateReportActionType,
  watchType: 'EVERY',
});

const watchCreateFeedback = createSagaWatcher({
  url: `/api/feedback/feedback`,
  method: 'POST',
  asyncAction: FeedbackCreateFeedbackkActionType,
  watchType: 'EVERY',
});

export function* feedbackRootSaga() {
  yield all([fork(watchCreateReport), fork(watchCreateFeedback)]);
}
