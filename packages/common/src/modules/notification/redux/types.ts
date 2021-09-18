import {
  AsyncDataBase,
  AsyncCursorPageListBase,
  AsyncListBase,
  DisplayImage,
} from '../../shared';
import { Post, Question } from '../../community';

export interface NotificationActor {
  id: number;
  name: string;
  photo: string;
}

export interface NotificationCheckResult {
  receiverId: number;
  answerCommentCount: number;
  followCount: number;
  voteCount: number;
  hasSystemNotificationUnread: boolean;
}

export interface NotificationReadResult {
  receiverId: number;
}

export interface AnswerCommentNotification {
  id: number;
  targetEntity: Post | Question;
  content: string;
  actor: NotificationActor;
  images: DisplayImage[];
  createdDate: number;
  targetEntityType:
    | 'QUESTION'
    | 'ANSWER'
    | 'POST'
    | 'POST_COMMENT'
    | 'POST_COMMENT_REPLY'
    | 'ANSWER_COMMENT';
  actionType: 'ANSWER' | 'COMMENT' | 'REPLY';
}

export interface VoteNotification {
  id: number;
  targetEntity: Post | Question;
  content: string;
  actor: NotificationActor;
  images: DisplayImage[];
  createdDate: number;
  targetEntityType: 'ANSWER' | 'POST' | 'QUESTION';
  actionType: 'UPVOTE' | 'COLLECT';
}

export interface FollowNotification {
  id: number;
  follower: NotificationActor;
  createdDate: number;
}

export interface SystemNotification {
  id: number;
  title: string;
  content: string;
  createdDate: number;
}

export interface NotificationState {
  notificationCheckResult: AsyncDataBase<NotificationCheckResult>;
  answerCommentNotifications: AsyncCursorPageListBase<AnswerCommentNotification>;
  upvoteNotifications: AsyncCursorPageListBase<VoteNotification>;
  followNotifications: AsyncCursorPageListBase<FollowNotification>;
  systemNotifications: AsyncCursorPageListBase<SystemNotification>;
}
