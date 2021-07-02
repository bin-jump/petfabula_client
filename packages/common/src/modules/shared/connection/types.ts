// const Errors = {
//   NO_CONNECTION: 'NO_CONNECTION',
//   INVALID_FIELD: 'INVALID_FIELD',
//   SERVER_BUSY: 'SERVER_BUSY',
//   LOGIN_REQUIRED: 'LOGIN_REQUIRED',
//   PREMISSION_REQUIRED: 'PREMISSION_REQUIRED',
//   SERVER_ERROR: 'SERVER_ERROR',
//   UNKNOWN: 'UNKNOWN',
// };

export type ApiErrorType =
  | 'NO_CONNECTION'
  | 'INVALID_FIELD'
  | 'SERVER_BUSY'
  | 'SERVICE_ERROR'
  | 'LOGIN_REQUIRED'
  | 'PREMISSION_REQUIRED'
  | 'NO_RESPONSE'
  | 'UNKNOWN';

export interface ResponseError {
  type: ApiErrorType;
  fieldErrors?: { [key: string]: string };
}

export interface ApiResponse {
  success: boolean;
  code: number;
  data: any;
  message: string | null;
  errors?: ResponseError;
}
