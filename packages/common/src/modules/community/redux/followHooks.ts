import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { AppState } from '../../../stateProvider';
import { CommunityState } from './types';
import {
  CommunityFollowUserActionType,
  CommunityUnfollowUserActionType,
} from './actionTypes';
import { ActionBase } from '../../shared';

export const useFollowUser = () => {
  const dispatch = useDispatch();
  const { pending } = useSelector(
    (state: AppState) => ({
      pending: state.community.postDetail.data?.participator.followPending,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(
    (participatorId: number) => {
      dispatch({
        type: CommunityFollowUserActionType.BEGIN,
        payload: { participatorId },
      });
    },
    [dispatch],
  );

  return {
    followUser: boundAction,
    pending,
  };
};

export const useUnfollowUser = () => {
  const dispatch = useDispatch();
  const { pending } = useSelector(
    (state: AppState) => ({
      pending: state.community.postDetail.data?.participator.followPending,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(
    (participatorId: number) => {
      dispatch({
        type: CommunityUnfollowUserActionType.BEGIN,
        payload: { participatorId },
      });
    },
    [dispatch],
  );

  return {
    unfollowUser: boundAction,
    pending,
  };
};

export const userFollowReducer = {
  // follow user
  [CommunityFollowUserActionType.BEGIN]: (
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
              participator: {
                ...state.postDetail.data.participator,
                followPending: true,
              },
            }
          : state.postDetail.data,
      },
    };
  },
  [CommunityFollowUserActionType.SUCCESS]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    const postState = state.postDetail.data;
    const actionParticipatorId = action.payload.participatorId;
    return {
      ...state,
      postDetail: {
        ...state.postDetail,
        data:
          postState && postState.participator.id == actionParticipatorId
            ? {
                ...postState,
                participator: {
                  ...postState.participator,
                  followPending: false,
                  followed: true,
                },
              }
            : postState,
      },
    };
  },
  [CommunityFollowUserActionType.FAILURE]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    const postState = state.postDetail.data;
    return {
      ...state,
      postDetail: {
        ...state.postDetail,
        data: postState
          ? {
              ...postState,
              participator: {
                ...postState.participator,
                followPending: false,
              },
            }
          : postState,
      },
    };
  },

  // unfollow user
  [CommunityUnfollowUserActionType.BEGIN]: (
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
              participator: {
                ...state.postDetail.data.participator,
                followPending: true,
              },
            }
          : state.postDetail.data,
      },
    };
  },
  [CommunityUnfollowUserActionType.SUCCESS]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    const postState = state.postDetail.data;
    const actionParticipatorId = action.payload.participatorId;
    return {
      ...state,
      postDetail: {
        ...state.postDetail,
        data:
          postState && postState.participator.id == actionParticipatorId
            ? {
                ...postState,
                participator: {
                  ...postState.participator,
                  followPending: false,
                  followed: false,
                },
              }
            : postState,
      },
    };
  },
  [CommunityUnfollowUserActionType.FAILURE]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    const postState = state.postDetail.data;
    return {
      ...state,
      postDetail: {
        ...state.postDetail,
        data: postState
          ? {
              ...postState,
              participator: {
                ...postState.participator,
                followPending: false,
              },
            }
          : postState,
      },
    };
  },
};
