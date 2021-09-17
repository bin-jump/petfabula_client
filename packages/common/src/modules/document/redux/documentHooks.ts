import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { AppState } from '../../../stateProvider';
import { DocumentState } from './types';
import {
  LoadPrivacyAgreementActionType,
  LoadUserAgreementActionType,
} from './actionTypes';
import { ActionBase } from '../../shared';

export const useLoadUserAgreement = () => {
  const dispatch = useDispatch();
  const { userAgreement, pending, error } = useSelector(
    (state: AppState) => ({
      userAgreement: state.document.userAgreement.data,
      pending: state.document.userAgreement.pending,
      error: state.document.userAgreement.error,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(() => {
    dispatch({
      type: LoadUserAgreementActionType.BEGIN,
    });
  }, [dispatch]);

  return {
    loadUserAgreement: boundAction,
    userAgreement,
    pending,
    error,
  };
};

export const useLoadPrivacyAgreement = () => {
  const dispatch = useDispatch();
  const { privacyAgreement, pending, error } = useSelector(
    (state: AppState) => ({
      privacyAgreement: state.document.privacyAgreement.data,
      pending: state.document.privacyAgreement.pending,
      error: state.document.privacyAgreement.error,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(() => {
    dispatch({
      type: LoadPrivacyAgreementActionType.BEGIN,
    });
  }, [dispatch]);

  return {
    loadPrivacyAgreement: boundAction,
    privacyAgreement,
    pending,
    error,
  };
};

export const documentReducer = {
  [LoadUserAgreementActionType.BEGIN]: (
    state: DocumentState,
    action: ActionBase,
  ): DocumentState => {
    return {
      ...state,
      userAgreement: {
        ...state.userAgreement,
        pending: true,
        error: null,
      },
    };
  },
  [LoadUserAgreementActionType.SUCCESS]: (
    state: DocumentState,
    action: ActionBase,
  ): DocumentState => {
    return {
      ...state,
      userAgreement: {
        ...state.userAgreement,
        data: action.payload,
        pending: false,
      },
    };
  },
  [LoadUserAgreementActionType.FAILURE]: (
    state: DocumentState,
    action: ActionBase,
  ): DocumentState => {
    return {
      ...state,
      userAgreement: {
        ...state.userAgreement,
        pending: false,
        error: action.error,
      },
    };
  },

  [LoadPrivacyAgreementActionType.BEGIN]: (
    state: DocumentState,
    action: ActionBase,
  ): DocumentState => {
    return {
      ...state,
      privacyAgreement: {
        ...state.privacyAgreement,
        pending: true,
        error: null,
      },
    };
  },
  [LoadPrivacyAgreementActionType.SUCCESS]: (
    state: DocumentState,
    action: ActionBase,
  ): DocumentState => {
    return {
      ...state,
      privacyAgreement: {
        ...state.privacyAgreement,
        data: action.payload,
        pending: false,
      },
    };
  },
  [LoadPrivacyAgreementActionType.FAILURE]: (
    state: DocumentState,
    action: ActionBase,
  ): DocumentState => {
    return {
      ...state,
      privacyAgreement: {
        ...state.privacyAgreement,
        pending: false,
        error: action.error,
      },
    };
  },
};
