import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { AppState } from '../../../stateProvider';
import { AuthenticationState, AppleForm } from './types';
import {
  AppleRegisterAndLoginActionType,
  AppleLoginActionType,
} from './actionTypes';
import { ActionBase } from '../../shared';

// login only when name is null
export const useAppleRegister = () => {
  const dispatch = useDispatch();
  const { result, pending, error } = useSelector(
    (state: AppState) => ({
      result: state.authentication.appleRegisterLoginResult.data,
      pending: state.authentication.appleRegisterLoginResult.pending,
      error: state.authentication.appleRegisterLoginResult.error,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(
    (form: AppleForm) => {
      const d = new FormData();
      if (form.name) {
        d.append('name', form.name);
      }
      d.append('identityToken', form.identityToken);

      dispatch({
        type: AppleRegisterAndLoginActionType.BEGIN,
        payload: d,
      });
    },
    [dispatch],
  );

  return {
    registerAndLogin: boundAction,
    result,
    pending,
    error,
  };
};

export const useAppleLogin = () => {
  const dispatch = useDispatch();
  const { result, pending, error } = useSelector(
    (state: AppState) => ({
      result: state.authentication.appleLoginResult.data,
      pending: state.authentication.appleLoginResult.pending,
      error: state.authentication.appleLoginResult.error,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(
    (form: AppleForm) => {
      const d = new FormData();

      // d.append('name', form.name as any);
      d.append('identityToken', form.identityToken);

      dispatch({
        type: AppleLoginActionType.BEGIN,
        payload: d,
      });
    },
    [dispatch],
  );

  return {
    login: boundAction,
    result,
    pending,
    error,
  };
};

export const appleAuthReducer = {
  // apple register and login
  [AppleRegisterAndLoginActionType.BEGIN]: (
    state: AuthenticationState,
    action: ActionBase,
  ): AuthenticationState => {
    return {
      ...state,
      appleRegisterLoginResult: {
        ...state.appleRegisterLoginResult,
        pending: true,
        error: null,
      },
    };
  },
  [AppleRegisterAndLoginActionType.SUCCESS]: (
    state: AuthenticationState,
    action: ActionBase,
  ): AuthenticationState => {
    return {
      ...state,
      appleRegisterLoginResult: {
        ...state.appleRegisterLoginResult,
        data: action.payload,
        pending: false,
      },
      currentUser: {
        ...state.currentUser,
        data: action.payload,
      },
    };
  },
  [AppleRegisterAndLoginActionType.FAILURE]: (
    state: AuthenticationState,
    action: ActionBase,
  ): AuthenticationState => {
    return {
      ...state,
      appleRegisterLoginResult: {
        ...state.appleRegisterLoginResult,
        pending: false,
        error: action.error,
      },
    };
  },

  // apple   login only
  [AppleLoginActionType.BEGIN]: (
    state: AuthenticationState,
    action: ActionBase,
  ): AuthenticationState => {
    return {
      ...state,
      appleLoginResult: {
        ...state.appleLoginResult,
        pending: true,
        error: null,
      },
    };
  },
  [AppleLoginActionType.SUCCESS]: (
    state: AuthenticationState,
    action: ActionBase,
  ): AuthenticationState => {
    return {
      ...state,
      appleLoginResult: {
        ...state.appleLoginResult,
        data: action.payload,
        pending: false,
      },
      currentUser: {
        ...state.currentUser,
        data: action.payload,
      },
    };
  },
  [AppleLoginActionType.FAILURE]: (
    state: AuthenticationState,
    action: ActionBase,
  ): AuthenticationState => {
    return {
      ...state,
      appleLoginResult: {
        ...state.appleLoginResult,
        pending: false,
        error: action.error,
      },
    };
  },
};
