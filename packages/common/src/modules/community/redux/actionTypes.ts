import { createAsyncActionType } from '../../shared';

export const CommunityFollowUserActionType = createAsyncActionType(
  'COMMUNITY_FOLLOW_USER',
);
export const CommunityUnfollowUserActionType = createAsyncActionType(
  'COMMUNITY_UNFOLLOW_USER',
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

// question
export const LoadRecommendQuestionsActionType = createAsyncActionType(
  'QUESTION_LOAD_RECOMMEND_QUESTIONS',
);
export const LoadUnansweredQuestionsActionType = createAsyncActionType(
  'QUESTION_LOAD_UNANSWERED_QUESTIONS',
);
export const QuestionLoadQuestionDetailActionType = createAsyncActionType(
  'QUESTION_LOAD_QUESTION_DETAIL',
);
export const QuestionCreateActionType = createAsyncActionType(
  'QUESTION_CREATE_QUESTIONS',
);

export const QuestionLoadQuestionAnswersActionType = createAsyncActionType(
  'QUESTION_LOAD_QUESTION_ANSWERS',
);

export const QuestionCreateAnswersActionType = createAsyncActionType(
  'QUESTION_CREATE_ANSWERS',
);

export const QuestionCreateAnswerCommentActionType = createAsyncActionType(
  'QUESTION_CREATE_ANSWER_COMMENT',
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
