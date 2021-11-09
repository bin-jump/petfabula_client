export type ActionErrorType =
  | 'AUTHENTICATION_REQUIRED'
  | 'FAILED_ON_RESPONSE'
  | 'SERVICE_ERROR'
  | 'INVALID_FORM_DATA'
  | 'INVALID_OPERATION'
  | 'TARGET_NOT_FOUND'
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
  nextCursor: object | null;
  initializing: boolean;
}

export interface ReduxAsyncAction {
  BEGIN: string;
  SUCCESS: string;
  FAILURE: string;
}

export interface ActionBase {
  type: string;
  message?: string | null;
  payload?: any;
  error: AsyncActionError | null;
  extra?: any;
}
