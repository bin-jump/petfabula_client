import { MiddlewareAPI, Dispatch, Middleware, AnyAction } from 'redux';
import { ReduxAsyncAction } from '../../modules/shared';
import {
  CommunityFollowUserActionType,
  CommunityUnfollowUserActionType,
  LoadMyPostsActionType,
  LoadFollowedPostsActionType,
  PostCreatePostActionType,
  PostRemovePostActionType,
  PostCreatePostCommentActionType,
  PostRemovePostCommentActionType,
  PostCreateCommentReplyActionType,
  PostRemoveCommentReplyActionType,
  PostLikeActionType,
  PostUnlikeActionType,
  PostCollectActionType,
  PostRemoveCollectActionType,
} from '../../modules/community/redux/actionTypes';

interface LoginRequireHandler {
  handle?: () => void;
}

const handler: LoginRequireHandler = {};

export const registerLoginReqiureHandler = ({
  handle,
}: {
  handle?: () => void;
}) => {
  handler.handle = handle;
};

const LOGIN_REQUIRED_ACTIONS: ReduxAsyncAction[] = [
  CommunityFollowUserActionType,
  CommunityUnfollowUserActionType,
  LoadMyPostsActionType,
  LoadFollowedPostsActionType,
  PostCreatePostActionType,
  PostRemovePostActionType,
  PostCreatePostCommentActionType,
  PostRemovePostCommentActionType,
  PostCreateCommentReplyActionType,
  PostRemoveCommentReplyActionType,
  PostLikeActionType,
  PostUnlikeActionType,
  PostCollectActionType,
  PostRemoveCollectActionType,
];

const actionTypes = new Set(LOGIN_REQUIRED_ACTIONS.map((item) => item.BEGIN));

export const loginAssertMiddleware: Middleware<Dispatch> =
  ({ dispatch, getState }: MiddlewareAPI) =>
  (next) =>
  (action: AnyAction) => {
    const currentUser = getState().authentication.currentUser.data;

    // if not login
    if (currentUser == null && actionTypes.has(action.type as string)) {
      if (handler.handle) {
        handler.handle();
      }
      return;
    }

    return next(action);
  };
