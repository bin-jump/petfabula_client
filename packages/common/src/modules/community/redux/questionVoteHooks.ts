import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { AppState } from '../../../stateProvider';
import { CommunityState } from './types';
import {
  QuestionUpvoteQuestionActionType,
  QuestionUnvoteQuestionActionType,
  QuestionUpvoteAnswerActionType,
  QuestionUnvoteAnswerActionType,
} from './actionTypes';
import { ActionBase } from '../../shared';

export const useUpvoteQuestion = () => {
  const dispatch = useDispatch();
  const { pending } = useSelector(
    (state: AppState) => ({
      pending: state.community.questionDetail.data?.upvotePending,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(
    (questionId: number) => {
      dispatch({
        type: QuestionUpvoteQuestionActionType.BEGIN,
        payload: { questionId },
      });
    },
    [dispatch],
  );

  return {
    upvoteQuestion: boundAction,
    pending,
  };
};

export const useUnvoteQuestion = () => {
  const dispatch = useDispatch();
  const { pending } = useSelector(
    (state: AppState) => ({
      pending: state.community.questionDetail.data?.upvotePending,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(
    (questionId: number) => {
      dispatch({
        type: QuestionUnvoteQuestionActionType.BEGIN,
        payload: { questionId },
      });
    },
    [dispatch],
  );

  return {
    unvoteQuestion: boundAction,
    pending,
  };
};

export const useUpvoteAnswer = () => {
  const dispatch = useDispatch();

  const boundAction = useCallback(
    (answerId: number) => {
      dispatch({
        type: QuestionUpvoteAnswerActionType.BEGIN,
        payload: { answerId },
      });
    },
    [dispatch],
  );

  return {
    upvoteAnswer: boundAction,
  };
};

export const useUnvoteAnswer = () => {
  const dispatch = useDispatch();

  const boundAction = useCallback(
    (answerId: number) => {
      dispatch({
        type: QuestionUnvoteAnswerActionType.BEGIN,
        payload: { answerId },
      });
    },
    [dispatch],
  );

  return {
    unvoteAnswer: boundAction,
  };
};

export const questionVoteReducer = {
  // upvote question
  [QuestionUpvoteQuestionActionType.BEGIN]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      questionDetail: {
        ...state.questionDetail,
        data: state.questionDetail.data
          ? {
              ...state.questionDetail.data,
              upvotePending: true,
            }
          : state.questionDetail.data,
      },
    };
  },
  [QuestionUpvoteQuestionActionType.SUCCESS]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    const questionDetail = state.questionDetail.data;
    return {
      ...state,
      questionDetail: {
        ...state.questionDetail,
        data:
          questionDetail && questionDetail.id == action.payload.questionId
            ? {
                ...questionDetail,
                upvotePending: false,
                upvoted: true,
                upvoteCount: questionDetail.upvoteCount + 1,
              }
            : questionDetail,
      },
    };
  },
  [QuestionUpvoteQuestionActionType.FAILURE]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    const questionDetail = state.questionDetail.data;
    return {
      ...state,
      questionDetail: {
        ...state.questionDetail,
        data:
          questionDetail && questionDetail.id == action.extra.questionId
            ? {
                ...questionDetail,
                upvotePending: false,
              }
            : questionDetail,
      },
    };
  },

  // unvote question
  [QuestionUnvoteQuestionActionType.BEGIN]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    return {
      ...state,
      questionDetail: {
        ...state.questionDetail,
        data: state.questionDetail.data
          ? {
              ...state.questionDetail.data,
              upvotePending: true,
            }
          : state.questionDetail.data,
      },
    };
  },
  [QuestionUnvoteQuestionActionType.SUCCESS]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    const questionDetail = state.questionDetail.data;
    const diff = action.payload.upvoted ? -1 : 0;
    return {
      ...state,
      questionDetail: {
        ...state.questionDetail,
        data:
          questionDetail && questionDetail.id == action.payload.questionId
            ? {
                ...questionDetail,
                upvotePending: false,
                upvoted: false,
                upvoteCount: questionDetail.upvoteCount + diff,
              }
            : questionDetail,
      },
    };
  },
  [QuestionUnvoteQuestionActionType.FAILURE]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    const questionDetail = state.questionDetail.data;
    return {
      ...state,
      questionDetail: {
        ...state.questionDetail,
        data:
          questionDetail && questionDetail.id == action.extra.questionId
            ? {
                ...questionDetail,
                upvotePending: false,
              }
            : questionDetail,
      },
    };
  },

  // upvote answer
  [QuestionUpvoteAnswerActionType.BEGIN]: (
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
                  votePending: true,
                };
              }
              return item;
            })
          : state.questionAnswers.data,
      },
    };
  },
  [QuestionUpvoteAnswerActionType.SUCCESS]: (
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
                  votePending: false,
                  upvoted: true,
                  upvoteCount: item.upvoteCount + 1,
                };
              }
              return item;
            })
          : state.questionAnswers.data,
      },
    };
  },
  [QuestionUpvoteAnswerActionType.FAILURE]: (
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
                  votePending: false,
                };
              }
              return item;
            })
          : state.questionAnswers.data,
      },
    };
  },

  // unvote answer
  [QuestionUnvoteAnswerActionType.BEGIN]: (
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
                  votePending: true,
                };
              }
              return item;
            })
          : state.questionAnswers.data,
      },
    };
  },
  [QuestionUnvoteAnswerActionType.SUCCESS]: (
    state: CommunityState,
    action: ActionBase,
  ): CommunityState => {
    const answerId = action.payload.answerId;
    const diff = action.payload.upvoted ? -1 : 0;
    return {
      ...state,
      questionAnswers: {
        ...state.questionAnswers,
        data: state.questionAnswers.data
          ? state.questionAnswers.data.map((item) => {
              if (item.id == answerId) {
                return {
                  ...item,
                  votePending: false,
                  upvoted: false,
                  upvoteCount: item.upvoteCount + diff,
                };
              }
              return item;
            })
          : state.questionAnswers.data,
      },
    };
  },
  [QuestionUnvoteAnswerActionType.FAILURE]: (
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
                  votePending: false,
                };
              }
              return item;
            })
          : state.questionAnswers.data,
      },
    };
  },
};
