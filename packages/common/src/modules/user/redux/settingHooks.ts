import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { AppState } from '../../../stateProvider';
import { UserState, NotifySetting } from './types';
import {
  LoadNotificationSettingActionType,
  UpdateNotificationSettingActionType,
} from './actionTypes';
import { ActionBase } from '../../shared';

export const useLoadMyNotifySetting = () => {
  const dispatch = useDispatch();
  const { setting, pending, error } = useSelector(
    (state: AppState) => ({
      setting: state.user.myNotifySetting.data,
      pending: state.user.myNotifySetting.pending,
      error: state.user.myNotifySetting.error,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(() => {
    dispatch({
      type: LoadNotificationSettingActionType.BEGIN,
    });
  }, [dispatch]);

  return {
    loadNotifySetting: boundAction,
    setting,
    pending,
    error,
  };
};

export const useLoadUpdateNotifySetting = () => {
  const dispatch = useDispatch();
  const { result, pending, error } = useSelector(
    (state: AppState) => ({
      result: state.user.updateNotifySetting.data,
      pending: state.user.updateNotifySetting.pending,
      error: state.user.updateNotifySetting.error,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(
    (setting: NotifySetting) => {
      dispatch({
        type: UpdateNotificationSettingActionType.BEGIN,
        payload: setting,
      });
    },
    [dispatch],
  );

  return {
    updateNotifySetting: boundAction,
    result,
    pending,
    error,
  };
};

export const settingReducer = {
  // load notify
  [LoadNotificationSettingActionType.BEGIN]: (
    state: UserState,
    action: ActionBase,
  ): UserState => {
    return {
      ...state,
      myNotifySetting: {
        ...state.myNotifySetting,
        pending: true,
        error: null,
      },
    };
  },
  [LoadNotificationSettingActionType.SUCCESS]: (
    state: UserState,
    action: ActionBase,
  ): UserState => {
    return {
      ...state,
      myNotifySetting: {
        ...state.myNotifySetting,
        data: action.payload,
        pending: false,
      },
    };
  },
  [LoadNotificationSettingActionType.FAILURE]: (
    state: UserState,
    action: ActionBase,
  ): UserState => {
    return {
      ...state,
      myNotifySetting: {
        ...state.myNotifySetting,
        pending: false,
        error: action.error,
      },
    };
  },

  // update nofity setting
  [UpdateNotificationSettingActionType.BEGIN]: (
    state: UserState,
    action: ActionBase,
  ): UserState => {
    return {
      ...state,
      updateNotifySetting: {
        ...state.updateNotifySetting,
        pending: true,
        error: null,
      },
    };
  },
  [UpdateNotificationSettingActionType.SUCCESS]: (
    state: UserState,
    action: ActionBase,
  ): UserState => {
    return {
      ...state,
      updateNotifySetting: {
        ...state.updateNotifySetting,
        data: action.payload,
        pending: false,
      },
      myNotifySetting: {
        ...state.myNotifySetting,
        data: action.payload,
      },
    };
  },
  [UpdateNotificationSettingActionType.FAILURE]: (
    state: UserState,
    action: ActionBase,
  ): UserState => {
    return {
      ...state,
      updateNotifySetting: {
        ...state.updateNotifySetting,
        pending: false,
        error: action.error,
      },
    };
  },
};
