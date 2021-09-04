import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { AppState } from '../../../stateProvider';
import { PostForm, CommunityState } from './types';
import {
  LoadMyProfileActionType,
  LoadUserProfileActionType,
  LoadUserPostsActionType,
  LoadUserQuestionsActionType,
  LoadUserAnswersActionType,
  LoadUserCollectedPostsActionType,
  LoadMyAnswersActionType,
  LoadMyPostsActionType,
  LoadMyFavoritePostsActionType,
  LoadMyQuestionsActionType,
} from './actionTypes';
import { ActionBase, fillCursorResponseData } from '../../shared';

export const useLoadMyProfile = () => {
  const dispatch = useDispatch();
  const { profile, pending, error } = useSelector(
    (state: AppState) => ({
      profile: state.community.myProfile.data,
      pending: state.community.myProfile.pending,
      error: state.community.myProfile.error,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(() => {
    dispatch({
      type: LoadMyProfileActionType.BEGIN,
    });
  }, [dispatch]);

  return {
    profile,
    loadMyProfile: boundAction,
    pending,
    error,
  };
};

export const useLoadMyPosts = () => {
  const dispatch = useDispatch();
  const { posts, hasMore, nextCursor, pending, initializing, error } =
    useSelector(
      (state: AppState) => ({
        posts: state.community.myPosts.data,
        hasMore: state.community.myPosts.hasMore,
        nextCursor: state.community.myPosts.nextCursor,
        pending: state.community.myPosts.pending,
        initializing: state.community.myPosts.initializing,
        error: state.community.myPosts.error,
      }),
      shallowEqual,
    );

  const boundAction = useCallback(
    (cursor: object | null) => {
      dispatch({
        type: LoadMyPostsActionType.BEGIN,
        payload: { cursor },
      });
    },
    [dispatch],
  );

  return {
    loadMyPosts: boundAction,
    hasMore,
    nextCursor,
    posts,
    pending,
    initializing,
    error,
  };
};

export const useLoadMyQuestions = () => {
  const dispatch = useDispatch();
  const { questions, hasMore, nextCursor, pending, initializing, error } =
    useSelector(
      (state: AppState) => ({
        questions: state.community.myQuestions.data,
        hasMore: state.community.myQuestions.hasMore,
        nextCursor: state.community.myQuestions.nextCursor,
        pending: state.community.myQuestions.pending,
        initializing: state.community.myQuestions.initializing,
        error: state.community.myQuestions.error,
      }),
      shallowEqual,
    );

  const boundAction = useCallback(
    (cursor: object | null) => {
      dispatch({
        type: LoadMyQuestionsActionType.BEGIN,
        payload: { cursor },
      });
    },
    [dispatch],
  );

  return {
    loadMyQuestions: boundAction,
    hasMore,
    nextCursor,
    questions,
    pending,
    initializing,
    error,
  };
};

export const useLoadMyAnswers = () => {
  const dispatch = useDispatch();
  const { answers, hasMore, nextCursor, pending, initializing, error } =
    useSelector(
      (state: AppState) => ({
        answers: state.community.myAnswers.data,
        hasMore: state.community.myAnswers.hasMore,
        nextCursor: state.community.myAnswers.nextCursor,
        pending: state.community.myAnswers.pending,
        initializing: state.community.myAnswers.initializing,
        error: state.community.myAnswers.error,
      }),
      shallowEqual,
    );

  const boundAction = useCallback(
    (cursor: object | null) => {
      dispatch({
        type: LoadMyAnswersActionType.BEGIN,
        payload: { cursor },
      });
    },
    [dispatch],
  );

  return {
    loadMyAnswers: boundAction,
    hasMore,
    nextCursor,
    answers,
    pending,
    initializing,
    error,
  };
};

export const useLoadMyFavoritePosts = () => {
  const dispatch = useDispatch();
  const { posts, hasMore, nextCursor, pending, initializing, error } =
    useSelector(
      (state: AppState) => ({
        posts: state.community.myFavoritePosts.data,
        hasMore: state.community.myFavoritePosts.hasMore,
        nextCursor: state.community.myFavoritePosts.nextCursor,
        pending: state.community.myFavoritePosts.pending,
        initializing: state.community.myFavoritePosts.initializing,
        error: state.community.myFavoritePosts.error,
      }),
      shallowEqual,
    );

  const boundAction = useCallback(
    (cursor: object | null) => {
      dispatch({
        type: LoadMyFavoritePostsActionType.BEGIN,
        payload: { cursor },
      });
    },
    [dispatch],
  );

  return {
    loadMyFavoritePosts: boundAction,
    hasMore,
    nextCursor,
    posts,
    pending,
    initializing,
    error,
  };
};

export const useLoadUserProfile = () => {
  const dispatch = useDispatch();
  const { profile, pending, error } = useSelector(
    (state: AppState) => ({
      profile: state.community.userProfile.data,
      pending: state.community.userProfile.pending,
      error: state.community.userProfile.error,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(
    (userId: number) => {
      dispatch({
        type: LoadUserProfileActionType.BEGIN,
        payload: { userId },
      });
    },
    [dispatch],
  );

  return {
    profile,
    loadUserProfile: boundAction,
    pending,
    error,
  };
};

export const useLoadUserPosts = () => {
  const dispatch = useDispatch();
  const { userId, posts, hasMore, nextCursor, pending, initializing, error } =
    useSelector(
      (state: AppState) => ({
        userId: state.community.userPosts.userId,
        posts: state.community.userPosts.data,
        hasMore: state.community.userPosts.hasMore,
        nextCursor: state.community.userPosts.nextCursor,
        pending: state.community.userPosts.pending,
        initializing: state.community.userPosts.initializing,
        error: state.community.userPosts.error,
      }),
      shallowEqual,
    );

  const boundAction = useCallback(
    (userId: number, cursor: object | null) => {
      dispatch({
        type: LoadUserPostsActionType.BEGIN,
        payload: { userId, cursor },
      });
    },
    [dispatch],
  );

  return {
    userId,
    loadUserPosts: boundAction,
    hasMore,
    nextCursor,
    posts,
    pending,
    initializing,
    error,
  };
};

export const useLoadUserCollectedPosts = () => {
  const dispatch = useDispatch();
  const { userId, posts, hasMore, nextCursor, pending, initializing, error } =
    useSelector(
      (state: AppState) => ({
        userId: state.community.userCollectedPosts.userId,
        posts: state.community.userCollectedPosts.data,
        hasMore: state.community.userCollectedPosts.hasMore,
        nextCursor: state.community.userCollectedPosts.nextCursor,
        pending: state.community.userCollectedPosts.pending,
        initializing: state.community.userCollectedPosts.initializing,
        error: state.community.userCollectedPosts.error,
      }),
      shallowEqual,
    );

  const boundAction = useCallback(
    (userId: number, cursor: object | null) => {
      dispatch({
        type: LoadUserCollectedPostsActionType.BEGIN,
        payload: { userId, cursor },
      });
    },
    [dispatch],
  );

  return {
    userId,
    loadCollectedPosts: boundAction,
    hasMore,
    nextCursor,
    posts,
    pending,
    initializing,
    error,
  };
};

export const useLoadUserQuestions = () => {
  const dispatch = useDispatch();
  const {
    userId,
    questions,
    hasMore,
    nextCursor,
    pending,
    initializing,
    error,
  } = useSelector(
    (state: AppState) => ({
      userId: state.community.userQuestions.userId,
      questions: state.community.userQuestions.data,
      hasMore: state.community.userQuestions.hasMore,
      nextCursor: state.community.userQuestions.nextCursor,
      pending: state.community.userQuestions.pending,
      initializing: state.community.userQuestions.initializing,
      error: state.community.userQuestions.error,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(
    (userId: number, cursor: object | null) => {
      dispatch({
        type: LoadUserQuestionsActionType.BEGIN,
        payload: { userId, cursor },
      });
    },
    [dispatch],
  );

  return {
    userId,
    loadUserQuestions: boundAction,
    questions,
    hasMore,
    nextCursor,
    pending,
    initializing,
    error,
  };
};

export const useLoadUserAnswers = () => {
  const dispatch = useDispatch();
  const { userId, answers, hasMore, nextCursor, pending, initializing, error } =
    useSelector(
      (state: AppState) => ({
        userId: state.community.userAnswers.userId,
        answers: state.community.userAnswers.data,
        hasMore: state.community.userAnswers.hasMore,
        nextCursor: state.community.userAnswers.nextCursor,
        pending: state.community.userAnswers.pending,
        initializing: state.community.userAnswers.initializing,
        error: state.community.userAnswers.error,
      }),
      shallowEqual,
    );

  const boundAction = useCallback(
    (userId: number, cursor: object | null) => {
      dispatch({
        type: LoadUserAnswersActionType.BEGIN,
        payload: { userId, cursor },
      });
    },
    [dispatch],
  );

  return {
    userId,
    loadUserAnswers: boundAction,
    answers,
    hasMore,
    nextCursor,
    pending,
    initializing,
    error,
  };
};

export const participatorReducer = {
  // my profile
  [LoadMyProfileActionType.BEGIN]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      myProfile: {
        ...state.myProfile,
        pending: true,
        error: null,
      },
    };
  },
  [LoadMyProfileActionType.SUCCESS]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      myProfile: {
        ...state.myProfile,
        pending: false,
        data: action.payload,
      },
    };
  },
  [LoadMyProfileActionType.FAILURE]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      myProfile: {
        ...state.myProfile,
        pending: false,
        error: action.error,
      },
    };
  },

  // user profile
  [LoadUserProfileActionType.BEGIN]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      userProfile: {
        ...state.userProfile,
        pending: true,
        error: null,
      },
    };
  },
  [LoadUserProfileActionType.SUCCESS]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      userProfile: {
        ...state.userProfile,
        pending: false,
        data: action.payload,
      },
    };
  },
  [LoadUserProfileActionType.FAILURE]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      userProfile: {
        ...state.userProfile,
        pending: false,
        error: action.error,
      },
    };
  },

  // my posts
  [LoadMyPostsActionType.BEGIN]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      myPosts: {
        ...state.myPosts,
        initializing: action.payload.cursor == null,
        pending: true,
        error: null,
      },
    };
  },
  [LoadMyPostsActionType.SUCCESS]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      myPosts: {
        ...fillCursorResponseData(state.myPosts, action),
      },
    };
  },
  [LoadMyPostsActionType.FAILURE]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      myPosts: {
        ...state.myPosts,
        pending: false,
        initializing: false,
        error: action.error,
      },
    };
  },

  // my questions
  [LoadMyQuestionsActionType.BEGIN]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      myQuestions: {
        ...state.myQuestions,
        initializing: action.payload.cursor == null,
        pending: true,
        error: null,
      },
    };
  },
  [LoadMyQuestionsActionType.SUCCESS]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      myQuestions: {
        ...fillCursorResponseData(state.myQuestions, action),
      },
    };
  },
  [LoadMyQuestionsActionType.FAILURE]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      myQuestions: {
        ...state.myQuestions,
        pending: false,
        initializing: false,
        error: action.error,
      },
    };
  },

  // my answers
  [LoadMyAnswersActionType.BEGIN]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      myAnswers: {
        ...state.myAnswers,
        initializing: action.payload.cursor == null,
        pending: true,
        error: null,
      },
    };
  },
  [LoadMyAnswersActionType.SUCCESS]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      myAnswers: {
        ...fillCursorResponseData(state.myAnswers, action),
      },
    };
  },
  [LoadMyAnswersActionType.FAILURE]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      myAnswers: {
        ...state.myAnswers,
        pending: false,
        initializing: false,
        error: action.error,
      },
    };
  },

  // my favorite posts
  [LoadMyFavoritePostsActionType.BEGIN]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      myFavoritePosts: {
        ...state.myFavoritePosts,
        initializing: action.payload.cursor == null,
        pending: true,
        error: null,
      },
    };
  },
  [LoadMyFavoritePostsActionType.SUCCESS]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      myFavoritePosts: {
        ...fillCursorResponseData(state.myFavoritePosts, action),
      },
    };
  },
  [LoadMyFavoritePostsActionType.FAILURE]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      myFavoritePosts: {
        ...state.myFavoritePosts,
        pending: false,
        initializing: false,
        error: action.error,
      },
    };
  },

  // user posts
  [LoadUserPostsActionType.BEGIN]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      userPosts: {
        ...state.userPosts,
        initializing: action.payload.cursor == null,
        pending: true,
        error: null,
      },
    };
  },
  [LoadUserPostsActionType.SUCCESS]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      userPosts: {
        ...fillCursorResponseData(state.userPosts, action),
        userId: action.extra.userId,
      },
    };
  },
  [LoadUserPostsActionType.FAILURE]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      userPosts: {
        ...state.userPosts,
        pending: false,
        initializing: false,
        error: action.error,
      },
    };
  },

  // collected posts
  [LoadUserCollectedPostsActionType.BEGIN]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      userCollectedPosts: {
        ...state.userCollectedPosts,
        initializing: action.payload.cursor == null,
        pending: true,
        error: null,
      },
    };
  },
  [LoadUserCollectedPostsActionType.SUCCESS]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      userCollectedPosts: {
        ...fillCursorResponseData(state.userCollectedPosts, action),
        userId: action.extra.userId,
      },
    };
  },
  [LoadUserCollectedPostsActionType.FAILURE]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      userCollectedPosts: {
        ...state.userCollectedPosts,
        pending: false,
        initializing: false,
        error: action.error,
      },
    };
  },

  // user questions
  [LoadUserQuestionsActionType.BEGIN]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      userQuestions: {
        ...state.userQuestions,
        initializing: action.payload.cursor == null,
        pending: true,
        error: null,
      },
    };
  },
  [LoadUserQuestionsActionType.SUCCESS]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      userQuestions: {
        ...fillCursorResponseData(state.userQuestions, action),
        userId: action.extra.userId,
      },
    };
  },
  [LoadUserQuestionsActionType.FAILURE]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      userQuestions: {
        ...state.userQuestions,
        pending: false,
        initializing: false,
        error: action.error,
      },
    };
  },

  // user answers
  [LoadUserAnswersActionType.BEGIN]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      userAnswers: {
        ...state.userAnswers,
        initializing: action.payload.cursor == null,
        pending: true,
        error: null,
      },
    };
  },
  [LoadUserAnswersActionType.SUCCESS]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      userAnswers: {
        ...fillCursorResponseData(state.userAnswers, action),
        userId: action.extra.userId,
      },
    };
  },
  [LoadUserAnswersActionType.FAILURE]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      userAnswers: {
        ...state.userAnswers,
        pending: false,
        initializing: false,
        error: action.error,
      },
    };
  },
};
