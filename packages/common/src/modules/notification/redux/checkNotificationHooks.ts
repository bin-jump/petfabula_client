import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { AppState } from '../../../stateProvider';
import { NotificationState } from './types';
import { NotificationCheckActionType } from './actionTypes';
import { ActionBase } from '../../shared';

export const useCheckNotifications = () => {
  const dispatch = useDispatch();
  const { checkResult, pending, error } = useSelector(
    (state: AppState) => ({
      checkResult: state.notification.notificationCheckResult.data,
      pending: state.notification.notificationCheckResult.pending,
      error: state.notification.notificationCheckResult.error,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(() => {
    dispatch({ type: NotificationCheckActionType.BEGIN });
  }, [dispatch]);

  return {
    checkNotifications: boundAction,
    checkResult,
    pending,
    error,
  };
};

export const checkNotificationReducer = {
  [NotificationCheckActionType.BEGIN]: (
    state: NotificationState,
    action: ActionBase,
  ): NotificationState => {
    return {
      ...state,
      notificationCheckResult: {
        ...state.notificationCheckResult,
        pending: true,
        error: null,
      },
    };
  },
  [NotificationCheckActionType.SUCCESS]: (
    state: NotificationState,
    action: ActionBase,
  ): NotificationState => {
    return {
      ...state,
      notificationCheckResult: {
        ...state.notificationCheckResult,
        data: action.payload,
        pending: false,
      },
    };
  },
  [NotificationCheckActionType.FAILURE]: (
    state: NotificationState,
    action: ActionBase,
  ): NotificationState => {
    return {
      ...state,
      notificationCheckResult: {
        ...state.notificationCheckResult,
        pending: false,
        error: action.error,
      },
    };
  },
};
