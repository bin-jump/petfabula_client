import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { AppState } from '../../../stateProvider';
import { NotificationState } from './types';
import {
  NotificationReadAnswerCommentActionType,
  NotificationReadFollowActionType,
  NotificationReadUpvoteActionType,
} from './actionTypes';
import { ActionBase } from '../../shared';

export const useReadAnswerCommentNotifications = () => {
  const dispatch = useDispatch();

  const boundAction = useCallback(() => {
    dispatch({ type: NotificationReadAnswerCommentActionType.BEGIN });
  }, [dispatch]);

  return {
    readNotifications: boundAction,
  };
};

export const useReadFollowNotifications = () => {
  const dispatch = useDispatch();

  const boundAction = useCallback(() => {
    dispatch({ type: NotificationReadFollowActionType.BEGIN });
  }, [dispatch]);

  return {
    readNotifications: boundAction,
  };
};

export const useReadUpvoteNotifications = () => {
  const dispatch = useDispatch();

  const boundAction = useCallback(() => {
    dispatch({ type: NotificationReadUpvoteActionType.BEGIN });
  }, [dispatch]);

  return {
    readNotifications: boundAction,
  };
};

export const readNotificationReducer = {
  [NotificationReadAnswerCommentActionType.SUCCESS]: (
    state: NotificationState,
    action: ActionBase,
  ): NotificationState => {
    const checkState = state.notificationCheckResult.data;
    return {
      ...state,
      notificationCheckResult: {
        ...state.notificationCheckResult,
        data: checkState
          ? { ...checkState, answerCommentCount: 0 }
          : checkState,
      },
    };
  },

  [NotificationReadFollowActionType.SUCCESS]: (
    state: NotificationState,
    action: ActionBase,
  ): NotificationState => {
    const checkState = state.notificationCheckResult.data;
    return {
      ...state,
      notificationCheckResult: {
        ...state.notificationCheckResult,
        data: checkState ? { ...checkState, followCount: 0 } : checkState,
      },
    };
  },

  [NotificationReadUpvoteActionType.SUCCESS]: (
    state: NotificationState,
    action: ActionBase,
  ): NotificationState => {
    const checkState = state.notificationCheckResult.data;
    return {
      ...state,
      notificationCheckResult: {
        ...state.notificationCheckResult,
        data: checkState ? { ...checkState, voteCount: 0 } : checkState,
      },
    };
  },
};
