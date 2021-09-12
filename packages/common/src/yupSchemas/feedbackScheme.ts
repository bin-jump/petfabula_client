import * as yup from 'yup';
import { feedbackMessageKey, commonMessageKey } from './messageKeys';

export const validReportSchema = yup.object().shape({
  reason: yup
    .string()
    .trim()
    .min(10, feedbackMessageKey.reportReason)
    .max(500, feedbackMessageKey.reportReason),
});

export const validFeedbackSchema = yup.object().shape({
  content: yup
    .string()
    .trim()
    .min(10, feedbackMessageKey.feedbackContent)
    .max(240, feedbackMessageKey.feedbackContent),
});
