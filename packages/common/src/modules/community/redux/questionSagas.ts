import { all, fork } from 'redux-saga/effects';
import { createSagaWatcher } from '../../shared';
import {
  LoadUnansweredQuestionsActionType,
  QuestionCreateActionType,
  QuestionLoadQuestionDetailActionType,
  QuestionLoadQuestionAnswersActionType,
  QuestionCreateAnswersActionType,
  LoadRecommendQuestionsActionType,
  QuestionCreateAnswerCommentActionType,
  QuestionLoadAnswerCommentActionType,
  QuestionUpvoteQuestionActionType,
  QuestionUnvoteQuestionActionType,
  QuestionUpvoteAnswerActionType,
  QuestionUnvoteAnswerActionType,
} from './actionTypes';

const watchLoadRecommendQuestions = createSagaWatcher({
  url: `/api/question/recommend/questions`,
  method: 'GET',
  asyncAction: LoadRecommendQuestionsActionType,
  watchType: 'LATEST',
});

const watchLoadUnansweredQuestions = createSagaWatcher({
  url: `/api/question/unanswered-questions`,
  method: 'GET',
  asyncAction: LoadUnansweredQuestionsActionType,
  watchType: 'LATEST',
});

const watchCreateQuestion = createSagaWatcher({
  url: `/api/question/questions`,
  method: 'POST',
  asyncAction: QuestionCreateActionType,
  watchType: 'EVERY',
});

const watchLoadQuestionDetail = createSagaWatcher({
  method: 'GET',
  asyncAction: QuestionLoadQuestionDetailActionType,
  watchType: 'LATEST',
  createUrl: (payload) => {
    return `/api/question/questions/${payload.questionId}`;
  },
});

const watchLoadQuestionAnswers = createSagaWatcher({
  method: 'GET',
  asyncAction: QuestionLoadQuestionAnswersActionType,
  watchType: 'LATEST',
  createUrl: (payload) => {
    return `/api/question/questions/${payload.questionId}/answers`;
  },
});

const watchCreateAnswer = createSagaWatcher({
  url: `/api/question/answers`,
  method: 'POST',
  asyncAction: QuestionCreateAnswersActionType,
  watchType: 'EVERY',
});

const watchCreateAnswerComments = createSagaWatcher({
  url: `/api/question/answers/comments`,
  method: 'POST',
  asyncAction: QuestionCreateAnswerCommentActionType,
  watchType: 'EVERY',
});

const watchLoadAnswerComments = createSagaWatcher({
  method: 'GET',
  asyncAction: QuestionLoadAnswerCommentActionType,
  watchType: 'LATEST',
  createUrl: (payload) => {
    return `/api/question/answers/${payload.answerId}/comments`;
  },
});

const watchUpvoteQuestion = createSagaWatcher({
  method: 'POST',
  asyncAction: QuestionUpvoteQuestionActionType,
  watchType: 'LATEST',
  createUrl: (payload) => {
    return `/api/question/questions/${payload.questionId}/vote`;
  },
});

const watchUnvoteQuestion = createSagaWatcher({
  method: 'DELETE',
  asyncAction: QuestionUnvoteQuestionActionType,
  watchType: 'LATEST',
  createUrl: (payload) => {
    return `/api/question/questions/${payload.questionId}/vote`;
  },
});

const watchUpvoteAnswer = createSagaWatcher({
  method: 'POST',
  asyncAction: QuestionUpvoteAnswerActionType,
  watchType: 'LATEST',
  createUrl: (payload) => {
    return `/api/question/answers/${payload.answerId}/vote`;
  },
});

const watchUnvoteAnswer = createSagaWatcher({
  method: 'DELETE',
  asyncAction: QuestionUnvoteAnswerActionType,
  watchType: 'LATEST',
  createUrl: (payload) => {
    return `/api/question/answers/${payload.answerId}/vote`;
  },
});

export function* questionRootSaga() {
  yield all([
    fork(watchLoadRecommendQuestions),
    fork(watchCreateQuestion),
    fork(watchLoadUnansweredQuestions),
    fork(watchLoadQuestionDetail),
    fork(watchLoadQuestionAnswers),
    fork(watchCreateAnswer),
    fork(watchCreateAnswerComments),
    fork(watchLoadAnswerComments),
    fork(watchUpvoteQuestion),
    fork(watchUnvoteQuestion),
    fork(watchUpvoteAnswer),
    fork(watchUnvoteAnswer),
  ]);
}
