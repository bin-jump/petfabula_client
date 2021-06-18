import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { AppState } from '../../../stateProvider';
import { PostForm, CommunityState } from './types';
import {
  PostLoadDetailActionType,
  LoadMyPostsActionType,
  PostLoadOthersPostsActionType,
  LoadRecommendPostsActionType,
  LoadFollowedPostsActionType,
  PostCreatePostActionType,
  PostRemovePostActionType,
} from './actionTypes';
import { ActionBase, UploadImage, fillCursorResponseData } from '../../shared';

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
    (cursor: number | null) => {
      dispatch({ type: LoadMyPostsActionType.BEGIN, payload: { cursor } });
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

export const useLoadPostDetail = () => {
  const dispatch = useDispatch();
  const { post, pending, error } = useSelector(
    (state: AppState) => ({
      post: state.community.postDetail.data,
      pending: state.community.postDetail.pending,
      error: state.community.postDetail.error,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(
    (postId: number) => {
      dispatch({ type: PostLoadDetailActionType.BEGIN, payload: { postId } });
    },
    [dispatch],
  );

  return {
    loadPostDetail: boundAction,
    post,
    pending,
    error,
  };
};

export const useLoadRecommendPosts = () => {
  const dispatch = useDispatch();
  const { posts, initializing, hasMore, nextCursor, pending, error } =
    useSelector(
      (state: AppState) => ({
        posts: state.community.recommendPosts.data,
        hasMore: state.community.recommendPosts.hasMore,
        nextCursor: state.community.recommendPosts.nextCursor,
        pending: state.community.recommendPosts.pending,
        initializing: state.community.recommendPosts.initializing,
        error: state.community.recommendPosts.error,
      }),
      shallowEqual,
    );

  const boundAction = useCallback(
    (cursor: number | null) => {
      dispatch({
        type: LoadRecommendPostsActionType.BEGIN,
        payload: { cursor },
      });
    },
    [dispatch],
  );

  return {
    loadRecommendPosts: boundAction,
    posts,
    hasMore,
    nextCursor,
    initializing,
    pending,
    error,
  };
};

export const useLoadFollowedPosts = () => {
  const dispatch = useDispatch();
  const { posts, hasMore, nextCursor, pending, initializing, error } =
    useSelector(
      (state: AppState) => ({
        posts: state.community.followedPosts.data,
        hasMore: state.community.followedPosts.hasMore,
        nextCursor: state.community.followedPosts.nextCursor,
        pending: state.community.followedPosts.pending,
        initializing: state.community.followedPosts.initializing,
        error: state.community.followedPosts.error,
      }),
      shallowEqual,
    );

  const boundAction = useCallback(
    (cursor: number | null) => {
      dispatch({
        type: LoadFollowedPostsActionType.BEGIN,
        payload: { cursor },
      });
    },
    [dispatch],
  );

  return {
    loadTimeline: boundAction,
    posts,
    hasMore,
    nextCursor,
    pending,
    initializing,
    error,
  };
};

export const useLoadOthersPosts = () => {
  const dispatch = useDispatch();
  const { posts, hasMore, nextCursor, pending, initializing, error } =
    useSelector(
      (state: AppState) => ({
        posts: state.community.othersPosts.data,
        hasMore: state.community.othersPosts.hasMore,
        nextCursor: state.community.othersPosts.nextCursor,
        pending: state.community.othersPosts.pending,
        initializing: state.community.othersPosts.initializing,
        error: state.community.othersPosts.error,
      }),
      shallowEqual,
    );

  const boundAction = useCallback(
    (userId: number, cursor: number | null) => {
      dispatch({
        type: PostLoadOthersPostsActionType.BEGIN,
        payload: { userId, cursor },
      });
    },
    [dispatch],
  );

  return {
    loadOthersPosts: boundAction,
    posts,
    hasMore,
    nextCursor,
    pending,
    initializing,
    error,
  };
};

export const useCreatePost = () => {
  const dispatch = useDispatch();
  const { result, pending, error } = useSelector(
    (state: AppState) => ({
      result: state.community.createPost.data,
      pending: state.community.createPost.pending,
      error: state.community.createPost.error,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(
    (postForm: PostForm, images: Array<UploadImage>) => {
      const d = new FormData();
      d.append('post', JSON.stringify(postForm));
      for (const image of images) {
        if (image) {
          d.append('images', {
            uri: image.uri,
            name: image.name,
            type: image.type,
          } as any);
        }
      }

      dispatch({
        type: PostCreatePostActionType.BEGIN,
        payload: d,
      });
    },
    [dispatch],
  );

  return {
    createPost: boundAction,
    result,
    pending,
    error,
  };
};

export const useRemovePost = () => {
  const dispatch = useDispatch();
  const { result, pending, error } = useSelector(
    (state: AppState) => ({
      result: state.community.removePost.data,
      pending: state.community.removePost.pending,
      error: state.community.removePost.error,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(
    (id: number) => {
      dispatch({
        type: PostRemovePostActionType.BEGIN,
        payload: { postId: id },
      });
    },
    [dispatch],
  );

  return {
    removePost: boundAction,
    result,
    pending,
    error,
  };
};

export const postReducer = {
  // post detail
  [PostLoadDetailActionType.BEGIN]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      postDetail: {
        ...state.postDetail,
        pending: true,
        error: null,
      },
    };
  },
  [PostLoadDetailActionType.SUCCESS]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      postDetail: {
        ...state.postDetail,
        pending: false,
        data: { ...action.payload, likePending: false },
      },
    };
  },
  [PostLoadDetailActionType.FAILURE]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      postDetail: {
        ...state.postDetail,
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
      myPosts: fillCursorResponseData(state.myPosts, action),
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

  // others posts
  [PostLoadOthersPostsActionType.BEGIN]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      othersPosts: {
        ...state.othersPosts,
        initializing: action.payload.cursor == null,
        pending: true,
        error: null,
      },
    };
  },
  [PostLoadOthersPostsActionType.SUCCESS]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      othersPosts: {
        ...fillCursorResponseData(state.othersPosts, action),
        userId: action.extra.userId,
      },
    };
  },
  [PostLoadOthersPostsActionType.FAILURE]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      othersPosts: {
        ...state.othersPosts,
        pending: false,
        initializing: false,
        error: action.error,
      },
    };
  },

  // recommend posts
  [LoadRecommendPostsActionType.BEGIN]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      recommendPosts: {
        ...state.recommendPosts,
        initializing: action.payload.cursor == null,
        pending: true,
        error: null,
      },
    };
  },
  [LoadRecommendPostsActionType.SUCCESS]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      recommendPosts: fillCursorResponseData(state.recommendPosts, action),
    };
  },
  [LoadRecommendPostsActionType.FAILURE]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      recommendPosts: {
        ...state.recommendPosts,
        pending: false,
        initializing: false,
        error: action.error,
      },
    };
  },

  // followed posts
  [LoadFollowedPostsActionType.BEGIN]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      followedPosts: {
        ...state.followedPosts,
        initializing: action.payload.cursor == null,
        pending: true,
        error: null,
      },
    };
  },
  [LoadFollowedPostsActionType.SUCCESS]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      followedPosts: fillCursorResponseData(state.followedPosts, action),
    };
  },
  [LoadFollowedPostsActionType.FAILURE]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      followedPosts: {
        ...state.followedPosts,
        pending: false,
        initializing: false,
        error: action.error,
      },
    };
  },

  // create post
  [PostCreatePostActionType.BEGIN]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      createPost: {
        ...state.createPost,
        pending: true,
        error: null,
      },
    };
  },
  [PostCreatePostActionType.SUCCESS]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    const mDetail = state.myDetail.data;
    const mPosts = state.myPosts.data;
    return {
      ...state,
      createPost: {
        ...state.createPost,
        pending: false,
        data: action.payload,
      },
      myDetail: {
        ...state.myDetail,
        data: mDetail
          ? { ...mDetail, postCount: mDetail.postCount + 1 }
          : mDetail,
      },
      myPosts: {
        ...state.myPosts,
        data: mPosts ? [action.payload, ...mPosts] : mPosts,
      },
    };
  },
  [PostCreatePostActionType.FAILURE]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      createPost: {
        ...state.createPost,
        pending: false,
        error: action.error,
      },
    };
  },

  // remove post
  [PostRemovePostActionType.BEGIN]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      createPost: {
        ...state.createPost,
        pending: true,
        error: null,
      },
    };
  },
  [PostRemovePostActionType.SUCCESS]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    const mDetail = state.myDetail.data;
    const mPosts = state.myPosts.data;
    const removedId = action.extra.postId;
    return {
      ...state,
      createPost: {
        ...state.createPost,
        pending: false,
        data: action.payload,
      },
      myDetail: {
        ...state.myDetail,
        data: mDetail
          ? { ...mDetail, postCount: mDetail.postCount - 1 }
          : mDetail,
      },
      myPosts: {
        ...state.myPosts,
        data: mPosts ? mPosts.filter((item) => item.id != removedId) : mPosts,
      },
    };
  },
  [PostRemovePostActionType.FAILURE]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      createPost: {
        ...state.createPost,
        pending: false,
        error: action.error,
      },
    };
  },
};
