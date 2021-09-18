import { all, fork } from 'redux-saga/effects';
import { createSagaWatcher } from '../../shared';
import {
  NotificationCheckActionType,
  NotificationReadAnswerCommentActionType,
  NotificationReadUpvoteActionType,
  NotificationReadFollowActionType,
  NotificationReadSystemActionType,
  LoadAnswerCommentNotificationsActionType,
  LoadUpvoteNotificationsActionType,
  LoadFollowNotificationsActionType,
  LoadSystemNotificationsActionType,
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
  watchType: 'LATEST',
});

const watchReadFollowNotification = createSagaWatcher({
  url: `/api/notification/follow-notifications`,
  method: 'PUT',
  asyncAction: NotificationReadFollowActionType,
  watchType: 'LATEST',
});

const watchReadVoteNotification = createSagaWatcher({
  url: `/api/notification/vote-notifications`,
  method: 'PUT',
  asyncAction: NotificationReadUpvoteActionType,
  watchType: 'LATEST',
});

const watchReadSystemNotification = createSagaWatcher({
  url: `/api/notification/system-notifications`,
  method: 'PUT',
  asyncAction: NotificationReadSystemActionType,
  watchType: 'LATEST',
});

const watchLoadAnswerCommentNotifications = createSagaWatcher({
  url: `/api/notification/answer-comment-notifications`,
  method: 'GET',
  asyncAction: LoadAnswerCommentNotificationsActionType,
  watchType: 'LATEST',
});

const watchLoadFollowNotifications = createSagaWatcher({
  url: `/api/notification/follow-notifications`,
  method: 'GET',
  asyncAction: LoadFollowNotificationsActionType,
  watchType: 'LATEST',
});

const watchLoadVoteNotifications = createSagaWatcher({
  url: `/api/notification/vote-notifications`,
  method: 'GET',
  asyncAction: LoadUpvoteNotificationsActionType,
  watchType: 'LATEST',
});

const watchLoadSystemNotifications = createSagaWatcher({
  url: `/api/notification/system-notifications`,
  method: 'GET',
  asyncAction: LoadSystemNotificationsActionType,
  watchType: 'LATEST',
});

export function* notificationRootSaga() {
  yield all([
    fork(watchCheckNotification),
    fork(watchReadAnswerCommentNotification),
    fork(watchReadFollowNotification),
    fork(watchReadVoteNotification),
    fork(watchReadSystemNotification),

    fork(watchLoadAnswerCommentNotifications),
    fork(watchLoadFollowNotifications),
    fork(watchLoadVoteNotifications),
    fork(watchLoadSystemNotifications),
  ]);
}
