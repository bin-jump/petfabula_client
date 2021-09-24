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
  QuestionUpdateAnswerActionType,
  QuestionRemoveAnswerActionType,
  QuestionRemoveAnswerCommentActionType,
} from './actionTypes';
import { ActionBase, UploadImage, fillCursorResponseData } from '../../shared';

export const useLoadQuestionAnswers = () => {
  const dispatch = useDispatch();
  const {
    questionId,
    answers,
    initializing,
    hasMore,
    nextCursor,
    pending,
    error,
  } = useSelector(
    (state: AppState) => ({
      questionId: state.community.questionAnswers.questionId,
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
    (questionId: number, cursor: object | null) => {
      dispatch({
        type: QuestionLoadQuestionAnswersActionType.BEGIN,
        payload: { questionId, cursor },
      });
    },
    [dispatch],
  );

  return {
    loadQuestionAnswers: boundAction,
    questionId,
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
    (answerForm: AnswerForm, images: Array<UploadImage>) => {
      const d = new FormData();
      d.append('answer', JSON.stringify(answerForm));
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

export const useUpdateAnswer = () => {
  const dispatch = useDispatch();
  const { result, pending, error } = useSelector(
    (state: AppState) => ({
      result: state.community.updateAnswer.data,
      pending: state.community.updateAnswer.pending,
      error: state.community.updateAnswer.error,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(
    (answer: Answer, images: Array<UploadImage>) => {
      const d = new FormData();
      d.append('answer', JSON.stringify(answer));
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
        type: QuestionUpdateAnswerActionType.BEGIN,
        payload: d,
      });
    },
    [dispatch],
  );

  return {
    updateAnswer: boundAction,
    result,
    pending,
    error,
  };
};

export const useRemoveAnswer = () => {
  const dispatch = useDispatch();
  const { result, pending, error } = useSelector(
    (state: AppState) => ({
      result: state.community.removeAnswer.data,
      pending: state.community.removeAnswer.pending,
      error: state.community.removeAnswer.error,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(
    (answerId: number) => {
      dispatch({
        type: QuestionRemoveAnswerActionType.BEGIN,
        payload: { answerId },
      });
    },
    [dispatch],
  );

  return {
    removeAnswer: boundAction,
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

export const useRemoveAnswerComment = () => {
  const dispatch = useDispatch();
  const { result, pending, error } = useSelector(
    (state: AppState) => ({
      result: state.community.removeAnswerComment.data,
      pending: state.community.removeAnswerComment.pending,
      error: state.community.removeAnswerComment.error,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(
    (answerCommentId: number) => {
      dispatch({
        type: QuestionRemoveAnswerCommentActionType.BEGIN,
        payload: { answerCommentId },
      });
    },
    [dispatch],
  );

  return {
    removeAnswerComment: boundAction,
    result,
    pending,
    error,
  };
};

export const useLoadAnswerComments = () => {
  const dispatch = useDispatch();

  const boundAction = useCallback(
    (answerId: number, cursor: object | null) => {
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
        error: action.error,
        pending: false,
      },
    };
  },

  // update answer
  [QuestionUpdateAnswerActionType.BEGIN]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      updateAnswer: {
        ...state.updateAnswer,
        pending: true,
        error: null,
      },
    };
  },
  [QuestionUpdateAnswerActionType.SUCCESS]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    const answer = action.payload as Answer;
    const answers = state.questionAnswers.data;
    return {
      ...state,
      updateAnswer: {
        ...state.updateAnswer,
        data: action.payload,
        pending: false,
      },
      questionAnswers: {
        ...state.questionAnswers,
        data: answers.map((item) => {
          if (item.id != answer.id) {
            return item;
          }
          return formatAnswer(answer);
        }),
      },
    };
  },
  [QuestionUpdateAnswerActionType.FAILURE]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      updateAnswer: {
        ...state.updateAnswer,
        error: action.error,
        pending: false,
      },
    };
  },

  // remove answer
  [QuestionRemoveAnswerActionType.BEGIN]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      removeAnswer: {
        ...state.removeAnswer,
        pending: true,
        error: null,
      },
    };
  },
  [QuestionRemoveAnswerActionType.SUCCESS]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    const answers = state.questionAnswers.data;
    const questionId = action.payload.questionId;
    const questionDetail = state.questionDetail.data;
    return {
      ...state,
      removeAnswer: {
        ...state.removeAnswer,
        data: action.payload,
        pending: false,
      },
      questionAnswers: {
        ...state.questionAnswers,
        data: answers.filter((item) => item.id != action.payload.id),
      },
      questionDetail: {
        ...state.questionDetail,
        data:
          questionDetail && questionId == questionDetail?.id
            ? { ...questionDetail, answerCount: questionDetail.answerCount - 1 }
            : questionDetail,
      },
    };
  },
  [QuestionRemoveAnswerActionType.FAILURE]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      removeAnswer: {
        ...state.removeAnswer,
        error: action.error,
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

  // remove answer comment
  [QuestionRemoveAnswerCommentActionType.BEGIN]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      removeAnswerComment: {
        ...state.removeAnswerComment,
        pending: true,
        error: null,
      },
    };
  },
  [QuestionRemoveAnswerCommentActionType.SUCCESS]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    const answerId = action.payload.answerId;
    return {
      ...state,
      removeAnswerComment: {
        ...state.removeAnswerComment,
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
                  commentCount: item.commentCount - 1,
                  comments: item.comments.filter(
                    (c) => c.id != action.payload.id,
                  ),
                };
              }
              return item;
            })
          : state.questionAnswers.data,
      },
    };
  },
  [QuestionRemoveAnswerCommentActionType.FAILURE]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      removeAnswerComment: {
        ...state.removeAnswerComment,
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
