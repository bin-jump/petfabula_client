import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { AppState } from '../../../stateProvider';
import { Post, PostForm, CommunityState } from './types';
import {
  PostLoadDetailActionType,
  LoadRecommendPostsActionType,
  LoadFollowedPostsActionType,
  PostCreatePostActionType,
  PostRemovePostActionType,
  LoadPetPostsActionType,
  PostUpdatePostActionType,
} from './actionTypes';
import { ActionBase, UploadImage, fillCursorResponseData } from '../../shared';

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
    (cursor: object | null) => {
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
    (cursor: object | null) => {
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

export const useLoadPetPosts = () => {
  const dispatch = useDispatch();
  const { petId, posts, initializing, hasMore, nextCursor, pending, error } =
    useSelector(
      (state: AppState) => ({
        petId: state.community.petPosts.petId,
        posts: state.community.petPosts.data,
        hasMore: state.community.petPosts.hasMore,
        nextCursor: state.community.petPosts.nextCursor,
        pending: state.community.petPosts.pending,
        initializing: state.community.petPosts.initializing,
        error: state.community.petPosts.error,
      }),
      shallowEqual,
    );

  const boundAction = useCallback(
    (petId: number, cursor: object | null) => {
      dispatch({
        type: LoadPetPostsActionType.BEGIN,
        payload: { cursor, petId },
      });
    },
    [dispatch],
  );

  return {
    petId,
    loadPetPosts: boundAction,
    posts,
    hasMore,
    nextCursor,
    initializing,
    pending,
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

export const useUpdatePost = () => {
  const dispatch = useDispatch();
  const { result, pending, error } = useSelector(
    (state: AppState) => ({
      result: state.community.updatePost.data,
      pending: state.community.updatePost.pending,
      error: state.community.updatePost.error,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(
    (post: Post, images: Array<UploadImage>) => {
      const d = new FormData();
      d.append('post', JSON.stringify(post));
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
        type: PostUpdatePostActionType.BEGIN,
        payload: d,
      });
    },
    [dispatch],
  );

  return {
    updatePost: boundAction,
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

  // pet posts
  [LoadPetPostsActionType.BEGIN]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      petPosts: {
        ...state.petPosts,
        initializing: action.payload.cursor == null,
        pending: true,
        error: null,
      },
    };
  },
  [LoadPetPostsActionType.SUCCESS]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      petPosts: {
        ...fillCursorResponseData(state.petPosts, action),
        petId: action.extra.petId,
      },
    };
  },
  [LoadPetPostsActionType.FAILURE]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      petPosts: {
        ...state.petPosts,
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
    const mDetail = state.myProfile.data;
    return {
      ...state,
      createPost: {
        ...state.createPost,
        pending: false,
        data: action.payload,
      },
      myProfile: {
        ...state.myProfile,
        data: mDetail
          ? { ...mDetail, postCount: mDetail.postCount + 1 }
          : mDetail,
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

  // update post
  [PostUpdatePostActionType.BEGIN]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      updatePost: {
        ...state.updatePost,
        pending: true,
        error: null,
      },
    };
  },
  [PostUpdatePostActionType.SUCCESS]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    const postDetail = state.postDetail.data;
    return {
      ...state,
      updatePost: {
        ...state.updatePost,
        pending: false,
        data: action.payload,
      },
      postDetail: {
        ...state.postDetail,
        data:
          postDetail && postDetail.id == action.payload.id
            ? action.payload
            : postDetail,
      },
    };
  },
  [PostUpdatePostActionType.FAILURE]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      updatePost: {
        ...state.updatePost,
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
    const mDetail = state.myProfile.data;
    const mPosts = state.myProfile.data;
    const removedId = action.extra.postId;
    return {
      ...state,
      createPost: {
        ...state.createPost,
        pending: false,
        data: action.payload,
      },
      myProfile: {
        ...state.myProfile,
        data: mDetail
          ? { ...mDetail, postCount: mDetail.postCount - 1 }
          : mDetail,
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
