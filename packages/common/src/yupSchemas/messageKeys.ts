const messagePrefix = `validation`;

const commonPrefix = `${messagePrefix}.common`;
export const commonMessageKey = {
  emptyValue: `${commonPrefix}.emptyValue`,
  birthday: `${commonPrefix}.birthday`,
};

const authenticationPrefix = `${messagePrefix}.authentication`;
export const authenticationMessageKey = {
  namePattern: `${authenticationPrefix}.namePattern`,
  nameLength: `${authenticationPrefix}.nameLength`,
  emailNotValid: `${authenticationPrefix}.emailNotValid`,
  agreementNotAgreed: `${authenticationPrefix}.agreementNotAgreed`,
  // passwordPattern: `${authenticationPrefix}.passwordPattern`,
  // passwordLength: `${authenticationPrefix}.passwordLength`,
  // passwordComplexity: `${authenticationPrefix}.passwordComplexity`,
  // passwordNotMatch: `${authenticationPrefix}.passwordNotMatch`,
};

const postPrefix = `${messagePrefix}.post`;
export const postMessageKey = {
  postContentTooLong: `${postPrefix}.postContentTooLong`,
  postContentTooShort: `${postPrefix}.postContentTooShort`,
  commentContentTooLong: `${postPrefix}.commentContentTooLong`,
  commentContentTooShort: `${postPrefix}.commentContentTooShort`,
  replyContentTooLong: `${postPrefix}.replyContentTooLong`,
  replyContentTooShort: `${postPrefix}.replyContentTooShort`,
};

const questionPrefix = `${messagePrefix}.question`;
export const questionMessageKey = {
  questionTitleLength: `${questionPrefix}.questionTitleLength`,
  questionContentLength: `${questionPrefix}.questionContentLength`,
  answerContentLength: `${questionPrefix}.answerContentLength`,
  answerCommentContentLength: `${questionPrefix}.commentContentLength`,
  answerCommentReplyContentLength: `${questionPrefix}.replyContentLength`,
};

const petPrefix = `${messagePrefix}.pet`;
export const petMessageKey = {
  petName: `${petPrefix}.petName`,
  petBio: `${petPrefix}.petBio`,
  arrivalDay: `${petPrefix}.arrivalDay`,
  breedId: `${petPrefix}.breedId`,
};
