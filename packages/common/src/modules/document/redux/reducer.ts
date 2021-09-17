import { createReducer, ActionBase } from '../../shared';
import { DocumentState } from './types';
import { documentReducer } from './documentHooks';

const initialStat: DocumentState = {
  userAgreement: { data: null, pending: false, error: null },
  privacyAgreement: { data: null, pending: false, error: null },
};

export const documentRootReducer = createReducer<DocumentState, ActionBase>(
  initialStat,
  { ...documentReducer },
);
