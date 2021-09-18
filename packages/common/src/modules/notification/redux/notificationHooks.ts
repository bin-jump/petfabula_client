import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { AppState } from '../../../stateProvider';
import { NotificationState } from './types';
import {
  LoadAnswerCommentNotificationsActionType,
  LoadFollowNotificationsActionType,
  LoadUpvoteNotificationsActionType,
  LoadSystemNotificationsActionType,
} from './actionTypes';
import { ActionBase, fillCursorResponseData } from '../../shared';

export const useLoadAnswerCommentNotifications = () => {
  const dispatch = useDispatch();
  const { notifications, hasMore, nextCursor, initializing, pending, error } =
    useSelector(
      (state: AppState) => ({
        notifications: state.notification.answerCommentNotifications.data,
        hasMore: state.notification.answerCommentNotifications.hasMore,
        nextCursor: state.notification.answerCommentNotifications.nextCursor,
        pending: state.notification.answerCommentNotifications.pending,
        initializing:
          state.notification.answerCommentNotifications.initializing,
        error: state.notification.answerCommentNotifications.error,
      }),
      shallowEqual,
    );

  const boundAction = useCallback(
    (cursor: object | null) => {
      dispatch({
        type: LoadAnswerCommentNotificationsActionType.BEGIN,
        payload: { cursor },
      });
    },
    [dispatch],
  );

  return {
    loadNotifications: boundAction,
    notifications,
    hasMore,
    nextCursor,
    initializing,
    pending,
    error,
  };
};

export const useLoadFollowNotifications = () => {
  const dispatch = useDispatch();
  const { notifications, hasMore, nextCursor, initializing, pending, error } =
    useSelector(
      (state: AppState) => ({
        notifications: state.notification.followNotifications.data,
        hasMore: state.notification.followNotifications.hasMore,
        nextCursor: state.notification.followNotifications.nextCursor,
        pending: state.notification.followNotifications.pending,
        initializing: state.notification.followNotifications.initializing,
        error: state.notification.followNotifications.error,
      }),
      shallowEqual,
    );

  const boundAction = useCallback(
    (cursor: object | null) => {
      dispatch({
        type: LoadFollowNotificationsActionType.BEGIN,
        payload: { cursor },
      });
    },
    [dispatch],
  );

  return {
    loadNotifications: boundAction,
    notifications,
    hasMore,
    nextCursor,
    initializing,
    pending,
    error,
  };
};

export const useLoadUpvoteNotifications = () => {
  const dispatch = useDispatch();
  const { notifications, hasMore, nextCursor, initializing, pending, error } =
    useSelector(
      (state: AppState) => ({
        notifications: state.notification.upvoteNotifications.data,
        hasMore: state.notification.upvoteNotifications.hasMore,
        nextCursor: state.notification.upvoteNotifications.nextCursor,
        pending: state.notification.upvoteNotifications.pending,
        initializing: state.notification.upvoteNotifications.initializing,
        error: state.notification.upvoteNotifications.error,
      }),
      shallowEqual,
    );

  const boundAction = useCallback(
    (cursor: object | null) => {
      dispatch({
        type: LoadUpvoteNotificationsActionType.BEGIN,
        payload: { cursor },
      });
    },
    [dispatch],
  );

  return {
    loadNotifications: boundAction,
    notifications,
    hasMore,
    nextCursor,
    initializing,
    pending,
    error,
  };
};

export const useLoadSystemNotifications = () => {
  const dispatch = useDispatch();
  const { notifications, hasMore, nextCursor, initializing, pending, error } =
    useSelector(
      (state: AppState) => ({
        notifications: state.notification.systemNotifications.data,
        hasMore: state.notification.systemNotifications.hasMore,
        nextCursor: state.notification.systemNotifications.nextCursor,
        pending: state.notification.systemNotifications.pending,
        initializing: state.notification.systemNotifications.initializing,
        error: state.notification.systemNotifications.error,
      }),
      shallowEqual,
    );

  const boundAction = useCallback(
    (cursor: object | null) => {
      dispatch({
        type: LoadSystemNotificationsActionType.BEGIN,
        payload: { cursor },
      });
    },
    [dispatch],
  );

  return {
    loadNotifications: boundAction,
    notifications,
    hasMore,
    nextCursor,
    initializing,
    pending,
    error,
  };
};

export const notificationReducer = {
  // answer comment notification
  [LoadAnswerCommentNotificationsActionType.BEGIN]: (
    state: NotificationState,
    action: ActionBase,
  ): NotificationState => {
    return {
      ...state,
      answerCommentNotifications: {
        ...state.answerCommentNotifications,
        initializing: action.payload.cursor == null,
        pending: true,
        error: null,
      },
    };
  },
  [LoadAnswerCommentNotificationsActionType.SUCCESS]: (
    state: NotificationState,
    action: ActionBase,
  ): NotificationState => {
    return {
      ...state,
      answerCommentNotifications: {
        ...fillCursorResponseData(state.answerCommentNotifications, action),
      },
    };
  },
  [LoadAnswerCommentNotificationsActionType.FAILURE]: (
    state: NotificationState,
    action: ActionBase,
  ): NotificationState => {
    return {
      ...state,
      answerCommentNotifications: {
        ...state.answerCommentNotifications,
        pending: false,
        initializing: false,
        error: action.error,
      },
    };
  },

  // follow notification
  [LoadFollowNotificationsActionType.BEGIN]: (
    state: NotificationState,
    action: ActionBase,
  ): NotificationState => {
    return {
      ...state,
      followNotifications: {
        ...state.followNotifications,
        initializing: action.payload.cursor == null,
        pending: true,
        error: null,
      },
    };
  },
  [LoadFollowNotificationsActionType.SUCCESS]: (
    state: NotificationState,
    action: ActionBase,
  ): NotificationState => {
    return {
      ...state,
      followNotifications: {
        ...fillCursorResponseData(state.followNotifications, action),
      },
    };
  },
  [LoadFollowNotificationsActionType.FAILURE]: (
    state: NotificationState,
    action: ActionBase,
  ): NotificationState => {
    return {
      ...state,
      followNotifications: {
        ...state.followNotifications,
        pending: false,
        initializing: false,
        error: action.error,
      },
    };
  },

  // upvote notification
  [LoadUpvoteNotificationsActionType.BEGIN]: (
    state: NotificationState,
    action: ActionBase,
  ): NotificationState => {
    return {
      ...state,
      upvoteNotifications: {
        ...state.upvoteNotifications,
        initializing: action.payload.cursor == null,
        pending: true,
        error: null,
      },
    };
  },
  [LoadUpvoteNotificationsActionType.SUCCESS]: (
    state: NotificationState,
    action: ActionBase,
  ): NotificationState => {
    return {
      ...state,
      upvoteNotifications: {
        ...fillCursorResponseData(state.upvoteNotifications, action),
      },
    };
  },
  [LoadUpvoteNotificationsActionType.FAILURE]: (
    state: NotificationState,
    action: ActionBase,
  ): NotificationState => {
    return {
      ...state,
      upvoteNotifications: {
        ...state.upvoteNotifications,
        pending: false,
        initializing: false,
        error: action.error,
      },
    };
  },

  // system notification
  [LoadSystemNotificationsActionType.BEGIN]: (
    state: NotificationState,
    action: ActionBase,
  ): NotificationState => {
    return {
      ...state,
      systemNotifications: {
        ...state.systemNotifications,
        initializing: action.payload.cursor == null,
        pending: true,
        error: null,
      },
    };
  },
  [LoadSystemNotificationsActionType.SUCCESS]: (
    state: NotificationState,
    action: ActionBase,
  ): NotificationState => {
    return {
      ...state,
      systemNotifications: {
        ...fillCursorResponseData(state.systemNotifications, action),
      },
    };
  },
  [LoadSystemNotificationsActionType.FAILURE]: (
    state: NotificationState,
    action: ActionBase,
  ): NotificationState => {
    return {
      ...state,
      systemNotifications: {
        ...state.systemNotifications,
        pending: false,
        initializing: false,
        error: action.error,
      },
    };
  },
};
