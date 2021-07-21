import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { AppState } from '../../../stateProvider';
import { CommunityState } from './types';
import { CommunityLoadUserPetsActionType } from './actionTypes';
import { ActionBase } from '../../shared';

export const useLoadParticipatorPets = () => {
  const dispatch = useDispatch();
  const { pets, pending, error } = useSelector(
    (state: AppState) => ({
      pets: state.community.userPets.data,
      pending: state.community.userPets.pending,
      error: state.community.userPets.error,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(() => {
    dispatch({ type: CommunityLoadUserPetsActionType.BEGIN });
  }, [dispatch]);

  return {
    loadPostTopics: boundAction,
    pets,
    pending,
    error,
  };
};

export const petReducer = {
  [CommunityLoadUserPetsActionType.BEGIN]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      userPets: {
        ...state.userPets,
        pending: true,
        error: null,
      },
    };
  },
  [CommunityLoadUserPetsActionType.SUCCESS]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      userPets: {
        ...state.userPets,
        pending: false,
        data: action.payload,
        userId: action.extra.userId,
      },
    };
  },
  [CommunityLoadUserPetsActionType.FAILURE]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      userPets: {
        ...state.userPets,
        pending: false,
        error: action.error,
      },
    };
  },
};
