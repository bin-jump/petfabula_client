import { createReducer, ActionBase } from '../../shared';
import { CommunityState } from './types';
import { postReducer } from './postHooks';
import { petReducer } from './petHooks';
import { postTopicReducer } from './topicHooks';
import { searchReducer } from './searchHooks';

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
  comments: {
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
  createComment: { data: null, pending: false, error: null },
  removeComment: { data: null, pending: false, error: null },
  createReply: { data: null, pending: false, error: null },
  removeReply: { data: null, pending: false, error: null },
  postTopics: { data: [], pending: false, error: null },
};

export const communityRootReducer = createReducer<CommunityState, ActionBase>(
  initialStat,
  { ...postReducer, ...petReducer, ...postTopicReducer, ...searchReducer },
);
