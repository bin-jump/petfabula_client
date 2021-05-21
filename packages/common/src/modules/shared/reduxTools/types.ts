export type ActionErrorType =
  | 'FAILED_ON_RESULT'
  | 'INVALID_FORM_DATA'
  | 'OTEHRS';

export interface AsyncActionError {
  type: ActionErrorType;
  message?: string;
  content?: any;
}

interface PendableEntityBase {
  pending: boolean;
  error: AsyncActionError | null;
}

export interface AsyncDataBase<T> extends PendableEntityBase {
  data: T | null;
}

export interface AsyncListBase<T> extends PendableEntityBase {
  data: Array<T>;
}

export interface AsyncCursorPageListBase<T> extends PendableEntityBase {
  data: Array<T>;
  hasMore: boolean;
  nextCursor: number | null;
  initializing: boolean;
}

export interface ReduxAsyncAction {
  BEGIN: string;
  SUCCESS: string;
  FAILURE: string;
}

export interface ActionBase {
  type: string;
  payload?: any;
  error?: AsyncActionError;
  extra?: any;
}
