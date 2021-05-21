import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { AppState } from '../../../stateProvider';
import { AuthenticationState } from './types';
import { GetCurrentUserActionType } from './actionTypes';
import { ActionBase } from '../../shared';

export const useCurrentUser = () => {
  const dispatch = useDispatch();
  const { currentUser, pending, error } = useSelector(
    (state: AppState) => ({
      currentUser: state.authentication.currentUser.data,
      pending: state.authentication.currentUser.pending,
      error: state.authentication.currentUser.error,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(() => {
    dispatch({ type: GetCurrentUserActionType.BEGIN });
  }, [dispatch]);

  return {
    getCurrentUser: boundAction,
    currentUser,
    pending,
    error,
  };
};

export const checkLoginReducer = {
  // get current user
  [GetCurrentUserActionType.BEGIN]: (
    state: AuthenticationState,
    action: ActionBase,
  ): AuthenticationState => {
    return {
      ...state,
      currentUser: {
        ...state.currentUser,
        pending: true,
        error: null,
      },
    };
  },
  [GetCurrentUserActionType.SUCCESS]: (
    state: AuthenticationState,
    action: ActionBase,
  ): AuthenticationState => {
    return {
      ...state,
      currentUser: {
        ...state.currentUser,
        pending: false,
        data: action.payload,
      },
    };
  },
  [GetCurrentUserActionType.FAILURE]: (
    state: AuthenticationState,
    action: ActionBase,
  ): AuthenticationState => {
    return {
      ...state,
      currentUser: {
        ...state.currentUser,
        pending: false,
        error: action.error,
      },
    };
  },
};
