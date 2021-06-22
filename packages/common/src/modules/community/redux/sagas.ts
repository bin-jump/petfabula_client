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
  PostLoadTopicActionType,
  CommunityLoadMyPetsActionType,
  PostSearchActionType,
} from './actionTypes';

// user

const watchLoadMyPosts = createSagaWatcher({
  url: `/api/post/posts`,
  method: 'GET',
  asyncAction: LoadMyPostsActionType,
  watchType: 'LATEST',
});

const watchLoadMyPets = createSagaWatcher({
  url: `/api/participator/pets`,
  method: 'GET',
  asyncAction: CommunityLoadMyPetsActionType,
  watchType: 'LATEST',
});

// posts
const watchGetPostDetail = createSagaWatcher({
  method: 'GET',
  asyncAction: PostLoadDetailActionType,
  watchType: 'LATEST',
  createUrl: (payload) => {
    return `/api/post/posts/${payload.postId}`;
  },
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

const watchSearchPost = createSagaWatcher({
  method: 'GET',
  asyncAction: PostSearchActionType,
  watchType: 'LATEST',
  disableAutoCusor: true,
  createUrl: (payload) => {
    let url = `/api/post/search?q=${payload.keyword}`;
    if (payload.cursor) {
      url = `${payload}&cursor=${payload.cursor}`;
    }
    return url;
  },
});

const watchLoadTopics = createSagaWatcher({
  url: `/api/post/topics`,
  method: 'GET',
  asyncAction: PostLoadTopicActionType,
  watchType: 'LATEST',
});

export function* communityRootSaga() {
  yield all([
    fork(watchLoadMyPets),

    fork(watchGetPostDetail),
    fork(watchLoadMyPosts),
    fork(watchLoadOthersPosts),
    fork(watchLoadRecommendPosts),
    fork(watchLoadFollowedPosts),
    fork(watchCreatePost),
    fork(watchRemovePost),
    fork(watchSearchPost),

    fork(watchLoadTopics),
  ]);
}
