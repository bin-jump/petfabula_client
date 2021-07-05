import * as yup from 'yup';
import { commonMessageKey, questionMessageKey } from './messageKeys';

export const validQuestionSchema = yup.object().shape({
  title: yup
    .string()
    .trim()
    .min(3, questionMessageKey.questionTitleLength)
    .max(50, questionMessageKey.questionTitleLength)
    .required(questionMessageKey.questionTitleLength),
  content: yup
    .string()
    .trim()
    .min(0, questionMessageKey.questionContentLength)
    .max(5000, questionMessageKey.questionContentLength),
});

export const validAnswerSchema = yup.object().shape({
  content: yup
    .string()
    .trim()
    .min(1, questionMessageKey.answerContentLength)
    .max(5000, questionMessageKey.answerContentLength)
    .required(commonMessageKey.emptyValue),
});

export const validAnswerCommentSchema = yup.object().shape({
  content: yup
    .string()
    .trim()
    .min(1, questionMessageKey.answerCommentContentLength)
    .max(240, questionMessageKey.answerCommentContentLength)
    .required(questionMessageKey.answerCommentContentLength),
});

export const validAnswerCommentReplySchema = yup.object().shape({
  content: yup
    .string()
    .trim()
    .min(1, questionMessageKey.answerCommentReplyContentLength)
    .max(240, questionMessageKey.answerCommentReplyContentLength)
    .required(questionMessageKey.answerCommentReplyContentLength),
});
