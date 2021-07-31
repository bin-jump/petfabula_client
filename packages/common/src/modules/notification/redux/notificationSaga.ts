import { all, fork } from 'redux-saga/effects';
import { createSagaWatcher } from '../../shared';
import {
  NotificationCheckActionType,
  NotificationReadAnswerCommentActionType,
  NotificationReadUpvoteActionType,
  NotificationReadFollowActionType,
  LoadAnswerCommentNotificationsActionType,
  LoadUpvoteNotificationsActionType,
  LoadFollowNotificationsActionType,
} from './actionTypes';

const watchCheckNotification = createSagaWatcher({
  url: `/api/notification/notifications`,
  method: 'GET',
  asyncAction: NotificationCheckActionType,
  watchType: 'LATEST',
});

const watchReadAnswerCommentNotification = createSagaWatcher({
  url: `/api/notification/answer-comment-notifications`,
  method: 'PUT',
  asyncAction: NotificationReadAnswerCommentActionType,
  watchType: 'EVERY',
});

const watchReadFollowNotification = createSagaWatcher({
  url: `/api/notification/follow-notifications`,
  method: 'PUT',
  asyncAction: NotificationReadFollowActionType,
  watchType: 'EVERY',
});

const watchReadVoteNotification = createSagaWatcher({
  url: `/api/notification/vote-notifications`,
  method: 'PUT',
  asyncAction: NotificationReadUpvoteActionType,
  watchType: 'EVERY',
});

const watchLoadAnswerCommentNotifications = createSagaWatcher({
  url: `/api/notification/answer-comment-notifications`,
  method: 'GET',
  asyncAction: LoadAnswerCommentNotificationsActionType,
  watchType: 'EVERY',
});

const watchLoadFollowNotifications = createSagaWatcher({
  url: `/api/notification/follow-notifications`,
  method: 'GET',
  asyncAction: LoadFollowNotificationsActionType,
  watchType: 'EVERY',
});

const watchLoadVoteNotifications = createSagaWatcher({
  url: `/api/notification/vote-notifications`,
  method: 'GET',
  asyncAction: LoadUpvoteNotificationsActionType,
  watchType: 'EVERY',
});

export function* notificationRootSaga() {
  yield all([
    fork(watchCheckNotification),
    fork(watchReadAnswerCommentNotification),
    fork(watchReadFollowNotification),
    fork(watchReadVoteNotification),
    fork(watchLoadAnswerCommentNotifications),
    fork(watchLoadFollowNotifications),
    fork(watchLoadVoteNotifications),
  ]);
}
