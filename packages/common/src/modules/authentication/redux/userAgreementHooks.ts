import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { AppState } from '../../../stateProvider';
import { AuthenticationState } from './types';
import { GetUserAgreementActionType } from './actionTypes';
import { ActionBase } from '../../shared';

export const useUserAgreement = () => {
  const dispatch = useDispatch();
  const { userAgreement, pending, error } = useSelector(
    (state: AppState) => ({
      userAgreement: state.authentication.userAgreement.data,
      pending: state.authentication.userAgreement.pending,
      error: state.authentication.userAgreement.error,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(() => {
    dispatch({ type: GetUserAgreementActionType.BEGIN });
  }, [dispatch]);

  return {
    getUserAgreement: boundAction,
    userAgreement,
    pending,
    error,
  };
};

export const userAgreementReducer = {
  // get user agreement
  [GetUserAgreementActionType.BEGIN]: (
    state: AuthenticationState,
    action: ActionBase,
  ): AuthenticationState => {
    return {
      ...state,
      userAgreement: {
        ...state.userAgreement,
        pending: true,
        error: null,
      },
    };
  },
  [GetUserAgreementActionType.SUCCESS]: (
    state: AuthenticationState,
    action: ActionBase,
  ): AuthenticationState => {
    return {
      ...state,
      userAgreement: {
        ...state.userAgreement,
        pending: false,
        data: action.payload,
      },
    };
  },
  [GetUserAgreementActionType.FAILURE]: (
    state: AuthenticationState,
    action: ActionBase,
  ): AuthenticationState => {
    return {
      ...state,
      userAgreement: {
        ...state.userAgreement,
        pending: false,
        error: action.error,
      },
    };
  },
};
