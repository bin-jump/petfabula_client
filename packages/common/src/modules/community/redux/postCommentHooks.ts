import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { AppState } from '../../../stateProvider';
import {
  CommunityState,
  PostCommentForm,
  PostComment,
  PostCommentReplyForm,
  PostCommentReply,
} from './types';
import {
  PostLoadPostCommentsActionType,
  PostCreatePostCommentActionType,
  PostCreateCommentReplyActionType,
  PostLoadCommentReplyActionType,
  PostRemovePostCommentActionType,
  PostRemoveCommentReplyActionType,
} from './actionTypes';
import { ActionBase, fillCursorResponseData } from '../../shared';

export const useLoadPostComment = () => {
  const dispatch = useDispatch();
  const {
    postId,
    comments,
    initializing,
    hasMore,
    nextCursor,
    pending,
    error,
  } = useSelector(
    (state: AppState) => ({
      postId: state.community.postComments.postId,
      comments: state.community.postComments.data,
      hasMore: state.community.postComments.hasMore,
      nextCursor: state.community.postComments.nextCursor,
      pending: state.community.postComments.pending,
      initializing: state.community.postComments.initializing,
      error: state.community.postComments.error,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(
    (postId: number, cursor: object | null) => {
      dispatch({
        type: PostLoadPostCommentsActionType.BEGIN,
        payload: { postId, cursor },
      });
    },
    [dispatch],
  );

  return {
    loadComment: boundAction,
    postId,
    comments,
    hasMore,
    nextCursor,
    initializing,
    pending,
    error,
  };
};

export const useLoadPostCommentReply = () => {
  const dispatch = useDispatch();
  // const {
  // } = useSelector(
  //   (state: AppState) => ({
  //   }),
  //   shallowEqual,
  // );

  const boundAction = useCallback(
    (commentId: number, cursor: object | null) => {
      dispatch({
        type: PostLoadCommentReplyActionType.BEGIN,
        payload: { commentId, cursor },
      });
    },
    [dispatch],
  );

  return {
    loadCommentReply: boundAction,
  };
};

export const useCreatePostComment = () => {
  const dispatch = useDispatch();
  const { result, pending, error } = useSelector(
    (state: AppState) => ({
      result: state.community.createPostComment.data,
      pending: state.community.createPostComment.pending,
      error: state.community.createPostComment.error,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(
    (data: PostCommentForm) => {
      dispatch({
        type: PostCreatePostCommentActionType.BEGIN,
        payload: data,
      });
    },
    [dispatch],
  );

  return {
    createComment: boundAction,
    result,
    pending,
    error,
  };
};

export const useRemovePostComment = () => {
  const dispatch = useDispatch();
  const { result, pending, error } = useSelector(
    (state: AppState) => ({
      result: state.community.removePostComment.data,
      pending: state.community.removePostComment.pending,
      error: state.community.removePostComment.error,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(
    (commentId: number) => {
      dispatch({
        type: PostRemovePostCommentActionType.BEGIN,
        payload: { commentId },
      });
    },
    [dispatch],
  );

  return {
    removeComment: boundAction,
    result,
    pending,
    error,
  };
};

export const useCreatePostCommentReply = () => {
  const dispatch = useDispatch();
  const { result, pending, error } = useSelector(
    (state: AppState) => ({
      result: state.community.createPostReply.data,
      pending: state.community.createPostReply.pending,
      error: state.community.createPostReply.error,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(
    (data: PostCommentReplyForm) => {
      dispatch({
        type: PostCreateCommentReplyActionType.BEGIN,
        payload: data,
      });
    },
    [dispatch],
  );

  return {
    createCommentReply: boundAction,
    result,
    pending,
    error,
  };
};

export const useRemovePostCommentReply = () => {
  const dispatch = useDispatch();
  const { result, pending, error } = useSelector(
    (state: AppState) => ({
      result: state.community.removePostReply.data,
      pending: state.community.removePostReply.pending,
      error: state.community.removePostReply.error,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(
    (replyId: number) => {
      dispatch({
        type: PostRemoveCommentReplyActionType.BEGIN,
        payload: { replyId },
      });
    },
    [dispatch],
  );

  return {
    removeCommentReply: boundAction,
    result,
    pending,
    error,
  };
};

const formatComment = (serverComment: PostComment) => {
  return {
    ...serverComment,
    replies: [],
    loadReplyPending: false,
    nextCursor: null,
  };
};

const formatCommentList = (serverComments: Array<PostComment>) => {
  return serverComments.map((item) => formatComment(item));
};

const uniqueReply = (replies: PostCommentReply[]) => {
  const hist = new Set();
  const res: PostCommentReply[] = [];
  replies
    .slice()
    .reverse()
    .forEach((item) => {
      if (!hist.has(item.id)) {
        hist.add(item.id);
        res.push(item);
      }
    });
  return res.reverse();
};

export const postCommentReducer = {
  // load comments
  [PostLoadPostCommentsActionType.BEGIN]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      postComments: {
        ...state.postComments,
        initializing: action.payload.cursor == null,
        pending: true,
        error: null,
      },
    };
  },
  [PostLoadPostCommentsActionType.SUCCESS]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      postComments: {
        ...fillCursorResponseData(
          state.postComments,
          action,
          formatCommentList,
        ),
        postId: action.extra.postId,
      },
    };
  },
  [PostLoadPostCommentsActionType.FAILURE]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      postComments: {
        ...state.postComments,
        initializing: false,
        pending: true,
        error: action.error,
      },
    };
  },

  // create comment
  [PostCreatePostCommentActionType.BEGIN]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      createPostComment: {
        ...state.createPostComment,
        pending: true,
        error: null,
      },
    };
  },
  [PostCreatePostCommentActionType.SUCCESS]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    const postDetail = state.postDetail.data;
    return {
      ...state,
      createPostComment: {
        ...state.createPostComment,
        data: action.payload,
        pending: false,
      },
      postComments:
        state.postComments.postId == action.payload.postId
          ? {
              ...state.postComments,
              data: [formatComment(action.payload), ...state.postComments.data],
            }
          : state.postComments,
      postDetail: {
        ...state.postDetail,
        data:
          postDetail && postDetail.id == action.payload.postId
            ? {
                ...postDetail,
                commentCount: postDetail.commentCount + 1,
              }
            : postDetail,
      },
    };
  },
  [PostCreatePostCommentActionType.FAILURE]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      createPostComment: {
        ...state.createPostComment,
        pending: false,
        error: action.error,
      },
    };
  },

  // load comment reply
  [PostLoadCommentReplyActionType.BEGIN]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    const comments = state.postComments.data;
    const actionCommentId = action.payload.commentId;
    return {
      ...state,
      postComments: {
        ...state.postComments,
        data: comments.map((item) => {
          if (item.id == actionCommentId) {
            return { ...item, loadingReply: true };
          }
          return item;
        }),
      },
    };
  },
  [PostLoadCommentReplyActionType.SUCCESS]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    const comments = state.postComments.data;
    const actionCommentId = action.extra.commentId;
    return {
      ...state,
      postComments: {
        ...state.postComments,
        data: comments.map((item) => {
          if (item.id == actionCommentId) {
            return {
              ...item,
              loadingReply: false,
              replies: uniqueReply([...item.replies, ...action.payload.result]),
              replyCursor: action.payload.nextCursor,
            };
          }
          return item;
        }),
      },
    };
  },
  [PostLoadCommentReplyActionType.FAILURE]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    const comments = state.postComments.data;
    const actionCommentId = action.extra.commentId;
    return {
      ...state,
      postComments: {
        ...state.postComments,
        data: comments.map((item) => {
          if (item.id == actionCommentId) {
            return { ...item, loadingReply: false };
          }
          return item;
        }),
      },
    };
  },

  // create comment reply
  [PostCreateCommentReplyActionType.BEGIN]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      createPostReply: {
        ...state.createPostReply,
        pending: true,
        error: null,
      },
    };
  },
  [PostCreateCommentReplyActionType.SUCCESS]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    const postDetail = state.postDetail.data;
    const comments = state.postComments.data;
    const actionCommentId = action.payload.commentId;
    return {
      ...state,
      createPostReply: {
        ...state.createPostReply,
        pending: false,
        data: action.payload,
      },
      postComments: {
        ...state.postComments,
        data: comments.map((item) => {
          if (item.id == actionCommentId) {
            return {
              ...item,
              replyCount: item.replyCount + 1,
              replies: [action.payload, ...item.replies],
            };
          }
          return item;
        }),
      },

      postDetail: {
        ...state.postDetail,
        data:
          postDetail && postDetail.id == action.payload.postId
            ? {
                ...postDetail,
                commentCount: postDetail.commentCount + 1,
              }
            : postDetail,
      },
    };
  },
  [PostCreateCommentReplyActionType.FAILURE]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      createPostReply: {
        ...state.createPostReply,
        pending: false,
        error: action.error,
      },
    };
  },

  // remove comment
  [PostRemovePostCommentActionType.BEGIN]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      removePostComment: {
        ...state.removePostComment,
        pending: true,
        error: null,
      },
    };
  },
  [PostRemovePostCommentActionType.SUCCESS]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    const postDetail = state.postDetail.data;
    const comments = state.postComments.data;
    const commentId = action.payload.id;
    const replyCount: number = action.payload.replyCount | 0;
    return {
      ...state,
      removePostComment: {
        ...state.removePostComment,
        pending: false,
        data: action.payload,
      },
      postComments: {
        ...state.postComments,
        data: comments.filter((item) => item.id != commentId),
      },
      postDetail: {
        ...state.postDetail,
        data:
          postDetail && postDetail.id == action.payload.postId
            ? {
                ...postDetail,
                commentCount: Math.max(
                  postDetail.commentCount - 1 - replyCount,
                  0,
                ),
              }
            : postDetail,
      },
    };
  },
  [PostRemovePostCommentActionType.FAILURE]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      removePostComment: {
        ...state.removePostComment,
        pending: false,
        error: action.error,
      },
    };
  },

  // remove comment reply
  [PostRemoveCommentReplyActionType.BEGIN]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      removePostReply: {
        ...state.removePostReply,
        pending: true,
        error: null,
      },
    };
  },
  [PostRemoveCommentReplyActionType.SUCCESS]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    const postDetail = state.postDetail.data;
    const comments = state.postComments.data;
    const replyId = action.payload.id;
    return {
      ...state,
      removePostReply: {
        ...state.removePostReply,
        pending: false,
        data: action.payload,
      },
      postComments: {
        ...state.postComments,
        data: comments.map((item) => {
          const replies = item.replies.filter((r) => r.id != replyId);
          return {
            ...item,
            replyCount: item.replyCount - 1,
            replies: replies,
          };
        }),
      },
      postDetail: {
        ...state.postDetail,
        data:
          postDetail && postDetail.id == action.payload.postId
            ? {
                ...postDetail,
                commentCount: Math.max(postDetail.commentCount - 1, 0),
              }
            : postDetail,
      },
    };
  },
  [PostRemoveCommentReplyActionType.FAILURE]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      removePostReply: {
        ...state.removePostReply,
        pending: false,
        error: action.error,
      },
    };
  },
};
