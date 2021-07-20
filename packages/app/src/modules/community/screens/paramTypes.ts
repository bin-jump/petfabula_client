import {
  PostComment,
  PostCommentReply,
  Answer,
  AnswerComment,
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
};

export default ParamTypes;
