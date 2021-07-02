import {
  AsyncDataBase,
  AsyncCursorPageListBase,
  AsyncListBase,
  DisplayImage,
} from '../../shared';

export interface Participator {
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

export interface ParticiptorDetail extends Participator {
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
}

export interface PostTopicCategory {
  id: number;
  title: string;
  topics: PostTopic[];
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
  participator: Participator;
  images: DisplayImage[];
}

export interface PostDetail extends Post {
  relatedPet: ParticiptorPet | null;
  liked: boolean;
  collected: boolean;
  likePending: boolean;
  collectPending: boolean;
  postTopic: PostTopic | null;
  participator: ParticiptorDetail;
}

export interface PostComment {
  id: number;
  postId: number;
  content: string;
  replyCount: number;
  createdDate: number;
  participator: Participator;
  replies: PostCommentReply[];
  loadingReply: boolean;
  replyCursor: number | null;
}

export interface PostCommentReply {
  id: number;
  postId: number;
  commentId: number;
  replyToId: number | null;
  content: string;
  createdDate: number;
  participator: Participator;
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
  commentId: number;
  replyToId: number | null;
  content: string;
}

export interface CommunityState {
  // user
  myDetail: AsyncDataBase<Participator>;
  othersDetail: AsyncDataBase<Participator>;
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

  postTopics: AsyncListBase<PostTopicCategory>;
  mypets: AsyncListBase<ParticiptorPet>;
}
