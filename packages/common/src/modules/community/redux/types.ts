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

// question
export interface Question {
  id: number;
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
  upvoted: boolean;
  upvotePending: boolean;
  participator: ParticiptorDetail;
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
  // othersDetail: AsyncDataBase<ParticiptorDetail>;
  // myPosts: AsyncCursorPageListBase<Post>;
  // othersPosts: AsyncCursorPageListBase<Post> & { userId: number | null };
  // mypets: AsyncListBase<ParticiptorPet>;
  userProfile: AsyncDataBase<ParticiptorDetail>;
  userPosts: AsyncCursorPageListBase<Post> & { userId: number | null };
  userQuestions: AsyncCursorPageListBase<Question> & { userId: number | null };
  userAnswers: AsyncCursorPageListBase<AnswerWithQuestion> & {
    userId: number | null;
  };
  userCollectedPosts: AsyncCursorPageListBase<Post> & { userId: number | null };
  userPets: AsyncListBase<ParticiptorPet> & { userId: number | null };

  // post
  postTopics: AsyncListBase<PostTopicCategory>;

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

  // question
  unansweredQuestions: AsyncCursorPageListBase<Question>;
  recommendQuestions: AsyncCursorPageListBase<Question>;

  questionDetail: AsyncDataBase<QuestionDetail>;
  questionAnswers: AsyncCursorPageListBase<Answer> & {
    questionId: number | null;
  };
  answerDetail: AsyncDataBase<Answer>;
  answerComments: AsyncCursorPageListBase<Answer> & { answerId: number | null };

  createQuestion: AsyncDataBase<Question>;
  createAnswer: AsyncDataBase<Answer>;
  createAnswerComment: AsyncDataBase<AnswerComment>;

  searchQuestionAnswers: AsyncCursorPageListBase<QuestionAnswerSearch> & {
    keyword: string | null;
  };
}
