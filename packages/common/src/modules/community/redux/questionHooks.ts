import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { AppState } from '../../../stateProvider';
import { QuestionForm, CommunityState } from './types';
import {
  QuestionCreateActionType,
  LoadUnansweredQuestionsActionType,
  QuestionLoadQuestionDetailActionType,
  LoadRecommendQuestionsActionType,
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

export const useLoadUnansweredQuestions = () => {
  const dispatch = useDispatch();
  const { questions, hasMore, nextCursor, pending, initializing, error } =
    useSelector(
      (state: AppState) => ({
        questions: state.community.unansweredQuestions.data,
        hasMore: state.community.unansweredQuestions.hasMore,
        nextCursor: state.community.unansweredQuestions.nextCursor,
        pending: state.community.unansweredQuestions.pending,
        initializing: state.community.unansweredQuestions.initializing,
        error: state.community.unansweredQuestions.error,
      }),
      shallowEqual,
    );

  const boundAction = useCallback(
    (cursor: object | null) => {
      dispatch({
        type: LoadUnansweredQuestionsActionType.BEGIN,
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
    (postForm: QuestionForm, images: Array<UploadImage>) => {
      const d = new FormData();
      d.append('question', JSON.stringify(postForm));
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

  // unanswered questions
  [LoadUnansweredQuestionsActionType.BEGIN]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      unansweredQuestions: {
        ...state.unansweredQuestions,
        initializing: action.payload.cursor == null,
        pending: true,
        error: null,
      },
    };
  },
  [LoadUnansweredQuestionsActionType.SUCCESS]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      unansweredQuestions: {
        ...fillCursorResponseData(state.unansweredQuestions, action),
      },
    };
  },
  [LoadUnansweredQuestionsActionType.FAILURE]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      unansweredQuestions: {
        ...state.unansweredQuestions,
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
};
