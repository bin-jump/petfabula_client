import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { AppState } from '../../../stateProvider';
import {
  AnswerForm,
  CommunityState,
  Answer,
  AnswerCommentForm,
  AnswerComment,
} from './types';
import {
  QuestionLoadQuestionAnswersActionType,
  QuestionCreateAnswersActionType,
  QuestionCreateAnswerCommentActionType,
  QuestionLoadAnswerCommentActionType,
} from './actionTypes';
import { ActionBase, UploadImage, fillCursorResponseData } from '../../shared';

export const useLoadQuestionAnswers = () => {
  const dispatch = useDispatch();
  const { answers, initializing, hasMore, nextCursor, pending, error } =
    useSelector(
      (state: AppState) => ({
        answers: state.community.questionAnswers.data,
        hasMore: state.community.questionAnswers.hasMore,
        nextCursor: state.community.questionAnswers.nextCursor,
        pending: state.community.questionAnswers.pending,
        initializing: state.community.questionAnswers.initializing,
        error: state.community.questionAnswers.error,
      }),
      shallowEqual,
    );

  const boundAction = useCallback(
    (questionId: number, cursor: number | null) => {
      dispatch({
        type: QuestionLoadQuestionAnswersActionType.BEGIN,
        payload: { questionId, cursor },
      });
    },
    [dispatch],
  );

  return {
    loadQuestionAnswers: boundAction,
    answers,
    hasMore,
    nextCursor,
    initializing,
    pending,
    error,
  };
};

export const useCreateAnswer = () => {
  const dispatch = useDispatch();
  const { result, pending, error } = useSelector(
    (state: AppState) => ({
      result: state.community.createAnswer.data,
      pending: state.community.createAnswer.pending,
      error: state.community.createAnswer.error,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(
    (postForm: AnswerForm, images: Array<UploadImage>) => {
      const d = new FormData();
      d.append('answer', JSON.stringify(postForm));
      for (const image of images) {
        if (image) {
          d.append('images', {
            uri: image.uri,
            name: image.name,
            type: image.type,
          } as any);
        }
      }

      dispatch({
        type: QuestionCreateAnswersActionType.BEGIN,
        payload: d,
      });
    },
    [dispatch],
  );

  return {
    createAnswer: boundAction,
    result,
    pending,
    error,
  };
};

export const useCreateAnswerComment = () => {
  const dispatch = useDispatch();
  const { result, pending, error } = useSelector(
    (state: AppState) => ({
      result: state.community.createAnswerComment.data,
      pending: state.community.createAnswerComment.pending,
      error: state.community.createAnswerComment.error,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(
    (data: AnswerCommentForm) => {
      dispatch({
        type: QuestionCreateAnswerCommentActionType.BEGIN,
        payload: data,
      });
    },
    [dispatch],
  );

  return {
    createAnswerComment: boundAction,
    result,
    pending,
    error,
  };
};

export const useLoadAnswerComments = () => {
  const dispatch = useDispatch();

  const boundAction = useCallback(
    (answerId: number, cursor: number | null) => {
      dispatch({
        type: QuestionLoadAnswerCommentActionType.BEGIN,
        payload: { answerId, cursor },
      });
    },
    [dispatch],
  );

  return {
    loadAnswerComments: boundAction,
  };
};

const formatAnswer = (answer: Answer): Answer => {
  return {
    ...answer,
    votePending: false,
    comments: [],
    loadCommentPending: false,
  };
};

const formatAnswerList = (answers: Answer[]): Answer[] => {
  return answers.map((item) => formatAnswer(item));
};

const uniqueComment = (replies: AnswerComment[]) => {
  const hist = new Set();
  const res: AnswerComment[] = [];
  replies
    .slice()
    .reverse()
    .forEach((item) => {
      if (!hist.has(item.id)) {
        hist.add(item.id);
        res.push(item);
      }
    });
  return res.reverse();
};

export const answerReducer = {
  // load question answer
  [QuestionLoadQuestionAnswersActionType.BEGIN]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      questionAnswers: {
        ...state.questionAnswers,
        initializing: action.payload.cursor == null,
        pending: true,
        error: null,
      },
    };
  },
  [QuestionLoadQuestionAnswersActionType.SUCCESS]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      questionAnswers: {
        ...fillCursorResponseData(
          state.questionAnswers,
          action,
          formatAnswerList,
        ),
        questionId: action.extra.questionId,
      },
    };
  },
  [QuestionLoadQuestionAnswersActionType.FAILURE]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      questionAnswers: {
        ...state.questionAnswers,
        pending: false,
        initializing: false,
        error: action.error,
      },
    };
  },

  // create answer
  [QuestionCreateAnswersActionType.BEGIN]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      createAnswer: {
        ...state.createAnswer,
        pending: true,
        error: null,
      },
    };
  },
  [QuestionCreateAnswersActionType.SUCCESS]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    const questionId = action.payload.questionId;
    const questionDetail = state.questionDetail.data;
    return {
      ...state,
      createAnswer: {
        ...state.createAnswer,
        data: action.payload,
        pending: false,
      },
      questionAnswers: {
        ...state.questionAnswers,
        data:
          questionId == state.questionAnswers?.questionId
            ? [formatAnswer(action.payload), ...state.questionAnswers.data]
            : state.questionAnswers.data,
      },
      questionDetail: {
        ...state.questionDetail,
        data:
          questionDetail && questionId == questionDetail?.id
            ? { ...questionDetail, answerCount: questionDetail.answerCount + 1 }
            : questionDetail,
      },
    };
  },
  [QuestionCreateAnswersActionType.FAILURE]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      createAnswer: {
        ...state.createAnswer,
        data: action.payload,
        pending: false,
      },
    };
  },

  // create answer comment
  [QuestionCreateAnswerCommentActionType.BEGIN]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      createAnswerComment: {
        ...state.createAnswerComment,
        pending: true,
        error: null,
      },
    };
  },
  [QuestionCreateAnswerCommentActionType.SUCCESS]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    const answerId = action.payload.answerId;
    return {
      ...state,
      createAnswerComment: {
        ...state.createAnswerComment,
        data: action.payload,
        pending: false,
      },
      questionAnswers: {
        ...state.questionAnswers,
        data: state.questionAnswers.data
          ? state.questionAnswers.data.map((item) => {
              if (item.id == answerId) {
                return {
                  ...item,
                  commentCount: item.commentCount + 1,
                  comments: [action.payload, ...item.comments],
                };
              }
              return item;
            })
          : state.questionAnswers.data,
      },
    };
  },
  [QuestionCreateAnswerCommentActionType.FAILURE]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      createAnswerComment: {
        ...state.createAnswerComment,
        pending: false,
        error: action.error,
      },
    };
  },

  // load answer comments
  [QuestionLoadAnswerCommentActionType.BEGIN]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    const answerId = action.payload.answerId;
    return {
      ...state,
      questionAnswers: {
        ...state.questionAnswers,
        data: state.questionAnswers.data
          ? state.questionAnswers.data.map((item) => {
              if (item.id == answerId) {
                return {
                  ...item,
                  loadCommentPending: true,
                };
              }
              return item;
            })
          : state.questionAnswers.data,
      },
    };
  },
  [QuestionLoadAnswerCommentActionType.SUCCESS]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    const answerId = action.extra.answerId;
    return {
      ...state,
      questionAnswers: {
        ...state.questionAnswers,
        data: state.questionAnswers.data
          ? state.questionAnswers.data.map((item) => {
              if (item.id == answerId) {
                return {
                  ...item,
                  comments: uniqueComment([
                    ...item.comments,
                    ...action.payload.result,
                  ]),
                  commentCursor: action.payload.nextCursor,
                  loadCommentPending: false,
                };
              }
              return item;
            })
          : state.questionAnswers.data,
      },
    };
  },
  [QuestionLoadAnswerCommentActionType.FAILURE]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    const answerId = action.extra.answerId;
    return {
      ...state,
      questionAnswers: {
        ...state.questionAnswers,
        data: state.questionAnswers.data
          ? state.questionAnswers.data.map((item) => {
              if (item.id == answerId) {
                return {
                  ...item,
                  loadCommentPending: false,
                };
              }
              return item;
            })
          : state.questionAnswers.data,
      },
    };
  },
};
