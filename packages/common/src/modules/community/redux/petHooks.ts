import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { AppState } from '../../../stateProvider';
import { CommunityState } from './types';
import { CommunityLoadMyPetsActionType } from './actionTypes';
import { ActionBase } from '../../shared';

export const useLoadParticipatorPets = () => {
  const dispatch = useDispatch();
  const { pets, pending, error } = useSelector(
    (state: AppState) => ({
      pets: state.community.mypets.data,
      pending: state.community.mypets.pending,
      error: state.community.mypets.error,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(() => {
    dispatch({ type: CommunityLoadMyPetsActionType.BEGIN });
  }, [dispatch]);

  return {
    loadPostTopics: boundAction,
    pets,
    pending,
    error,
  };
};

export const petReducer = {
  [CommunityLoadMyPetsActionType.BEGIN]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      mypets: {
        ...state.mypets,
        pending: true,
        error: null,
      },
    };
  },
  [CommunityLoadMyPetsActionType.SUCCESS]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      mypets: {
        ...state.mypets,
        pending: false,
        data: action.payload,
      },
    };
  },
  [CommunityLoadMyPetsActionType.FAILURE]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      mypets: {
        ...state.mypets,
        pending: false,
        error: action.error,
      },
    };
  },
};
