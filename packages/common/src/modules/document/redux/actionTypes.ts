import { createAsyncActionType } from '../../shared';

export const LoadUserAgreementActionType = createAsyncActionType(
  'DOCUMENT_LOAD_USER_AGREEMENT',
);

export const LoadPrivacyAgreementActionType = createAsyncActionType(
  'DOCUMENT_LOAD_PRIVACY_AGREEMENT',
);
