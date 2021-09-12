const messagePrefix = `validation`;

const commonPrefix = `${messagePrefix}.common`;
export const commonMessageKey = {
  emptyValue: `${commonPrefix}.emptyValue`,
  birthday: `${commonPrefix}.birthday`,
  validType: `${commonPrefix}.validType`,
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

const userPrefix = `${messagePrefix}.user`;
export const userMessageKey = {
  userName: `${userPrefix}.userName`,
  userBio: `${userPrefix}.userBio`,
};

const petPrefix = `${messagePrefix}.pet`;
export const petMessageKey = {
  petName: `${petPrefix}.petName`,
  petBio: `${petPrefix}.petBio`,
  arrivalDay: `${petPrefix}.arrivalDay`,
  breedId: `${petPrefix}.breedId`,
  petSelect: `${petPrefix}.petSelect`,

  recordDate: `${petPrefix}.recordDate`,
  recordNote: `${petPrefix}.recordNote`,
  feedAmount: `${petPrefix}.feedAmount`,
  foodContent: `${petPrefix}.foodContent`,

  weight: `${petPrefix}.weight`,

  disorderContent: `${petPrefix}.disorderContent`,

  eventType: `${petPrefix}.eventType`,
  eventContent: `${petPrefix}.eventContent`,

  hospitalName: `${petPrefix}.hospitalName`,
  symptom: `${petPrefix}.symptom`,
  diagnosis: `${petPrefix}.diagnosis`,
  treatment: `${petPrefix}.treatment`,
};

const feedbackPrefix = `${messagePrefix}.feedback`;
export const feedbackMessageKey = {
  feedbackContent: `${feedbackPrefix}.feedbackContent`,
  reportReason: `${feedbackPrefix}.reportReason`,
};
