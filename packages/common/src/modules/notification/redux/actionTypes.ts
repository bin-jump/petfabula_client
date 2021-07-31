import { createAsyncActionType } from '../../shared';

export const NotificationCheckActionType =
  createAsyncActionType('NOTIFICATION_CHECK');

export const NotificationReadAnswerCommentActionType = createAsyncActionType(
  'NOTIFICATION_READ_COMMENT_ANSWER',
);
export const NotificationReadUpvoteActionType = createAsyncActionType(
  'NOTIFICATION_READ_UPVOTE',
);
export const NotificationReadFollowActionType = createAsyncActionType(
  'NOTIFICATION_READ_FOLLOW',
);

export const LoadAnswerCommentNotificationsActionType = createAsyncActionType(
  'NOTIFICATION_LOAD_COMMENT_ANSWER',
);
export const LoadUpvoteNotificationsActionType = createAsyncActionType(
  'NOTIFICATION_LOAD_UPVOTE',
);
export const LoadFollowNotificationsActionType = createAsyncActionType(
  'NOTIFICATION_LOAD_FOLLOW',
);
