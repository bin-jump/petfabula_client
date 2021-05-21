const messagePrefix = `validation`;

const commonPrefix = `${messagePrefix}.common`;
export const commonMessageKey = {
  emptyValue: `${commonPrefix}.emptyValue`,
};

const authenticationPrefix = `${messagePrefix}.authentication`;
export const authenticationMessageKey = {
  namePattern: `${authenticationPrefix}.namePattern`,
  emailNotValid: `${authenticationPrefix}.emailNotValid`,
  passwordPattern: `${authenticationPrefix}.passwordPattern`,
  // passwordLength: `${authenticationPrefix}.passwordLength`,
  // passwordComplexity: `${authenticationPrefix}.passwordComplexity`,
  passwordNotMatch: `${authenticationPrefix}.passwordNotMatch`,
  confirmTokenEmpty: `${authenticationPrefix}.confirmTokenEmpty`,
};
