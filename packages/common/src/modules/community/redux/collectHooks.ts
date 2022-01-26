import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { AppState } from '../../../stateProvider';
import { CommunityState } from './types';
import {
  PostCollectActionType,
  PostRemoveCollectActionType,
} from './actionTypes';
import { ActionBase } from '../../shared';

export const useCollectPost = () => {
  const dispatch = useDispatch();
  const { pending } = useSelector(
    (state: AppState) => ({
      pending: state.community.postDetail.data?.collectPending,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(
    (postId: number) => {
      dispatch({ type: PostCollectActionType.BEGIN, payload: { postId } });
    },
    [dispatch],
  );

  return {
    collectPost: boundAction,
    pending,
  };
};

export const useRemoveCollectPost = () => {
  const dispatch = useDispatch();
  const { pending } = useSelector(
    (state: AppState) => ({
      pending: state.community.postDetail.data?.collectPending,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(
    (postId: number) => {
      dispatch({
        type: PostRemoveCollectActionType.BEGIN,
        payload: { postId },
      });
    },
    [dispatch],
  );

  return {
    removeCollectPost: boundAction,
    pending,
  };
};

export const postCollectReducer = {
  // collect post
  [PostCollectActionType.BEGIN]: (
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
              collectPending: true,
            }
          : state.postDetail.data,
      },
    };
  },
  [PostCollectActionType.SUCCESS]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    const postState = state.postDetail.data;
    const actionPostId = action.payload.postId;
    const diff = action.payload.collected ? 1 : -1;
    return {
      ...state,
      postDetail: {
        ...state.postDetail,
        data:
          postState && actionPostId == postState.id
            ? {
                ...postState,
                collectPending: false,
                collected: true,
                collectCount: postState?.collectCount + diff,
              }
            : postState,
      },
    };
  },
  [PostCollectActionType.FAILURE]: (
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
                collectPending: false,
              }
            : postState,
      },
    };
  },

  // remove collect post
  [PostRemoveCollectActionType.BEGIN]: (
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
              collectPending: true,
            }
          : state.postDetail.data,
      },
    };
  },
  [PostRemoveCollectActionType.SUCCESS]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    const postState = state.postDetail.data;
    const actionPostId = action.payload.postId;
    const diff = action.payload.collected ? -1 : 0;
    return {
      ...state,
      postDetail: {
        ...state.postDetail,
        data:
          postState && actionPostId == postState.id
            ? {
                ...postState,
                collectPending: false,
                collected: false,
                collectCount: postState?.collectCount + diff,
              }
            : postState,
      },
    };
  },
  [PostRemoveCollectActionType.FAILURE]: (
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
                collectPending: false,
              }
            : postState,
      },
    };
  },
};
