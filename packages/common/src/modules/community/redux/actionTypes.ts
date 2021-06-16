import { createAsyncActionType } from '../../shared';

export const CommunityFollowUserActionType = createAsyncActionType(
  'COMMUNITY_FOLLOW_USER',
);
export const CommunityUnfollowUserActionType = createAsyncActionType(
  'COMMUNITY_UNFOLLOW_USER',
);

export const CommunityLoadMyPetsActionType = createAsyncActionType(
  'COMMUNITY_LOAD_MY_PETS',
);

export const LoadMyPostsActionType =
  createAsyncActionType('POST_LOAD_MY_POSTS');
export const PostLoadOthersPostsActionType = createAsyncActionType(
  'POST_LOAD_OTHER_POSTS',
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

export const PostLoadTopicActionType = createAsyncActionType(
  'POST_LOAD_POST_TOPIC',
);
