import {
  AsyncDataBase,
  AsyncCursorPageListBase,
  AsyncListBase,
  DisplayImage,
} from '../../shared';

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

export interface ParticiptorDetail extends Participtor {
  followed: boolean;
  followPending: boolean;
}

export interface ParticiptorPet {
  id: number;
  name: string;
  photo: string;
}

export interface PostTopic {
  id: number;
  title: string;
  intro: string;
}

export interface Post {
  id: number;
  relatePetId: number | null;
  content: string;
  viewCount: number;
  likeCount: number;
  collectCount: number;
  commentCount: number;
  createdDate: number;
  participator: Participtor;
  images: DisplayImage[];
}

export interface PostDetail extends Post {
  relatedPet: ParticiptorPet | null;
  liked: boolean;
  collected: boolean;
  likePending: boolean;
  collectPending: boolean;
  topic: PostTopic | null;
  participator: ParticiptorDetail;
}

export interface PostComment {
  id: number;
  postId: number;
  content: string;
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
  replyToId: number | null;
  content: string;
  createdDate: number;
  participator: Participtor;
}

export interface PostForm {
  content: string;
  relatedPetId: number | null;
  topicId: number | null;
}

export interface PostCommentForm {
  postId: number;
  content: string;
}

export interface PostCommentReplyForm {
  postCommentId: number;
  replyToId: number | null;
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
  postComments: AsyncCursorPageListBase<PostComment> & {
    postId: number | null;
  };
  searchPosts: AsyncCursorPageListBase<Post> & { keyword: string | null };

  createPost: AsyncDataBase<Post>;
  removePost: AsyncDataBase<number>;
  createPostComment: AsyncDataBase<PostComment>;
  removePostComment: AsyncDataBase<number>;
  createPostReply: AsyncDataBase<PostCommentReply>;
  removePostReply: AsyncDataBase<number>;

  postTopics: AsyncListBase<PostTopic>;
  mypets: AsyncListBase<ParticiptorPet>;
}
