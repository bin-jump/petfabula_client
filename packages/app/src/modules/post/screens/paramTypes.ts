import { PostComment, PostCommentReply } from "@petfabula/common";

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
};

export default ParamTypes;
