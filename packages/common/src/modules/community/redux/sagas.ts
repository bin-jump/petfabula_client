import { all, fork } from 'redux-saga/effects';
import { createSagaWatcher } from '../../shared';
import {
  PostLoadDetailActionType,
  LoadMyPostsActionType,
  PostLoadOthersPostsActionType,
  LoadRecommendPostsActionType,
  LoadFollowedPostsActionType,
  PostCreatePostActionType,
  PostRemovePostActionType,
} from './actionTypes';

const watchGetPostDetail = createSagaWatcher({
  method: 'GET',
  asyncAction: PostLoadDetailActionType,
  watchType: 'LATEST',
  createUrl: (payload) => {
    return `/api/post/posts/${payload.postId}`;
  },
});

const watchLoadMyPosts = createSagaWatcher({
  url: `/api/post/posts`,
  method: 'GET',
  asyncAction: LoadMyPostsActionType,
  watchType: 'LATEST',
});

const watchLoadOthersPosts = createSagaWatcher({
  method: 'GET',
  asyncAction: PostLoadOthersPostsActionType,
  watchType: 'LATEST',
  createUrl: (payload) => {
    return `/api/post/user/${payload.userId}/posts`;
  },
});

const watchLoadRecommendPosts = createSagaWatcher({
  url: `/api/post/recommends`,
  method: 'GET',
  asyncAction: LoadRecommendPostsActionType,
  watchType: 'LATEST',
});

const watchLoadFollowedPosts = createSagaWatcher({
  url: `/api/post/followed`,
  method: 'GET',
  asyncAction: LoadFollowedPostsActionType,
  watchType: 'LATEST',
});

const watchCreatePost = createSagaWatcher({
  url: `/api/post/posts`,
  method: 'POST',
  asyncAction: PostCreatePostActionType,
  watchType: 'EVERY',
});

const watchRemovePost = createSagaWatcher({
  method: 'DELETE',
  asyncAction: PostRemovePostActionType,
  watchType: 'EVERY',
  createUrl: (payload) => {
    return `/api/post/posts/${payload.postId}`;
  },
});

export function* communityRootSaga() {
  yield all([
    fork(watchGetPostDetail),
    fork(watchLoadMyPosts),
    fork(watchLoadOthersPosts),
    fork(watchLoadRecommendPosts),
    fork(watchLoadFollowedPosts),
    fork(watchCreatePost),
    fork(watchRemovePost),
  ]);
}
