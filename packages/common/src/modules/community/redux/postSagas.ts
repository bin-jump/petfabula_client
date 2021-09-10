import { all, fork } from 'redux-saga/effects';
import { createSagaWatcher } from '../../shared';
import {
  PostLoadDetailActionType,
  CommunityFollowUserActionType,
  CommunityUnfollowUserActionType,
  LoadPetPostsActionType,
  LoadMyProfileActionType,
  LoadMyAnswersActionType,
  LoadMyPostsActionType,
  LoadMyFavoritePostsActionType,
  LoadMyQuestionsActionType,
  LoadUserProfileActionType,
  LoadUserPostsActionType,
  LoadUserQuestionsActionType,
  LoadUserAnswersActionType,
  LoadUserCollectedPostsActionType,
  // post
  LoadRecommendPostsActionType,
  LoadFollowedPostsActionType,
  PostCreatePostActionType,
  PostUpdatePostActionType,
  PostRemovePostActionType,
  PostLikeActionType,
  PostUnlikeActionType,
  PostCollectActionType,
  PostRemoveCollectActionType,
  PostLoadPostCommentsActionType,
  PostCreatePostCommentActionType,
  PostRemovePostCommentActionType,
  PostLoadCommentReplyActionType,
  PostCreateCommentReplyActionType,
  PostRemoveCommentReplyActionType,
  PostLoadTopicActionType,
  PostSearchActionType,
  PostLoadPetPostImagesActionType,
  LoadTopicPostsActionType,
} from './actionTypes';

// user

const watchLoadMyProfile = createSagaWatcher({
  url: `/api/participator/profile`,
  method: 'GET',
  asyncAction: LoadMyProfileActionType,
  watchType: 'LATEST',
});

const watchLoadMyPosts = createSagaWatcher({
  method: 'GET',
  asyncAction: LoadMyPostsActionType,
  watchType: 'LATEST',
  createUrl: (payload) => {
    return `/api/participator/my-posts`;
  },
});

const watchLoadMyQuestions = createSagaWatcher({
  method: 'GET',
  asyncAction: LoadMyQuestionsActionType,
  watchType: 'LATEST',
  createUrl: (payload) => {
    return `/api/participator/my-questions`;
  },
});

const watchLoadMyAnswers = createSagaWatcher({
  method: 'GET',
  asyncAction: LoadMyAnswersActionType,
  watchType: 'LATEST',
  createUrl: (payload) => {
    return `/api/participator/my-answers`;
  },
});

const watchLoadMyFavoritePosts = createSagaWatcher({
  method: 'GET',
  asyncAction: LoadMyFavoritePostsActionType,
  watchType: 'LATEST',
  createUrl: (payload) => {
    return `/api/participator/my-favorite-posts`;
  },
});

const watchLoadUserProfile = createSagaWatcher({
  method: 'GET',
  asyncAction: LoadUserProfileActionType,
  watchType: 'LATEST',
  createUrl: (payload) => {
    return `/api/participator/${payload.userId}/profile`;
  },
});

const watchLoadUserPosts = createSagaWatcher({
  method: 'GET',
  asyncAction: LoadUserPostsActionType,
  watchType: 'LATEST',
  createUrl: (payload) => {
    return `/api/participator/${payload.userId}/posts`;
  },
});

const watchLoadUserQuestions = createSagaWatcher({
  method: 'GET',
  asyncAction: LoadUserQuestionsActionType,
  watchType: 'LATEST',
  createUrl: (payload) => {
    return `/api/participator/${payload.userId}/questions`;
  },
});

const watchLoadUserAnswers = createSagaWatcher({
  method: 'GET',
  asyncAction: LoadUserAnswersActionType,
  watchType: 'LATEST',
  createUrl: (payload) => {
    return `/api/participator/${payload.userId}/answers`;
  },
});

const watchLoadUserCollectedPosts = createSagaWatcher({
  method: 'GET',
  asyncAction: LoadUserCollectedPostsActionType,
  watchType: 'LATEST',
  createUrl: (payload) => {
    return `/api/participator/${payload.userId}/favorite-posts`;
  },
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
  createUrl: (payload) => {
    let url = `/api/search/post?q=${payload.keyword}`;
    return url;
  },
});

const watchLoadRecommendPosts = createSagaWatcher({
  url: `/api/recommend/posts`,
  method: 'GET',
  asyncAction: LoadRecommendPostsActionType,
  watchType: 'LATEST',
});

const watchLoadPetPosts = createSagaWatcher({
  createUrl: (payload) => {
    return `/api/participator/pets/${payload.petId}/posts`;
  },
  method: 'GET',
  asyncAction: LoadPetPostsActionType,
  watchType: 'LATEST',
});

const watchLoadPetPostImages = createSagaWatcher({
  createUrl: (payload) => {
    return `/api/participator/pets/${payload.petId}/images`;
  },
  method: 'GET',
  asyncAction: PostLoadPetPostImagesActionType,
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

const watchUpdatePost = createSagaWatcher({
  url: `/api/post/posts`,
  method: 'PUT',
  asyncAction: PostUpdatePostActionType,
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
    return `/api/post/posts/${payload.postId}/favorites`;
  },
});
const watchRemoveCollectPost = createSagaWatcher({
  method: 'DELETE',
  asyncAction: PostRemoveCollectActionType,
  watchType: 'LATEST',
  createUrl: (payload) => {
    return `/api/post/posts/${payload.postId}/favorites`;
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

const watchRemovePostComment = createSagaWatcher({
  method: 'DELETE',
  asyncAction: PostRemovePostCommentActionType,
  watchType: 'EVERY',
  createUrl: (payload) => {
    return `/api/post/comments/${payload.commentId}`;
  },
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

const watchRemovePostCommentReply = createSagaWatcher({
  method: 'DELETE',
  asyncAction: PostRemoveCommentReplyActionType,
  watchType: 'EVERY',
  createUrl: (payload) => {
    return `/api/post/replies/${payload.replyId}`;
  },
});

// topic
const watchLoadTopics = createSagaWatcher({
  url: `/api/post/topics`,
  method: 'GET',
  asyncAction: PostLoadTopicActionType,
  watchType: 'LATEST',
});

const watchLoadTopicPosts = createSagaWatcher({
  createUrl: (payload) => {
    return `/api/post/topic/${payload.topicId}/posts`;
  },
  method: 'GET',
  asyncAction: LoadTopicPostsActionType,
  watchType: 'LATEST',
});

export function* postRootSaga() {
  yield all([
    fork(watchLoadPetPosts),
    fork(watchLoadPetPostImages),
    fork(watchFollowParticipator),
    fork(watchUnfollowParticipator),
    fork(watchLoadMyProfile),
    fork(watchLoadMyPosts),
    fork(watchLoadMyQuestions),
    fork(watchLoadMyAnswers),
    fork(watchLoadMyFavoritePosts),

    fork(watchLoadUserProfile),
    fork(watchLoadUserPosts),
    fork(watchLoadUserQuestions),
    fork(watchLoadUserAnswers),
    fork(watchLoadUserCollectedPosts),

    fork(watchGetPostDetail),
    fork(watchLoadRecommendPosts),
    fork(watchLoadFollowedPosts),
    fork(watchCreatePost),
    fork(watchUpdatePost),
    fork(watchRemovePost),
    fork(watchLikePost),
    fork(watchUnlikePost),
    fork(watchCollectPost),
    fork(watchRemoveCollectPost),
    fork(watchLoadPostComments),
    fork(watchCreatePostComments),
    fork(watchLoadPostCommentReplies),
    fork(watchCreatePostCommentReply),
    fork(watchRemovePostComment),
    fork(watchRemovePostCommentReply),

    fork(watchSearchPost),

    fork(watchLoadTopics),
    fork(watchLoadTopicPosts),
  ]);
}
