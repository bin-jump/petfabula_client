import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { AppState } from '../../../stateProvider';
import { FeedbackState, FeedbackForm, ReportForm } from './types';
import {
  FeedbackCreateFeedbackkActionType,
  FeedbackCreateReportActionType,
} from './actionTypes';
import { ActionBase } from '../../shared';

export const useCreateFeedback = () => {
  const dispatch = useDispatch();
  const { result, pending, error } = useSelector(
    (state: AppState) => ({
      result: state.feedback.createFeedback.data,
      pending: state.feedback.createFeedback.pending,
      error: state.feedback.createFeedback.error,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(
    (data: FeedbackForm) => {
      dispatch({
        type: FeedbackCreateFeedbackkActionType.BEGIN,
        payload: data,
      });
    },
    [dispatch],
  );

  return {
    createFeedback: boundAction,
    result,
    pending,
    error,
  };
};

export const useCreateReport = () => {
  const dispatch = useDispatch();
  const { result, pending, error } = useSelector(
    (state: AppState) => ({
      result: state.feedback.createReport.data,
      pending: state.feedback.createReport.pending,
      error: state.feedback.createReport.error,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(
    (data: ReportForm) => {
      dispatch({
        type: FeedbackCreateReportActionType.BEGIN,
        payload: data,
      });
    },
    [dispatch],
  );

  return {
    createReport: boundAction,
    result,
    pending,
    error,
  };
};

export const feedbackReducer = {
  [FeedbackCreateFeedbackkActionType.BEGIN]: (
    state: FeedbackState,
    action: ActionBase,
  ): FeedbackState => {
    return {
      ...state,
      createFeedback: {
        ...state.createFeedback,
        pending: true,
        error: null,
      },
    };
  },
  [FeedbackCreateFeedbackkActionType.SUCCESS]: (
    state: FeedbackState,
    action: ActionBase,
  ): FeedbackState => {
    return {
      ...state,
      createFeedback: {
        ...state.createFeedback,
        data: action.payload,
        pending: false,
      },
    };
  },
  [FeedbackCreateFeedbackkActionType.FAILURE]: (
    state: FeedbackState,
    action: ActionBase,
  ): FeedbackState => {
    return {
      ...state,
      createFeedback: {
        ...state.createFeedback,
        pending: false,
        error: action.error,
      },
    };
  },

  [FeedbackCreateReportActionType.BEGIN]: (
    state: FeedbackState,
    action: ActionBase,
  ): FeedbackState => {
    return {
      ...state,
      createReport: {
        ...state.createReport,
        pending: true,
        error: null,
      },
    };
  },
  [FeedbackCreateReportActionType.SUCCESS]: (
    state: FeedbackState,
    action: ActionBase,
  ): FeedbackState => {
    return {
      ...state,
      createReport: {
        ...state.createReport,
        data: action.payload,
        pending: false,
      },
    };
  },
  [FeedbackCreateReportActionType.FAILURE]: (
    state: FeedbackState,
    action: ActionBase,
  ): FeedbackState => {
    return {
      ...state,
      createReport: {
        ...state.createReport,
        pending: false,
        error: action.error,
      },
    };
  },
};
