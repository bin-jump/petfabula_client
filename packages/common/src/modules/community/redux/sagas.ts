import { all, fork } from 'redux-saga/effects';
import { createSagaWatcher } from '../../shared';
import {
  PostLoadDetailActionType,
  CommunityFollowUserActionType,
  CommunityUnfollowUserActionType,
  LoadMyPostsActionType,
  PostLoadOthersPostsActionType,
  LoadRecommendPostsActionType,
  LoadFollowedPostsActionType,
  PostCreatePostActionType,
  PostRemovePostActionType,
  PostLikeActionType,
  PostUnlikeActionType,
  PostCollectActionType,
  PostRemoveCollectActionType,
  PostLoadPostCommentsActionType,
  PostCreatePostCommentActionType,
  PostLoadCommentReplyActionType,
  PostCreateCommentReplyActionType,
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

const watchFollowParticipator = createSagaWatcher({
  method: 'POST',
  asyncAction: CommunityFollowUserActionType,
  watchType: 'EVERY',
  createUrl: (payload) => {
    return `/api/post/participator/${payload.participatorId}/follow`;
  },
});

const watchUnfollowParticipator = createSagaWatcher({
  method: 'DELETE',
  asyncAction: CommunityUnfollowUserActionType,
  watchType: 'EVERY',
  createUrl: (payload) => {
    return `/api/post/participator/${payload.participatorId}/follow`;
  },
});

// posts
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

const watchLoadRecommendPosts = createSagaWatcher({
  url: `/api/post/recommends`,
  method: 'GET',
  asyncAction: LoadRecommendPostsActionType,
  watchType: 'LATEST',
});

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

const watchLikePost = createSagaWatcher({
  method: 'POST',
  asyncAction: PostLikeActionType,
  watchType: 'LATEST',
  createUrl: (payload) => {
    return `/api/post/posts/${payload.postId}/like`;
  },
});
const watchUnlikePost = createSagaWatcher({
  method: 'DELETE',
  asyncAction: PostUnlikeActionType,
  watchType: 'LATEST',
  createUrl: (payload) => {
    return `/api/post/posts/${payload.postId}/like`;
  },
});

const watchCollectPost = createSagaWatcher({
  method: 'POST',
  asyncAction: PostCollectActionType,
  watchType: 'LATEST',
  createUrl: (payload) => {
    return `/api/post/posts/${payload.postId}/collect`;
  },
});
const watchRemoveCollectPost = createSagaWatcher({
  method: 'DELETE',
  asyncAction: PostRemoveCollectActionType,
  watchType: 'LATEST',
  createUrl: (payload) => {
    return `/api/post/posts/${payload.postId}/collect`;
  },
});

const watchLoadPostComments = createSagaWatcher({
  method: 'GET',
  asyncAction: PostLoadPostCommentsActionType,
  watchType: 'LATEST',
  createUrl: (payload) => {
    return `/api/post/posts/${payload.postId}/comments`;
  },
});

const watchCreatePostComments = createSagaWatcher({
  url: `/api/post/comments`,
  method: 'POST',
  asyncAction: PostCreatePostCommentActionType,
  watchType: 'EVERY',
});

const watchLoadPostCommentReplies = createSagaWatcher({
  method: 'GET',
  asyncAction: PostLoadCommentReplyActionType,
  watchType: 'EVERY',
  createUrl: (payload) => {
    return `/api/post/comments/${payload.commentId}/replies`;
  },
});

const watchCreatePostCommentReply = createSagaWatcher({
  url: `/api/post/replies`,
  method: 'POST',
  asyncAction: PostCreateCommentReplyActionType,
  watchType: 'EVERY',
});

// topic
const watchLoadTopics = createSagaWatcher({
  url: `/api/post/topics`,
  method: 'GET',
  asyncAction: PostLoadTopicActionType,
  watchType: 'LATEST',
});

export function* communityRootSaga() {
  yield all([
    fork(watchLoadMyPets),
    fork(watchFollowParticipator),
    fork(watchUnfollowParticipator),

    fork(watchGetPostDetail),
    fork(watchLoadMyPosts),
    fork(watchLoadOthersPosts),
    fork(watchLoadRecommendPosts),
    fork(watchLoadFollowedPosts),
    fork(watchCreatePost),
    fork(watchRemovePost),
    fork(watchLikePost),
    fork(watchUnlikePost),
    fork(watchCollectPost),
    fork(watchRemoveCollectPost),
    fork(watchLoadPostComments),
    fork(watchCreatePostComments),
    fork(watchLoadPostCommentReplies),
    fork(watchCreatePostCommentReply),

    fork(watchSearchPost),

    fork(watchLoadTopics),
  ]);
}
