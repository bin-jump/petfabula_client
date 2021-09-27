import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { AppState } from '../../../stateProvider';
import {
  EmailCodeLoginForm,
  EmailCodeSendLoginCodeForm,
  AuthenticationState,
} from './types';
import {
  EmailCodeLoginActionType,
  LogoutActionType,
  EmailCodeSendLoginCodeActionType,
} from './actionTypes';
import { ActionBase } from '../../shared';

export const useEmailCodeSendLoginCode = () => {
  const dispatch = useDispatch();
  const { sendResult, pending, error } = useSelector(
    (state: AppState) => ({
      sendResult: state.authentication.emailCodeSendLoginCodeResult.data,
      pending: state.authentication.emailCodeSendLoginCodeResult.pending,
      error: state.authentication.emailCodeSendLoginCodeResult.error,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(
    (form: EmailCodeSendLoginCodeForm) => {
      dispatch({ type: EmailCodeSendLoginCodeActionType.BEGIN, payload: form });
    },
    [dispatch],
  );

  return {
    sendLoginCode: boundAction,
    sendResult,
    pending,
    error,
  };
};

export const useEmailCodeLogin = () => {
  const dispatch = useDispatch();
  const { loginResult, pending, error } = useSelector(
    (state: AppState) => ({
      loginResult: state.authentication.emailCodeLoginResult.data,
      pending: state.authentication.emailCodeLoginResult.pending,
      error: state.authentication.emailCodeLoginResult.error,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(
    (form: EmailCodeLoginForm) => {
      const d = new FormData();
      d.append('email', form.email);
      d.append('code', form.code);
      dispatch({ type: EmailCodeLoginActionType.BEGIN, payload: d });
    },
    [dispatch],
  );

  return {
    login: boundAction,
    loginResult,
    pending,
    error,
  };
};

export const useLogout = () => {
  const dispatch = useDispatch();
  const { logoutResult, pending, error } = useSelector(
    (state: AppState) => ({
      logoutResult: state.authentication.logoutResult.data,
      pending: state.authentication.logoutResult.pending,
      error: state.authentication.logoutResult.error,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(() => {
    dispatch({ type: LogoutActionType.BEGIN });
  }, [dispatch]);

  return {
    logout: boundAction,
    logoutResult,
    pending,
    error,
  };
};

export const loginReducer = {
  // send login code
  [EmailCodeSendLoginCodeActionType.BEGIN]: (
    state: AuthenticationState,
    action: ActionBase,
  ): AuthenticationState => {
    return {
      ...state,
      emailCodeSendLoginCodeResult: {
        ...state.emailCodeSendLoginCodeResult,
        pending: true,
        error: null,
      },
    };
  },
  [EmailCodeSendLoginCodeActionType.SUCCESS]: (
    state: AuthenticationState,
    action: ActionBase,
  ): AuthenticationState => {
    return {
      ...state,
      emailCodeSendLoginCodeResult: {
        ...state.emailCodeSendLoginCodeResult,
        data: { done: true },
        pending: false,
      },
    };
  },
  [EmailCodeSendLoginCodeActionType.FAILURE]: (
    state: AuthenticationState,
    action: ActionBase,
  ): AuthenticationState => {
    return {
      ...state,
      emailCodeSendLoginCodeResult: {
        ...state.emailCodeSendLoginCodeResult,
        error: action.error,
        pending: false,
      },
    };
  },

  // email code login
  [EmailCodeLoginActionType.BEGIN]: (
    state: AuthenticationState,
    action: ActionBase,
  ): AuthenticationState => {
    return {
      ...state,
      emailCodeLoginResult: {
        ...state.emailCodeLoginResult,
        pending: true,
        error: null,
      },
    };
  },
  [EmailCodeLoginActionType.SUCCESS]: (
    state: AuthenticationState,
    action: ActionBase,
  ): AuthenticationState => {
    return {
      ...state,
      emailCodeLoginResult: {
        ...state.emailCodeLoginResult,
        data: action.payload,
        pending: false,
      },
      currentUser: {
        ...state.currentUser,
        data: action.payload,
      },
    };
  },
  [EmailCodeLoginActionType.FAILURE]: (
    state: AuthenticationState,
    action: ActionBase,
  ): AuthenticationState => {
    return {
      ...state,
      emailCodeLoginResult: {
        ...state.emailCodeLoginResult,
        error: action.error,
        pending: false,
      },
    };
  },

  // logout
  [LogoutActionType.BEGIN]: (
    state: AuthenticationState,
    action: ActionBase,
  ): AuthenticationState => {
    return {
      ...state,
      logoutResult: {
        ...state.logoutResult,
        pending: true,
        error: null,
      },
    };
  },
  [LogoutActionType.SUCCESS]: (
    state: AuthenticationState,
    action: ActionBase,
  ): AuthenticationState => {
    return {
      ...state,
      logoutResult: {
        ...state.logoutResult,
        data: { done: true },
        pending: false,
      },
      currentUser: {
        ...state.currentUser,
        data: null,
      },
    };
  },
  [LogoutActionType.FAILURE]: (
    state: AuthenticationState,
    action: ActionBase,
  ): AuthenticationState => {
    return {
      ...state,
      logoutResult: {
        ...state.logoutResult,
        error: action.error,
        pending: false,
      },
    };
  },
};
