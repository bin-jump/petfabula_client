import { AsyncDataBase } from '../../shared';

export interface Document {
  id: number;
  documentKey: string;
  content: string;
}

export interface DocumentState {
  userAgreement: AsyncDataBase<Document>;
  privacyAgreement: AsyncDataBase<Document>;
}
