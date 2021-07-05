import { createReducer, ActionBase } from '../../shared';
import { CommunityState } from './types';
import { postReducer } from './postHooks';
import { petReducer } from './petHooks';
import { postTopicReducer } from './topicHooks';
import { searchReducer } from './searchHooks';
import { postLikeReducer } from './postLikeHooks';
import { postCollectReducer } from './collectHooks';
import { userFollowReducer } from './followHooks';
import { postCommentReducer } from './postCommentHooks';
import { questionReducer } from './questionHooks';
import { answerReducer } from './answerHooks';
import { questionVoteReducer } from './questionVoteHooks';

const initialStat: CommunityState = {
  // user
  myDetail: { data: null, pending: false, error: null },
  othersDetail: { data: null, pending: false, error: null },
  mypets: { data: [], pending: false, error: null },
  myPosts: {
    data: [],
    pending: false,
    error: null,
    hasMore: false,
    nextCursor: null,
    initializing: false,
  },
  othersPosts: {
    userId: null,
    data: [],
    pending: false,
    error: null,
    hasMore: false,
    nextCursor: null,
    initializing: false,
  },

  // post
  followedPosts: {
    data: [],
    pending: false,
    error: null,
    hasMore: false,
    nextCursor: null,
    initializing: false,
  },
  recommendPosts: {
    data: [],
    pending: false,
    error: null,
    hasMore: false,
    nextCursor: null,
    initializing: false,
  },
  postDetail: { data: null, pending: false, error: null },
  postComments: {
    postId: null,
    data: [],
    pending: false,
    error: null,
    hasMore: false,
    nextCursor: null,
    initializing: false,
  },
  searchPosts: {
    keyword: null,
    data: [],
    pending: false,
    error: null,
    hasMore: false,
    nextCursor: null,
    initializing: false,
  },

  createPost: { data: null, pending: false, error: null },
  removePost: { data: null, pending: false, error: null },
  createPostComment: { data: null, pending: false, error: null },
  removePostComment: { data: null, pending: false, error: null },
  createPostReply: { data: null, pending: false, error: null },
  removePostReply: { data: null, pending: false, error: null },
  postTopics: { data: [], pending: false, error: null },

  // question
  unansweredQuestions: {
    data: [],
    pending: false,
    error: null,
    hasMore: false,
    nextCursor: null,
    initializing: false,
  },
  recommendQuestions: {
    data: [],
    pending: false,
    error: null,
    hasMore: false,
    nextCursor: null,
    initializing: false,
  },

  questionDetail: { data: null, pending: false, error: null },
  questionAnswers: {
    questionId: null,
    data: [],
    pending: false,
    error: null,
    hasMore: false,
    nextCursor: null,
    initializing: false,
  },
  answerDetail: {
    data: null,
    pending: false,
    error: null,
  },
  answerComments: {
    answerId: null,
    data: [],
    pending: false,
    error: null,
    hasMore: false,
    nextCursor: null,
    initializing: false,
  },

  createQuestion: {
    data: null,
    pending: false,
    error: null,
  },
  createAnswer: {
    data: null,
    pending: false,
    error: null,
  },
  createAnswerComment: {
    data: null,
    pending: false,
    error: null,
  },
};

export const communityRootReducer = createReducer<CommunityState, ActionBase>(
  initialStat,
  {
    ...postReducer,
    ...petReducer,
    ...postTopicReducer,
    ...searchReducer,
    ...postLikeReducer,
    ...postCollectReducer,
    ...userFollowReducer,
    ...postCommentReducer,
    ...questionReducer,
    ...answerReducer,
    ...questionVoteReducer,
  },
);
