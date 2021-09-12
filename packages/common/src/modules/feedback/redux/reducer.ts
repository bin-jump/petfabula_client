import { createReducer, ActionBase } from '../../shared';
import { FeedbackState } from './types';
import { feedbackReducer } from './feedbackHooks';

const initialStat: FeedbackState = {
  createFeedback: { data: null, pending: false, error: null },
  createReport: { data: null, pending: false, error: null },
};

export const feedbackRootReducer = createReducer<FeedbackState, ActionBase>(
  initialStat,
  { ...feedbackReducer },
);
