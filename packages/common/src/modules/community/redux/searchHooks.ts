import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { AppState } from '../../../stateProvider';
import { CommunityState } from './types';
import { PostSearchActionType } from './actionTypes';
import { ActionBase, fillCursorResponseData } from '../../shared';

export const useSearchPost = () => {
  const dispatch = useDispatch();
  const { posts, keyword, hasMore, nextCursor, pending, initializing, error } =
    useSelector(
      (state: AppState) => ({
        posts: state.community.searchPosts.data,
        keyword: state.community.searchPosts.keyword,
        hasMore: state.community.searchPosts.hasMore,
        nextCursor: state.community.searchPosts.nextCursor,
        pending: state.community.searchPosts.pending,
        initializing: state.community.searchPosts.initializing,
        error: state.community.searchPosts.error,
      }),
      shallowEqual,
    );

  const boundAction = useCallback(
    (keyword: string, cursor: number | null) => {
      dispatch({
        type: PostSearchActionType.BEGIN,
        payload: { keyword, cursor },
      });
    },
    [dispatch],
  );

  return {
    search: boundAction,
    hasMore,
    nextCursor,
    posts,
    keyword,
    pending,
    initializing,
    error,
  };
};

export const searchReducer = {
  // post search
  [PostSearchActionType.BEGIN]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      searchPosts: {
        ...state.searchPosts,
        //keyword: action.payload.keyword,
        initializing: true,
        pending: true,
        error: null,
      },
    };
  },
  [PostSearchActionType.SUCCESS]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      searchPosts: {
        ...fillCursorResponseData(state.searchPosts, action),
        ...{ keyword: action.extra.keyword },
      },
    };
  },
  [PostSearchActionType.FAILURE]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      searchPosts: {
        ...state.searchPosts,
        pending: false,
        initializing: false,
        error: action.error,
      },
    };
  },
};
