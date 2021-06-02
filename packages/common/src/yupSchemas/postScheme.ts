import * as yup from 'yup';
import { postMessageKey } from './messageKeys';

export const validPostSchema = yup.object().shape({
  content: yup
    .string()
    .trim()
    .min(1, postMessageKey.postContentTooShort)
    .max(10000, postMessageKey.postContentTooLong),
});

export const validPostCommentSchema = yup.object().shape({
  content: yup
    .string()
    .trim()
    .min(1, postMessageKey.commentContentTooShort)
    .max(240, postMessageKey.postContentTooLong)
    .required(postMessageKey.commentContentTooShort),
});

export const validPostCommentReplySchema = yup.object().shape({
  content: yup
    .string()
    .trim()
    .min(1, postMessageKey.replyContentTooShort)
    .max(240, postMessageKey.replyContentTooLong)
    .required(postMessageKey.replyContentTooShort),
});
