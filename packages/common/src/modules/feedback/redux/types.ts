import { AsyncDataBase } from '../../shared';

type EntityType = 'POST' | 'QUESTION' | 'ANSWER';

export interface Feedback {
  id: number;
  content: string;
}

export interface FeedbackForm {
  content: string;
}

export interface ReportForm {
  entityId: number;
  entityType: string;
  reason: string;
}

export interface ReportResult {
  entityId: number;
  entityType: EntityType;
}

export interface FeedbackState {
  createFeedback: AsyncDataBase<Feedback>;
  createReport: AsyncDataBase<ReportResult>;
}
