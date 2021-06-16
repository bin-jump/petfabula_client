import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { AppState } from '../../../stateProvider';
import { CommunityState } from './types';
import { PostLoadTopicActionType } from './actionTypes';
import { ActionBase } from '../../shared';

export const useLoadPostTopics = () => {
  const dispatch = useDispatch();
  const { topics, pending, error } = useSelector(
    (state: AppState) => ({
      topics: state.community.postTopics.data,
      pending: state.community.postTopics.pending,
      error: state.community.postTopics.error,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(() => {
    dispatch({ type: PostLoadTopicActionType.BEGIN });
  }, [dispatch]);

  return {
    loadPostTopics: boundAction,
    topics,
    pending,
    error,
  };
};

export const postTopicReducer = {
  [PostLoadTopicActionType.BEGIN]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      postTopics: {
        ...state.postTopics,
        pending: true,
        error: null,
      },
    };
  },
  [PostLoadTopicActionType.SUCCESS]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      postTopics: {
        ...state.postTopics,
        pending: false,
        data: action.payload,
      },
    };
  },
  [PostLoadTopicActionType.FAILURE]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      postTopics: {
        ...state.postTopics,
        pending: false,
        error: action.error,
      },
    };
  },
};
