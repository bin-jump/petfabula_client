const messagePrefix = `validation`;

const commonPrefix = `${messagePrefix}.common`;
export const commonMessageKey = {
  emptyValue: `${commonPrefix}.emptyValue`,
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
