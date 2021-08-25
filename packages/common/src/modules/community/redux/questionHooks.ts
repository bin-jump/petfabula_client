import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { AppState } from '../../../stateProvider';
import { QuestionForm, CommunityState, QuestionDetail } from './types';
import {
  QuestionCreateActionType,
  LoadRecentQuestionsActionType,
  QuestionLoadQuestionDetailActionType,
  LoadRecommendQuestionsActionType,
  QuestionUpdateQuestionActionType,
  QuestionRemoveQuestionActionType,
} from './actionTypes';
import { ActionBase, UploadImage, fillCursorResponseData } from '../../shared';

export const useLoadRecommendsQuestions = () => {
  const dispatch = useDispatch();
  const { questions, hasMore, nextCursor, pending, initializing, error } =
    useSelector(
      (state: AppState) => ({
        questions: state.community.recommendQuestions.data,
        hasMore: state.community.recommendQuestions.hasMore,
        nextCursor: state.community.recommendQuestions.nextCursor,
        pending: state.community.recommendQuestions.pending,
        initializing: state.community.recommendQuestions.initializing,
        error: state.community.recommendQuestions.error,
      }),
      shallowEqual,
    );

  const boundAction = useCallback(
    (cursor: object | null) => {
      dispatch({
        type: LoadRecommendQuestionsActionType.BEGIN,
        payload: { cursor },
      });
    },
    [dispatch],
  );

  return {
    loadQuestions: boundAction,
    hasMore,
    nextCursor,
    questions,
    pending,
    initializing,
    error,
  };
};

export const useLoadRecentQuestions = () => {
  const dispatch = useDispatch();
  const { questions, hasMore, nextCursor, pending, initializing, error } =
    useSelector(
      (state: AppState) => ({
        questions: state.community.recentQuestions.data,
        hasMore: state.community.recentQuestions.hasMore,
        nextCursor: state.community.recentQuestions.nextCursor,
        pending: state.community.recentQuestions.pending,
        initializing: state.community.recentQuestions.initializing,
        error: state.community.recentQuestions.error,
      }),
      shallowEqual,
    );

  const boundAction = useCallback(
    (cursor: object | null) => {
      dispatch({
        type: LoadRecentQuestionsActionType.BEGIN,
        payload: { cursor },
      });
    },
    [dispatch],
  );

  return {
    loadQuestions: boundAction,
    hasMore,
    nextCursor,
    questions,
    pending,
    initializing,
    error,
  };
};

export const useLoadQuestionDetail = () => {
  const dispatch = useDispatch();
  const { question, pending, error } = useSelector(
    (state: AppState) => ({
      question: state.community.questionDetail.data,
      pending: state.community.questionDetail.pending,
      error: state.community.questionDetail.error,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(
    (questionId: number) => {
      dispatch({
        type: QuestionLoadQuestionDetailActionType.BEGIN,
        payload: { questionId },
      });
    },
    [dispatch],
  );

  return {
    loadQuestionDetail: boundAction,
    question,
    pending,
    error,
  };
};

export const useUpdateQuestion = () => {
  const dispatch = useDispatch();
  const { result, pending, error } = useSelector(
    (state: AppState) => ({
      result: state.community.updateQuestion.data,
      pending: state.community.updateQuestion.pending,
      error: state.community.updateQuestion.error,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(
    (questionDetail: QuestionDetail, images: Array<UploadImage>) => {
      const d = new FormData();
      d.append('question', JSON.stringify(questionDetail));
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
        type: QuestionUpdateQuestionActionType.BEGIN,
        payload: d,
      });
    },
    [dispatch],
  );

  return {
    updateQuestion: boundAction,
    result,
    pending,
    error,
  };
};

export const useCreateQuestion = () => {
  const dispatch = useDispatch();
  const { result, pending, error } = useSelector(
    (state: AppState) => ({
      result: state.community.createQuestion.data,
      pending: state.community.createQuestion.pending,
      error: state.community.createQuestion.error,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(
    (questionForm: QuestionForm, images: Array<UploadImage>) => {
      const d = new FormData();
      d.append('question', JSON.stringify(questionForm));
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
        type: QuestionCreateActionType.BEGIN,
        payload: d,
      });
    },
    [dispatch],
  );

  return {
    createQuestion: boundAction,
    result,
    pending,
    error,
  };
};

export const useRemoveQuestion = () => {
  const dispatch = useDispatch();
  const { result, pending, error } = useSelector(
    (state: AppState) => ({
      result: state.community.removeQuestion.data,
      pending: state.community.removeQuestion.pending,
      error: state.community.removeQuestion.error,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(
    (questionId: number) => {
      dispatch({
        type: QuestionRemoveQuestionActionType.BEGIN,
        payload: { questionId },
      });
    },
    [dispatch],
  );

  return {
    removeQuestion: boundAction,
    result,
    pending,
    error,
  };
};

export const questionReducer = {
  // recommends questions
  [LoadRecommendQuestionsActionType.BEGIN]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      recommendQuestions: {
        ...state.recommendQuestions,
        initializing: action.payload.cursor == null,
        pending: true,
        error: null,
      },
    };
  },
  [LoadRecommendQuestionsActionType.SUCCESS]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      recommendQuestions: {
        ...fillCursorResponseData(state.recommendQuestions, action),
      },
    };
  },
  [LoadRecommendQuestionsActionType.FAILURE]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      recommendQuestions: {
        ...state.recommendQuestions,
        pending: false,
        initializing: false,
        error: action.error,
      },
    };
  },

  // recent questions
  [LoadRecentQuestionsActionType.BEGIN]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      recentQuestions: {
        ...state.recentQuestions,
        initializing: action.payload.cursor == null,
        pending: true,
        error: null,
      },
    };
  },
  [LoadRecentQuestionsActionType.SUCCESS]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      recentQuestions: {
        ...fillCursorResponseData(state.recentQuestions, action),
      },
    };
  },
  [LoadRecentQuestionsActionType.FAILURE]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      recentQuestions: {
        ...state.recentQuestions,
        pending: false,
        initializing: false,
        error: action.error,
      },
    };
  },

  // create question
  [QuestionCreateActionType.BEGIN]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      createQuestion: {
        ...state.createQuestion,
        pending: true,
        error: null,
      },
    };
  },
  [QuestionCreateActionType.SUCCESS]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      createQuestion: {
        ...state.createQuestion,
        pending: false,
        data: action.payload,
      },
    };
  },
  [QuestionCreateActionType.FAILURE]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      createQuestion: {
        ...state.createQuestion,
        pending: false,
        error: action.error,
      },
    };
  },

  // load question detail
  [QuestionLoadQuestionDetailActionType.BEGIN]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      questionDetail: {
        ...state.questionDetail,
        pending: true,
        error: null,
      },
    };
  },
  [QuestionLoadQuestionDetailActionType.SUCCESS]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      questionDetail: {
        ...state.questionDetail,
        pending: false,
        data: { ...action.payload, upvotePending: false },
      },
    };
  },
  [QuestionLoadQuestionDetailActionType.FAILURE]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      questionDetail: {
        ...state.questionDetail,
        pending: false,
        error: action.error,
      },
    };
  },

  // update question detail
  [QuestionUpdateQuestionActionType.BEGIN]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      updateQuestion: {
        ...state.updateQuestion,
        pending: true,
        error: null,
      },
    };
  },
  [QuestionUpdateQuestionActionType.SUCCESS]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    const questionDetail = state.questionDetail.data;
    return {
      ...state,
      updateQuestion: {
        ...state.updateQuestion,
        pending: false,
        data: action.payload,
      },
      questionDetail: {
        ...state.questionDetail,
        data:
          questionDetail && questionDetail.id == action.payload.id
            ? { ...action.payload, upvotePending: false }
            : questionDetail,
      },
    };
  },
  [QuestionUpdateQuestionActionType.FAILURE]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      updateQuestion: {
        ...state.updateQuestion,
        pending: false,
        error: action.error,
      },
    };
  },

  // remove question
  [QuestionRemoveQuestionActionType.BEGIN]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      removeQuestion: {
        ...state.removeQuestion,
        pending: true,
        error: null,
      },
    };
  },
  [QuestionRemoveQuestionActionType.SUCCESS]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    const mDetail = state.myProfile.data;
    const recommendQuestions = state.recommendQuestions.data;
    return {
      ...state,
      removeQuestion: {
        ...state.removeQuestion,
        pending: false,
        data: action.payload,
      },
      myProfile: {
        ...state.myProfile,
        data: mDetail
          ? { ...mDetail, questionCount: mDetail.questionCount - 1 }
          : mDetail,
      },
      recommendQuestions: {
        ...state.recommendQuestions,
        data: recommendQuestions.filter((item) => item.id != action.payload.id),
      },
    };
  },
  [QuestionRemoveQuestionActionType.FAILURE]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      removeQuestion: {
        ...state.removeQuestion,
        pending: false,
        error: action.error,
      },
    };
  },
};
