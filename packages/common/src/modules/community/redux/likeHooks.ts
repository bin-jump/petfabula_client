import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { AppState } from '../../../stateProvider';
import { CommunityState } from './types';
import { PostLikeActionType, PostUnlikeActionType } from './actionTypes';
import { ActionBase } from '../../shared';

export const useLikePost = () => {
  const dispatch = useDispatch();
  const { pending } = useSelector(
    (state: AppState) => ({
      pending: state.community.postDetail.data?.likePending,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(
    (postId: number) => {
      dispatch({ type: PostLikeActionType.BEGIN, payload: { postId } });
    },
    [dispatch],
  );

  return {
    likePost: boundAction,
    pending,
  };
};

export const useUnlikePost = () => {
  const dispatch = useDispatch();
  const { pending } = useSelector(
    (state: AppState) => ({
      pending: state.community.postDetail.data?.likePending,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(
    (postId: number) => {
      dispatch({ type: PostUnlikeActionType.BEGIN, payload: { postId } });
    },
    [dispatch],
  );

  return {
    unlikePost: boundAction,
    pending,
  };
};

export const postLikeReducer = {
  // like post
  [PostLikeActionType.BEGIN]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      postDetail: {
        ...state.postDetail,
        data: state.postDetail.data
          ? {
              ...state.postDetail.data,
              likePending: true,
            }
          : state.postDetail.data,
      },
    };
  },
  [PostLikeActionType.SUCCESS]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    const postState = state.postDetail.data;
    const actionPostId = action.payload.postId;
    const diff = action.payload.liked ? 1 : -1;
    return {
      ...state,
      postDetail: {
        ...state.postDetail,
        data:
          postState && actionPostId == postState.id
            ? {
                ...postState,
                likePending: false,
                liked: true,
                likeCount: postState?.likeCount + diff,
              }
            : postState,
      },
    };
  },
  [PostLikeActionType.FAILURE]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    const postState = state.postDetail.data;
    const actionPostId = action.payload.postId;
    return {
      ...state,
      postDetail: {
        ...state.postDetail,
        data:
          postState && actionPostId == postState.id
            ? {
                ...postState,
                likePending: false,
              }
            : postState,
      },
    };
  },

  // post unlike
  [PostUnlikeActionType.BEGIN]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      postDetail: {
        ...state.postDetail,
        data: state.postDetail.data
          ? {
              ...state.postDetail.data,
              likePending: true,
            }
          : state.postDetail.data,
      },
    };
  },
  [PostUnlikeActionType.SUCCESS]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    const postState = state.postDetail.data;
    const actionPostId = action.payload.postId;
    const diff = action.payload.liked ? 1 : -1;
    return {
      ...state,
      postDetail: {
        ...state.postDetail,
        data:
          postState && actionPostId == postState.id
            ? {
                ...postState,
                likePending: false,
                liked: false,
                likeCount: postState?.likeCount + diff,
              }
            : postState,
      },
    };
  },
  [PostUnlikeActionType.FAILURE]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    const postState = state.postDetail.data;
    const actionPostId = action.payload.postId;
    return {
      ...state,
      postDetail: {
        ...state.postDetail,
        data:
          postState && actionPostId == postState.id
            ? {
                ...postState,
                likePending: false,
              }
            : postState,
      },
    };
  },
};
