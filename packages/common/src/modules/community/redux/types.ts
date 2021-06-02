import { AsyncDataBase, AsyncCursorPageListBase } from '../../shared';

export interface Participtor {
  id: number;
  name: string;
  photo: string;
  bio: string;
  petCount: number;
  postCount: number;
  followerCount: number;
  followedCount: number;
  questionCount: number;
  answerCount: number;
}

export interface ParticiptorPet {
  id: number;
  name: string;
  photo: string;
}

export interface Post {
  id: number;
  relatePetId: number;
  content: string;
  likeCount: number;
  commentCount: number;
  createdDate: number;
  participator: Participtor;
  images: string[];
}

export interface PostDetail extends Post {
  relatedPet: ParticiptorPet;
  liked: boolean;
  likePending: boolean;
}

export interface PostComment {
  id: number;
  postId: number;
  content: number;
  replyCount: number;
  createdDate: number;
  participator: Participtor;
  replies: PostCommentReply[];
  loadingReply: boolean;
  replyCursor: number | null;
}

export interface PostCommentReply {
  id: number;
  postId: number;
  postCommentId: number;
  content: number;
  createdDate: number;
  participator: Participtor;
}

export interface PostForm {
  content: string;
  relatedPetId: number | null;
}

export interface PostCommentForm {
  postId: number;
  content: string;
}

export interface PostCommentReplyForm {
  postCommentId: number;
  content: string;
}

export interface CommunityState {
  // user
  myDetail: AsyncDataBase<Participtor>;
  othersDetail: AsyncDataBase<Participtor>;
  myPosts: AsyncCursorPageListBase<Post>;
  othersPosts: AsyncCursorPageListBase<Post> & { userId: number | null };

  // post
  followedPosts: AsyncCursorPageListBase<Post>;
  recommendPosts: AsyncCursorPageListBase<Post>;
  postDetail: AsyncDataBase<PostDetail>;
  comments: AsyncCursorPageListBase<PostComment> & { postId: number | null };

  createPost: AsyncDataBase<Post>;
  removePost: AsyncDataBase<number>;
  createComment: AsyncDataBase<PostComment>;
  removeComment: AsyncDataBase<number>;
  createReply: AsyncDataBase<PostCommentReply>;
  removeReply: AsyncDataBase<number>;
}
