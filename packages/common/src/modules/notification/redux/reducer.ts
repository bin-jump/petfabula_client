import { createReducer, ActionBase } from '../../shared';
import { NotificationState } from './types';
import { checkNotificationReducer } from './checkNotificationHooks';
import { notificationReducer } from './notificationHooks';
import { readNotificationReducer } from './readNotificationHooks';

const initialStat: NotificationState = {
  notificationCheckResult: { data: null, pending: false, error: null },
  answerCommentNotifications: {
    data: [],
    pending: false,
    error: null,
    hasMore: false,
    nextCursor: null,
    initializing: false,
  },
  upvoteNotifications: {
    data: [],
    pending: false,
    error: null,
    hasMore: false,
    nextCursor: null,
    initializing: false,
  },
  followNotifications: {
    data: [],
    pending: false,
    error: null,
    hasMore: false,
    nextCursor: null,
    initializing: false,
  },
};

export const notificationRootReducer = createReducer<
  NotificationState,
  ActionBase
>(initialStat, {
  ...checkNotificationReducer,
  ...notificationReducer,
  ...readNotificationReducer,
});
