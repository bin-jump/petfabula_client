import { createAsyncActionType } from '../../shared';

export const CommunityFollowUserActionType = createAsyncActionType(
  'COMMUNITY_FOLLOW_USER',
);
export const CommunityUnfollowUserActionType = createAsyncActionType(
  'COMMUNITY_UNFOLLOW_USER',
);

export const CommunityBlockUserActionType = createAsyncActionType(
  'COMMUNITY_BLOCK_USER',
);
export const CommunityUnblockUserActionType = createAsyncActionType(
  'COMMUNITY_UNBLOCK_USER',
);

export const CommunityLoadUserPetsActionType = createAsyncActionType(
  'COMMUNITY_LOAD_USER_PETS',
);

export const LoadMyProfileActionType = createAsyncActionType(
  'COMMUNITY_LOAD_MY_PROFILE',
);
export const LoadUserProfileActionType = createAsyncActionType(
  'COMMUNITY_LOAD_USER_PROFILE',
);
export const LoadPetPostsActionType = createAsyncActionType(
  'POST_LOAD_PET_POSTS',
);
export const LoadUserPostsActionType = createAsyncActionType(
  'POST_LOAD_USER_POSTS',
);
export const LoadUserQuestionsActionType = createAsyncActionType(
  'POST_LOAD_USER_QUESTIONS',
);
export const LoadUserAnswersActionType = createAsyncActionType(
  'QUESTION_LOAD_USER_ANSWERS',
);
export const LoadUserCollectedPostsActionType = createAsyncActionType(
  'POST_LOAD_USER_COLLECTION_POSTS',
);

export const LoadUserFollowedActionType = createAsyncActionType(
  'POST_LOAD_USER_FOLLOWED',
);
export const LoadUserFollowerActionType = createAsyncActionType(
  'POST_LOAD_USER_FOLLOWER',
);
export const LoadMyFollowedActionType = createAsyncActionType(
  'POST_LOAD_MY_FOLLOWED',
);
export const LoadNyFollowerActionType = createAsyncActionType(
  'POST_LOAD_MY_FOLLOWER',
);

export const LoadTopicPostsActionType = createAsyncActionType(
  'POST_LOAD_TOPIC_POSTS',
);

// my things
export const LoadMyPostsActionType =
  createAsyncActionType('POST_LOAD_MY_POSTS');
export const LoadMyQuestionsActionType = createAsyncActionType(
  'POST_LOAD_MY_QUESTIONS',
);
export const LoadMyAnswersActionType = createAsyncActionType(
  'QUESTION_LOAD_MY_ANSWERS',
);
export const LoadMyFavoritePostsActionType = createAsyncActionType(
  'POST_LOAD_MY_FAVORITE_POSTS',
);
export const LoadMyBlockedsActionType = createAsyncActionType(
  'POST_LOAD_MY_BLOCKEDS',
);

// post
export const LoadRecommendPostsActionType = createAsyncActionType(
  'POST_LOAD_RECOMMEND_POSTS',
);
export const LoadFollowedPostsActionType = createAsyncActionType(
  'POST_LOAD_FOLLOWED_POSTS',
);
export const PostLoadDetailActionType = createAsyncActionType(
  'POST_LOAD_POST_DETAIL',
);
export const PostCreatePostActionType =
  createAsyncActionType('POST_CREATE_POST');

export const PostRemovePostActionType =
  createAsyncActionType('POST_REMOVE_POST');

export const PostUpdatePostActionType =
  createAsyncActionType('POST_UPDATE_POST');

export const PostLoadPostCommentsActionType = createAsyncActionType(
  'POST_LOAD_POST_COMMENTS',
);
export const PostCreatePostCommentActionType = createAsyncActionType(
  'POST_CREATE_POST_COMMENT',
);
export const PostRemovePostCommentActionType = createAsyncActionType(
  'POST_REMOVE_POST_COMMENT',
);

export const PostLoadCommentReplyActionType = createAsyncActionType(
  'POST_LOAD_POST_COMMENT_REPLY',
);

export const PostCreateCommentReplyActionType = createAsyncActionType(
  'POST_CREATE_COMMENT_REPLY',
);

export const PostRemoveCommentReplyActionType = createAsyncActionType(
  'POST_REMOVE_COMMENT_REPLY',
);

export const PostLikeActionType = createAsyncActionType('POST_LIKE_POST');

export const PostUnlikeActionType = createAsyncActionType('POST_UNLIKE_POST');

export const PostCollectActionType = createAsyncActionType('POST_COLLECT_POST');

export const PostRemoveCollectActionType = createAsyncActionType(
  'POST_REMOVE_COLLECT_POST',
);

export const PostLoadTopicActionType = createAsyncActionType(
  'POST_LOAD_POST_TOPIC',
);

export const PostSearchActionType = createAsyncActionType('POST_SEARCH');

export const PostLoadPetPostImagesActionType = createAsyncActionType(
  'POST_LOAD_PET_POST_IMAGES',
);

// question
export const LoadRecommendQuestionsActionType = createAsyncActionType(
  'QUESTION_LOAD_RECOMMEND_QUESTIONS',
);
export const LoadRecentQuestionsActionType = createAsyncActionType(
  'QUESTION_LOAD_RECENT_QUESTIONS',
);
export const QuestionLoadQuestionDetailActionType = createAsyncActionType(
  'QUESTION_LOAD_QUESTION_DETAIL',
);
export const QuestionCreateActionType = createAsyncActionType(
  'QUESTION_CREATE_QUESTIONS',
);

export const QuestionUpdateQuestionActionType = createAsyncActionType(
  'QUESTION_UPDATE_QUESTION',
);

export const QuestionRemoveQuestionActionType = createAsyncActionType(
  'QUESTION_REMOVE_QUESTION',
);

export const QuestionLoadQuestionAnswersActionType = createAsyncActionType(
  'QUESTION_LOAD_QUESTION_ANSWERS',
);

export const QuestionCreateAnswersActionType = createAsyncActionType(
  'QUESTION_CREATE_ANSWERS',
);

export const QuestionUpdateAnswerActionType = createAsyncActionType(
  'QUESTION_UPDATE_ANSWER',
);

export const QuestionRemoveAnswerActionType = createAsyncActionType(
  'QUESTION_REMOVE_ANSWER',
);

export const QuestionCreateAnswerCommentActionType = createAsyncActionType(
  'QUESTION_CREATE_ANSWER_COMMENT',
);

export const QuestionRemoveAnswerCommentActionType = createAsyncActionType(
  'QUESTION_REMOVE_ANSWER_COMMENT',
);

export const QuestionLoadAnswerCommentActionType = createAsyncActionType(
  'QUESTION_LOAD_ANSWER_COMMENT',
);

export const QuestionUpvoteQuestionActionType = createAsyncActionType(
  'QUESTION_UPVOTE_QUESTION',
);

export const QuestionUnvoteQuestionActionType = createAsyncActionType(
  'QUESTION_UNVOTE_QUESTION',
);

export const QuestionUpvoteAnswerActionType = createAsyncActionType(
  'QUESTION_UPVOTE_ANSWER',
);

export const QuestionUnvoteAnswerActionType = createAsyncActionType(
  'QUESTION_UNVOTE_ANSWER',
);

export const QuestionAnswerSearchActionType = createAsyncActionType(
  'QUESTION_ANSWER_SEARCH',
);
