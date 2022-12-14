import {
  PostComment,
  PostCommentReply,
  Answer,
  AnswerComment,
  Participator,
  PostTopic,
  User,
} from "@petfabula/common";

type ParamTypes = {
  SearchResult: {
    keyword: string;
  };
  PostDetailView: {
    id: number;
  };
  CreateComment: {
    postId: number;
  };
  CreateCommentReply: {
    replyTarget: PostComment | PostCommentReply;
    toComment: boolean;
    commentId: number;
  };
  QuestionDetailView: {
    id: number;
  };
  CreateAnswerComment: {
    answer: Answer;
    replyTarget: AnswerComment | undefined;
  };
  UserProfile: {
    id: number;
  };
  UserInfomation: {
    user: Participator;
  };
  TopicPostList: {
    topic: PostTopic;
  };
  FollowList: {
    user: User;
    initialTab?: string;
  };
};

export default ParamTypes;
