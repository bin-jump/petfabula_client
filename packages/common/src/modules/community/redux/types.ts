import {
  AsyncDataBase,
  AsyncCursorPageListBase,
  AsyncListBase,
  DisplayImage,
  AlreadyDeleted,
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

export interface ParticipatorDetail extends Participator {
  followed: boolean;
  followPending: boolean;
  blocked: boolean;
  blockPending: boolean;
}

export interface ParticiptorPet {
  id: number;
  name: string;
  photo: string;
  category: string;
}

export interface PostTopic {
  id: number;
  title: string;
  topicCategoryId: number;
  topicCategoryTitle: string;
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
  relatePet: ParticiptorPet | null;
  liked: boolean;
  collected: boolean;
  likePending: boolean;
  collectPending: boolean;
  postTopic: PostTopic | null;
  participator: ParticipatorDetail;
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
  replyCursor: object | null;
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

export interface PostImage extends DisplayImage {
  postId: number;
  petId: number;
}

export interface PostForm {
  content: string;
  relatePetId: number | null;
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

// question
export interface Question {
  id: number;
  relatePetId: number | null;
  title: string;
  content: string;
  upvoteCount: number;
  answerCount: number;
  createdDate: number;
  participator: Participator;
  images: DisplayImage[];
}

export interface Answer {
  id: number;
  questionId: number;
  content: string;
  upvoteCount: number;
  commentCount: number;
  createdDate: number;
  participator: Participator;
  images: DisplayImage[];

  upvoted: boolean;
  votePending: boolean;
  comments: AnswerComment[];
  loadCommentPending: boolean;
  commentCursor: object | null;
}

export interface AnswerWithQuestion {
  id: number;
  questionId: number;
  questionTitle: string;
  content: string;
  upvoteCount: number;
  commentCount: number;
  createdDate: number;
  participator: Participator;
  images: DisplayImage[];
}

export interface QuestionDetail extends Question {
  relatePet: ParticiptorPet | null;
  upvoted: boolean;
  upvotePending: boolean;
  participator: ParticipatorDetail;
}

export interface QuestionAnswerSearch {
  id: number;
  questionId: number;
  answerId: number;
  title: string;
  content: string;
  answerContent: string;
  images: DisplayImage[];
  upvoteCount: number;
  commentCount: number;
  viewCount: number;
  createdDate: number;
  participator: Participator;
  category: 'ANSWER' | 'QUESTION';
}

export interface AnswerComment {
  id: number;
  content: string;
  answerId: number;
  replyTo: number | null;
  createdDate: number;
  participator: Participator;
}

export interface QuestionForm {
  title: string;
  relatePetId: number | null;
  content: string;
}

export interface AnswerForm {
  questionId: number;
  content: string;
}

export interface AnswerCommentForm {
  answerId: number;
  replyTo: number | null;
  content: string;
}

// export interface AnswerCommentReplyForm {
//   commentId: number;
//   replyToId: number | null;
//   content: string;
// }

export interface CommunityState {
  // user
  myProfile: AsyncDataBase<Participator>;
  myPosts: AsyncCursorPageListBase<Post>;
  myQuestions: AsyncCursorPageListBase<Question>;
  myAnswers: AsyncCursorPageListBase<AnswerWithQuestion>;
  myFavoritePosts: AsyncCursorPageListBase<Post>;

  // othersDetail: AsyncDataBase<ParticipatorDetail>;
  // myPosts: AsyncCursorPageListBase<Post>;
  // othersPosts: AsyncCursorPageListBase<Post> & { userId: number | null };
  // mypets: AsyncListBase<ParticiptorPet>;
  userProfile: AsyncDataBase<ParticipatorDetail>;
  userPosts: AsyncCursorPageListBase<Post> & { userId: number | null };
  petPosts: AsyncCursorPageListBase<Post> & { petId: number | null };
  userQuestions: AsyncCursorPageListBase<Question> & { userId: number | null };
  userAnswers: AsyncCursorPageListBase<AnswerWithQuestion> & {
    userId: number | null;
  };
  userCollectedPosts: AsyncCursorPageListBase<Post> & { userId: number | null };
  userPets: AsyncListBase<ParticiptorPet> & { userId: number | null };

  userFollowed: AsyncCursorPageListBase<Participator> & {
    userId: number | null;
  };
  userFollower: AsyncCursorPageListBase<Participator> & {
    userId: number | null;
  };

  myBlocked: AsyncCursorPageListBase<Participator>;
  // myFollowed: AsyncCursorPageListBase<Participator>;
  // myFollower: AsyncCursorPageListBase<Participator>;

  // post
  postTopics: AsyncListBase<PostTopic>;

  followedPosts: AsyncCursorPageListBase<Post>;
  recommendPosts: AsyncCursorPageListBase<Post>;
  postDetail: AsyncDataBase<PostDetail>;
  postComments: AsyncCursorPageListBase<PostComment> & {
    postId: number | null;
  };
  searchPosts: AsyncCursorPageListBase<Post> & { keyword: string | null };
  petPostImages: AsyncCursorPageListBase<PostImage> & { petId: number | null };
  topicPosts: AsyncCursorPageListBase<Post> & { topicId: number | null };

  createPost: AsyncDataBase<Post>;
  removePost: AsyncDataBase<Post | AlreadyDeleted>;
  updatePost: AsyncDataBase<Post>;
  createPostComment: AsyncDataBase<PostComment>;
  removePostComment: AsyncDataBase<PostComment | AlreadyDeleted>;
  createPostReply: AsyncDataBase<PostCommentReply>;
  removePostReply: AsyncDataBase<PostCommentReply | AlreadyDeleted>;

  // question
  recentQuestions: AsyncCursorPageListBase<Question>;
  recommendQuestions: AsyncCursorPageListBase<Question>;

  questionDetail: AsyncDataBase<QuestionDetail>;
  questionAnswers: AsyncCursorPageListBase<Answer> & {
    questionId: number | null;
  };
  answerDetail: AsyncDataBase<Answer>;
  answerComments: AsyncCursorPageListBase<Answer> & { answerId: number | null };

  createQuestion: AsyncDataBase<Question>;
  updateQuestion: AsyncDataBase<Question>;
  removeQuestion: AsyncDataBase<Question | AlreadyDeleted>;
  createAnswer: AsyncDataBase<Answer>;
  updateAnswer: AsyncDataBase<Answer>;
  removeAnswer: AsyncDataBase<Answer | AlreadyDeleted>;

  createAnswerComment: AsyncDataBase<AnswerComment>;
  removeAnswerComment: AsyncDataBase<AnswerComment | AlreadyDeleted>;

  searchQuestionAnswers: AsyncCursorPageListBase<QuestionAnswerSearch> & {
    keyword: string | null;
  };
}
