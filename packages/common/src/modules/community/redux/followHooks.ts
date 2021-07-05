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
    const actionParticipatorId = action.payload.participatorId;
    const postDetailState = state.postDetail.data;
    const questionDetailState = state.questionDetail.data;

    return {
      ...state,
      postDetail: {
        ...state.postDetail,
        data:
          postDetailState &&
          postDetailState.participator.id == actionParticipatorId
            ? {
                ...postDetailState,
                participator: {
                  ...postDetailState.participator,
                  followPending: true,
                },
              }
            : postDetailState,
      },
      questionDetail: {
        ...state.questionDetail,
        data:
          questionDetailState &&
          questionDetailState.participator.id == actionParticipatorId
            ? {
                ...questionDetailState,
                participator: {
                  ...questionDetailState.participator,
                  followPending: true,
                },
              }
            : questionDetailState,
      },
    };
  },
  [CommunityFollowUserActionType.SUCCESS]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    const actionParticipatorId = action.payload.participatorId;
    const postState = state.postDetail.data;
    const questionDetailState = state.questionDetail.data;

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
      questionDetail: {
        ...state.questionDetail,
        data:
          questionDetailState &&
          questionDetailState.participator.id == actionParticipatorId
            ? {
                ...questionDetailState,
                participator: {
                  ...questionDetailState.participator,
                  followPending: false,
                  followed: true,
                },
              }
            : questionDetailState,
      },
    };
  },
  [CommunityFollowUserActionType.FAILURE]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    const actionParticipatorId = action.extra.participatorId;
    const postDetailState = state.postDetail.data;
    const questionDetailState = state.questionDetail.data;

    return {
      ...state,
      postDetail: {
        ...state.postDetail,
        data:
          postDetailState &&
          postDetailState.participator.id == actionParticipatorId
            ? {
                ...postDetailState,
                participator: {
                  ...postDetailState.participator,
                  followPending: false,
                },
              }
            : postDetailState,
      },
      questionDetail: {
        ...state.questionDetail,
        data:
          questionDetailState &&
          questionDetailState.participator.id == actionParticipatorId
            ? {
                ...questionDetailState,
                participator: {
                  ...questionDetailState.participator,
                  followPending: false,
                },
              }
            : questionDetailState,
      },
    };
  },

  // unfollow user
  [CommunityUnfollowUserActionType.BEGIN]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    const actionParticipatorId = action.payload.participatorId;
    const postDetailState = state.postDetail.data;
    const questionDetailState = state.questionDetail.data;

    return {
      ...state,
      postDetail: {
        ...state.postDetail,
        data:
          postDetailState &&
          postDetailState.participator.id == actionParticipatorId
            ? {
                ...postDetailState,
                participator: {
                  ...postDetailState.participator,
                  followPending: true,
                },
              }
            : postDetailState,
      },
      questionDetail: {
        ...state.questionDetail,
        data:
          questionDetailState &&
          questionDetailState.participator.id == actionParticipatorId
            ? {
                ...questionDetailState,
                participator: {
                  ...questionDetailState.participator,
                  followPending: true,
                },
              }
            : questionDetailState,
      },
    };
  },
  [CommunityUnfollowUserActionType.SUCCESS]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    const postDetailState = state.postDetail.data;
    const actionParticipatorId = action.payload.participatorId;
    const questionDetailState = state.questionDetail.data;

    return {
      ...state,
      postDetail: {
        ...state.postDetail,
        data:
          postDetailState &&
          postDetailState.participator.id == actionParticipatorId
            ? {
                ...postDetailState,
                participator: {
                  ...postDetailState.participator,
                  followPending: false,
                  followed: false,
                },
              }
            : postDetailState,
      },
      questionDetail: {
        ...state.questionDetail,
        data:
          questionDetailState &&
          questionDetailState.participator.id == actionParticipatorId
            ? {
                ...questionDetailState,
                participator: {
                  ...questionDetailState.participator,
                  followPending: true,
                  followed: false,
                },
              }
            : questionDetailState,
      },
    };
  },
  [CommunityUnfollowUserActionType.FAILURE]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    const actionParticipatorId = action.extra.participatorId;
    const postDetailState = state.postDetail.data;
    const questionDetailState = state.questionDetail.data;

    return {
      ...state,
      postDetail: {
        ...state.postDetail,
        data:
          postDetailState &&
          postDetailState.participator.id == actionParticipatorId
            ? {
                ...postDetailState,
                participator: {
                  ...postDetailState.participator,
                  followPending: false,
                },
              }
            : postDetailState,
      },
      questionDetail: {
        ...state.questionDetail,
        data:
          questionDetailState &&
          questionDetailState.participator.id == actionParticipatorId
            ? {
                ...questionDetailState,
                participator: {
                  ...questionDetailState.participator,
                  followPending: false,
                },
              }
            : questionDetailState,
      },
    };
  },
};
