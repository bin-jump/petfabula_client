import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { AppState } from '../../../stateProvider';
import { UserState, Account } from './types';
import {
  LoadMyAccountActionType,
  UpdateMyAccountActionType,
  LoadCitiesActionType,
} from './actionTypes';
import { ActionBase, UploadImage } from '../../shared';

export const useLoadMyAccount = () => {
  const dispatch = useDispatch();
  const { account, pending, error } = useSelector(
    (state: AppState) => ({
      account: state.user.myAccount.data,
      pending: state.user.myAccount.pending,
      error: state.user.myAccount.error,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(() => {
    dispatch({
      type: LoadMyAccountActionType.BEGIN,
    });
  }, [dispatch]);

  return {
    loadAccount: boundAction,
    account,
    pending,
    error,
  };
};

export const useUpdateAccount = () => {
  const dispatch = useDispatch();
  const { result, pending, error } = useSelector(
    (state: AppState) => ({
      result: state.user.updateAccount.data,
      pending: state.user.updateAccount.pending,
      error: state.user.updateAccount.error,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(
    (pet: Account, image: UploadImage | null) => {
      const d = new FormData();
      d.append('account', JSON.stringify(pet));
      if (image) {
        d.append('image', {
          uri: image.uri,
          name: image.name,
          type: image.type,
        } as any);
      }

      dispatch({
        type: UpdateMyAccountActionType.BEGIN,
        payload: d,
      });
    },
    [dispatch],
  );

  return {
    updateAccount: boundAction,
    result,
    pending,
    error,
  };
};

export const useLoadCities = () => {
  const dispatch = useDispatch();
  const { cities, pending, error } = useSelector(
    (state: AppState) => ({
      cities: state.user.cities.data,
      pending: state.user.cities.pending,
      error: state.user.cities.error,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(() => {
    dispatch({
      type: LoadCitiesActionType.BEGIN,
    });
  }, [dispatch]);

  return {
    loadCities: boundAction,
    cities,
    pending,
    error,
  };
};

export const accountReducer = {
  // load account
  [LoadMyAccountActionType.BEGIN]: (
    state: UserState,
    action: ActionBase,
  ): UserState => {
    return {
      ...state,
      myAccount: {
        ...state.myAccount,
        pending: true,
        error: null,
      },
    };
  },
  [LoadMyAccountActionType.SUCCESS]: (
    state: UserState,
    action: ActionBase,
  ): UserState => {
    return {
      ...state,
      myAccount: {
        ...state.myAccount,
        data: action.payload,
        pending: false,
      },
    };
  },
  [LoadMyAccountActionType.FAILURE]: (
    state: UserState,
    action: ActionBase,
  ): UserState => {
    return {
      ...state,
      myAccount: {
        ...state.myAccount,
        pending: false,
        error: action.error,
      },
    };
  },

  // update
  [UpdateMyAccountActionType.BEGIN]: (
    state: UserState,
    action: ActionBase,
  ): UserState => {
    return {
      ...state,
      updateAccount: {
        ...state.updateAccount,
        pending: true,
        error: null,
      },
    };
  },
  [UpdateMyAccountActionType.SUCCESS]: (
    state: UserState,
    action: ActionBase,
  ): UserState => {
    return {
      ...state,
      updateAccount: {
        ...state.updateAccount,
        data: action.payload,
        pending: false,
      },
      myAccount: {
        ...state.myAccount,
        data: action.payload,
      },
    };
  },
  [UpdateMyAccountActionType.FAILURE]: (
    state: UserState,
    action: ActionBase,
  ): UserState => {
    return {
      ...state,
      updateAccount: {
        ...state.updateAccount,
        pending: false,
        error: action.error,
      },
    };
  },

  // load cities
  [LoadCitiesActionType.BEGIN]: (
    state: UserState,
    action: ActionBase,
  ): UserState => {
    return {
      ...state,
      cities: {
        ...state.cities,
        pending: true,
        error: null,
      },
    };
  },
  [LoadCitiesActionType.SUCCESS]: (
    state: UserState,
    action: ActionBase,
  ): UserState => {
    return {
      ...state,
      cities: {
        ...state.cities,
        data: action.payload,
        pending: false,
      },
    };
  },
  [LoadCitiesActionType.FAILURE]: (
    state: UserState,
    action: ActionBase,
  ): UserState => {
    return {
      ...state,
      cities: {
        ...state.cities,
        pending: false,
        error: action.error,
      },
    };
  },
};
