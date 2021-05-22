import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { AppState } from '../../../stateProvider';
import {
  EmailCodeRegisterForm,
  AuthenticationState,
  OauthForm,
  EmailCodeSendRegisterCodeForm,
} from './types';
import {
  EmailCodeRegisterAndLoginActionType,
  EmailCodeSendRegisterCodeActionType,
  OauthRegisterAndLoginActionType,
} from './actionTypes';
import { ActionBase } from '../../shared';

export const useEmailCodeSendRegisterCode = () => {
  const dispatch = useDispatch();
  const { sendResult, pending, error } = useSelector(
    (state: AppState) => ({
      sendResult: state.authentication.emailCodeSendRegisterCodeResult.data,
      pending: state.authentication.emailCodeSendRegisterCodeResult.pending,
      error: state.authentication.emailCodeSendRegisterCodeResult.error,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(
    (form: EmailCodeSendRegisterCodeForm) => {
      dispatch({
        type: EmailCodeSendRegisterCodeActionType.BEGIN,
        payload: form,
      });
    },
    [dispatch],
  );

  return {
    sendCode: boundAction,
    sendResult,
    pending,
    error,
  };
};

export const useEmailCodeRegisterAndLogin = () => {
  const dispatch = useDispatch();
  const { registerResult, pending, error } = useSelector(
    (state: AppState) => ({
      registerResult: state.authentication.emailCodeRegisterAndLoginResult.data,
      pending: state.authentication.emailCodeRegisterAndLoginResult.pending,
      error: state.authentication.emailCodeRegisterAndLoginResult.error,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(
    (form: EmailCodeRegisterForm) => {
      dispatch({
        type: EmailCodeRegisterAndLoginActionType.BEGIN,
        payload: form,
      });
    },
    [dispatch],
  );

  return {
    registerAndLogin: boundAction,
    registerResult,
    pending,
    error,
  };
};

export const useOauthRegisterAndLogin = () => {
  const dispatch = useDispatch();
  const { registerAndLoginResult, pending, error } = useSelector(
    (state: AppState) => ({
      registerAndLoginResult:
        state.authentication.oauthRegisterLoginResult.data,
      pending: state.authentication.oauthRegisterLoginResult.pending,
      error: state.authentication.oauthRegisterLoginResult.error,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(
    (form: OauthForm) => {
      dispatch({ type: OauthRegisterAndLoginActionType.BEGIN, payload: form });
    },
    [dispatch],
  );

  return {
    registerAndLogin: boundAction,
    registerAndLoginResult,
    pending,
    error,
  };
};

export const registerReducer = {
  // send email code register code
  [EmailCodeSendRegisterCodeActionType.BEGIN]: (
    state: AuthenticationState,
    action: ActionBase,
  ): AuthenticationState => {
    return {
      ...state,
      emailCodeSendRegisterCodeResult: {
        ...state.emailCodeSendRegisterCodeResult,
        pending: true,
        error: null,
      },
    };
  },
  [EmailCodeSendRegisterCodeActionType.SUCCESS]: (
    state: AuthenticationState,
    action: ActionBase,
  ): AuthenticationState => {
    return {
      ...state,
      emailCodeSendRegisterCodeResult: {
        ...state.emailCodeSendRegisterCodeResult,
        pending: false,
        data: { done: true },
      },
    };
  },
  [EmailCodeSendRegisterCodeActionType.FAILURE]: (
    state: AuthenticationState,
    action: ActionBase,
  ): AuthenticationState => {
    return {
      ...state,
      emailCodeSendRegisterCodeResult: {
        ...state.emailCodeSendRegisterCodeResult,
        pending: false,
        error: action.error,
      },
    };
  },

  // email code register
  [EmailCodeRegisterAndLoginActionType.BEGIN]: (
    state: AuthenticationState,
    action: ActionBase,
  ): AuthenticationState => {
    return {
      ...state,
      emailCodeRegisterAndLoginResult: {
        ...state.emailCodeRegisterAndLoginResult,
        pending: true,
        error: null,
      },
    };
  },
  [EmailCodeRegisterAndLoginActionType.SUCCESS]: (
    state: AuthenticationState,
    action: ActionBase,
  ): AuthenticationState => {
    return {
      ...state,
      emailCodeRegisterAndLoginResult: {
        ...state.emailCodeRegisterAndLoginResult,
        data: action.payload,
        pending: false,
      },
      currentUser: {
        ...state.currentUser,
        data: action.payload,
      },
    };
  },
  [EmailCodeRegisterAndLoginActionType.FAILURE]: (
    state: AuthenticationState,
    action: ActionBase,
  ): AuthenticationState => {
    return {
      ...state,
      emailCodeRegisterAndLoginResult: {
        ...state.emailCodeRegisterAndLoginResult,
        pending: false,
        error: action.error,
      },
    };
  },

  // oauth register and login
  [OauthRegisterAndLoginActionType.BEGIN]: (
    state: AuthenticationState,
    action: ActionBase,
  ): AuthenticationState => {
    return {
      ...state,
      oauthRegisterLoginResult: {
        ...state.oauthRegisterLoginResult,
        pending: true,
        error: null,
      },
    };
  },
  [OauthRegisterAndLoginActionType.SUCCESS]: (
    state: AuthenticationState,
    action: ActionBase,
  ): AuthenticationState => {
    return {
      ...state,
      oauthRegisterLoginResult: {
        ...state.oauthRegisterLoginResult,
        data: action.payload,
        pending: false,
      },
      currentUser: {
        ...state.currentUser,
        data: action.payload,
      },
    };
  },
  [OauthRegisterAndLoginActionType.FAILURE]: (
    state: AuthenticationState,
    action: ActionBase,
  ): AuthenticationState => {
    return {
      ...state,
      oauthRegisterLoginResult: {
        ...state.oauthRegisterLoginResult,
        pending: false,
        error: action.error,
      },
    };
  },
};
