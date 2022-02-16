import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { AppState } from '../../../stateProvider';
import { CommunityState } from './types';
import {
  CommunityBlockUserActionType,
  CommunityUnblockUserActionType,
  LoadMyBlockedsActionType,
} from './actionTypes';
import { ActionBase, fillCursorResponseData } from '../../shared';

export const useBlockUser = () => {
  const dispatch = useDispatch();
  const { pending } = useSelector(
    (state: AppState) => ({
      pending: state.community.userProfile.data?.blockPending,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(
    (targetId: number) => {
      dispatch({
        type: CommunityBlockUserActionType.BEGIN,
        payload: { targetId },
      });
    },
    [dispatch],
  );

  return {
    blockUser: boundAction,
    pending,
  };
};

export const useUnblockUser = () => {
  const dispatch = useDispatch();
  const { pending } = useSelector(
    (state: AppState) => ({
      pending: state.community.userProfile.data?.blockPending,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(
    (targetId: number) => {
      dispatch({
        type: CommunityUnblockUserActionType.BEGIN,
        payload: { targetId },
      });
    },
    [dispatch],
  );

  return {
    unblockUser: boundAction,
    pending,
  };
};

export const useLoadMyBlocked = () => {
  const dispatch = useDispatch();
  const { users, hasMore, nextCursor, pending, initializing, error } =
    useSelector(
      (state: AppState) => ({
        users: state.community.myBlocked.data,
        hasMore: state.community.myBlocked.hasMore,
        nextCursor: state.community.myBlocked.nextCursor,
        pending: state.community.myBlocked.pending,
        initializing: state.community.myBlocked.initializing,
        error: state.community.myBlocked.error,
      }),
      shallowEqual,
    );

  const boundAction = useCallback(
    (cursor: object | null) => {
      dispatch({
        type: LoadMyBlockedsActionType.BEGIN,
        payload: { cursor },
      });
    },
    [dispatch],
  );

  return {
    loadMyBlocked: boundAction,
    users,
    hasMore,
    nextCursor,
    pending,
    initializing,
    error,
  };
};

export const blockReducer = {
  // load my blocked
  [LoadMyBlockedsActionType.BEGIN]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      myBlocked: {
        ...state.myBlocked,
        initializing: action.payload.cursor == null,
        pending: true,
        error: null,
      },
    };
  },
  [LoadMyBlockedsActionType.SUCCESS]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      myBlocked: {
        ...fillCursorResponseData(state.myBlocked, action),
      },
    };
  },
  [LoadMyBlockedsActionType.FAILURE]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      myBlocked: {
        ...state.myBlocked,
        pending: false,
        initializing: false,
        error: action.error,
      },
    };
  },

  // block user
  [CommunityBlockUserActionType.BEGIN]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    const actionParticipatorId = action.payload.targetId;
    const userProfile = state.userProfile.data;

    return {
      ...state,
      userProfile: {
        ...state.userProfile,
        data:
          userProfile && userProfile.id == actionParticipatorId
            ? {
                ...userProfile,
                blockPending: true,
              }
            : userProfile,
      },
    };
  },
  [CommunityBlockUserActionType.SUCCESS]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    const actionParticipatorId = action.payload.targetId;
    const userProfile = state.userProfile.data;

    return {
      ...state,
      userProfile: {
        ...state.userProfile,
        data:
          userProfile && userProfile.id == actionParticipatorId
            ? {
                ...userProfile,
                blockPending: false,
                blocked: true,
              }
            : userProfile,
      },
    };
  },
  [CommunityBlockUserActionType.FAILURE]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    const actionParticipatorId = action.extra.targetId;
    const userProfile = state.userProfile.data;

    return {
      ...state,
      userProfile: {
        ...state.userProfile,
        data:
          userProfile && userProfile.id == actionParticipatorId
            ? {
                ...userProfile,
                blockPending: false,
              }
            : userProfile,
      },
    };
  },

  // unblock user
  [CommunityUnblockUserActionType.BEGIN]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    const actionParticipatorId = action.payload.targetId;
    const userProfile = state.userProfile.data;

    return {
      ...state,
      userProfile: {
        ...state.userProfile,
        data:
          userProfile && userProfile.id == actionParticipatorId
            ? {
                ...userProfile,
                blockPending: true,
              }
            : userProfile,
      },
    };
  },
  [CommunityUnblockUserActionType.SUCCESS]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    const actionParticipatorId = action.payload.targetId;
    const userProfile = state.userProfile.data;

    return {
      ...state,
      userProfile: {
        ...state.userProfile,
        data:
          userProfile && userProfile.id == actionParticipatorId
            ? {
                ...userProfile,
                blockPending: false,
                blocked: false,
              }
            : userProfile,
      },
    };
  },
  [CommunityUnblockUserActionType.FAILURE]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    const actionParticipatorId = action.extra.targetId;
    const userProfile = state.userProfile.data;

    return {
      ...state,
      userProfile: {
        ...state.userProfile,
        data:
          userProfile && userProfile.id == actionParticipatorId
            ? {
                ...userProfile,
                blockPending: false,
              }
            : userProfile,
      },
    };
  },
};
