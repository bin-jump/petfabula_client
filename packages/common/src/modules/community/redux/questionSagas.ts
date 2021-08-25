import { all, fork } from 'redux-saga/effects';
import { createSagaWatcher } from '../../shared';
import {
  LoadRecentQuestionsActionType,
  QuestionCreateActionType,
  QuestionUpdateQuestionActionType,
  QuestionRemoveQuestionActionType,
  QuestionLoadQuestionDetailActionType,
  QuestionLoadQuestionAnswersActionType,
  QuestionUpdateAnswerActionType,
  QuestionRemoveAnswerActionType,
  QuestionCreateAnswersActionType,
  LoadRecommendQuestionsActionType,
  QuestionCreateAnswerCommentActionType,
  QuestionRemoveAnswerCommentActionType,
  QuestionLoadAnswerCommentActionType,
  QuestionUpvoteQuestionActionType,
  QuestionUnvoteQuestionActionType,
  QuestionUpvoteAnswerActionType,
  QuestionUnvoteAnswerActionType,
  QuestionAnswerSearchActionType,
} from './actionTypes';

const watchLoadRecommendQuestions = createSagaWatcher({
  url: `/api/recommend/questions`,
  method: 'GET',
  asyncAction: LoadRecommendQuestionsActionType,
  watchType: 'LATEST',
});

const watchLoadRecentQuestions = createSagaWatcher({
  url: `/api/question/recent-questions`,
  method: 'GET',
  asyncAction: LoadRecentQuestionsActionType,
  watchType: 'LATEST',
});

const watchCreateQuestion = createSagaWatcher({
  url: `/api/question/questions`,
  method: 'POST',
  asyncAction: QuestionCreateActionType,
  watchType: 'EVERY',
});

const watchUpdateQuestion = createSagaWatcher({
  url: `/api/question/questions`,
  method: 'PUT',
  asyncAction: QuestionUpdateQuestionActionType,
  watchType: 'EVERY',
});

const watchRemoveQuestion = createSagaWatcher({
  method: 'DELETE',
  asyncAction: QuestionRemoveQuestionActionType,
  watchType: 'EVERY',
  createUrl: (payload) => {
    return `/api/question/questions/${payload.questionId}`;
  },
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

const watchUpdateAnswer = createSagaWatcher({
  url: `/api/question/answers`,
  method: 'PUT',
  asyncAction: QuestionUpdateAnswerActionType,
  watchType: 'EVERY',
});

const watchRemoveAnswer = createSagaWatcher({
  createUrl: (payload) => {
    return `/api/question/answers/${payload.answerId}`;
  },
  method: 'DELETE',
  asyncAction: QuestionRemoveAnswerActionType,
  watchType: 'EVERY',
});

const watchCreateAnswerComment = createSagaWatcher({
  url: `/api/question/answers/comments`,
  method: 'POST',
  asyncAction: QuestionCreateAnswerCommentActionType,
  watchType: 'EVERY',
});

const watchRemoveAnswerComment = createSagaWatcher({
  createUrl: (payload) => {
    return `/api/question/answers/comments/${payload.answerCommentId}`;
  },
  method: 'DELETE',
  asyncAction: QuestionRemoveAnswerCommentActionType,
  watchType: 'EVERY',
});

const watchLoadAnswerComments = createSagaWatcher({
  createUrl: (payload) => {
    return `/api/question/answers/${payload.answerId}/comments`;
  },
  method: 'GET',
  asyncAction: QuestionLoadAnswerCommentActionType,
  watchType: 'LATEST',
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

const watchSearchQuestionAnswer = createSagaWatcher({
  method: 'GET',
  asyncAction: QuestionAnswerSearchActionType,
  watchType: 'LATEST',
  createUrl: (payload) => {
    let url = `/api/search/question?q=${payload.keyword}`;
    return url;
  },
});

export function* questionRootSaga() {
  yield all([
    fork(watchLoadRecommendQuestions),
    fork(watchCreateQuestion),
    fork(watchUpdateQuestion),
    fork(watchRemoveQuestion),

    fork(watchLoadRecentQuestions),
    fork(watchLoadQuestionDetail),
    fork(watchLoadQuestionAnswers),
    fork(watchCreateAnswer),
    fork(watchUpdateAnswer),
    fork(watchRemoveAnswer),
    fork(watchCreateAnswerComment),
    fork(watchRemoveAnswerComment),
    fork(watchLoadAnswerComments),
    fork(watchUpvoteQuestion),
    fork(watchUnvoteQuestion),
    fork(watchUpvoteAnswer),
    fork(watchUnvoteAnswer),
    fork(watchSearchQuestionAnswer),
  ]);
}
