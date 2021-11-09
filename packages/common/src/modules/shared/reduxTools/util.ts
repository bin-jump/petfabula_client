import { put, call, takeEvery, takeLatest } from 'redux-saga/effects';
import { apiRequest, ApiResponse } from '../connection';
import {
  ReduxAsyncAction,
  AsyncActionError,
  ActionBase,
  AsyncCursorPageListBase,
} from './types';

export function createAsyncActionType(prefix: string): ReduxAsyncAction {
  return {
    BEGIN: `${prefix}_BEGIN`,
    SUCCESS: `${prefix}_SUCCESS`,
    FAILURE: `${prefix}_FAILURE`,
  };
}

export function createReducer<T, A extends ActionBase>(
  initialState: T,
  actionHandle: { [actionType: string]: (state: T, action: A) => T },
) {
  return (state: T | undefined, action: A): T => {
    if (!state) {
      return initialState;
    }

    if (action.type in actionHandle) {
      const s = actionHandle[action.type](state, action);
      return s;
    }
    return state;
  };
}

export const translateApiError = (response: ApiResponse): AsyncActionError => {
  let res: AsyncActionError = { type: 'OTEHRS' };
  // console.log('translateApiError', response);
  if (response.errors?.type == 'INVALID_FIELD') {
    res.type = 'INVALID_FORM_DATA';
    res.content = response.errors.fieldErrors;
  } else if (
    response.errors?.type == 'SERVICE_ERROR' ||
    response.errors?.type == 'SERVER_BUSY'
  ) {
    res.type = 'SERVICE_ERROR';
  } else if (response.errors?.type == 'NO_RESPONSE') {
    res.type = 'FAILED_ON_RESPONSE';
  } else if (response.errors?.type == 'LOGIN_REQUIRED') {
    res.type = 'AUTHENTICATION_REQUIRED';
  } else if (response.errors?.type == 'INVALID_OPERATION') {
    res.type = 'INVALID_OPERATION';
  } else if (response.errors?.type == 'RESOURCE_NOT_FOUND') {
    res.type = 'TARGET_NOT_FOUND';
    res.content = response.errors.entityId;
  }
  return res;
};

export function createSagaWatcher({
  url,
  method,
  asyncAction,
  watchType,
  disableAutoCusor,
  createUrl,
  createRequestPayload,
  successorPayload,
}: {
  url?: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  asyncAction: ReduxAsyncAction;
  watchType: 'LATEST' | 'EVERY';
  disableAutoCusor?: boolean;
  createUrl?: (payload: any) => string;
  createRequestPayload?: (payload: any) => any;
  successorPayload?: (payload: any) => any;
}) {
  const fn = function* sagaFunc(beginAction: ActionBase) {
    if (!url && !createUrl) {
      throw `url and urlFormater can not both be undefined`;
    }
    let requestUrl = createUrl
      ? createUrl(beginAction.payload)
      : (url as string);

    // add cursor
    if (beginAction.payload?.cursor && !disableAutoCusor) {
      const delimiter = requestUrl.indexOf('?') >= 0 ? '&' : '?';
      requestUrl = `${requestUrl}${delimiter}cursor=${beginAction.payload.cursor}`;
    }
    const requestData = createRequestPayload
      ? createRequestPayload(beginAction.payload)
      : beginAction.payload;

    const response: ApiResponse = yield call(apiRequest, {
      url: requestUrl,
      method,
      data: requestData,
    });

    if (response.success) {
      let successAction: ActionBase = {
        type: asyncAction.SUCCESS,
        message: response.message,
        payload: response.data,
        error: null,
        extra: beginAction.payload,
      };
      if (successorPayload) {
        successAction.extra = successorPayload(beginAction.payload);
      }
      yield put(successAction);
    } else {
      const failureAction: ActionBase = {
        type: asyncAction.FAILURE,
        message: response.message,
        payload: response?.data,
        error: translateApiError(response),
        extra: beginAction.payload,
      };
      yield put(failureAction);
    }
  };
  if (watchType == 'EVERY') {
    return function* watchLogout() {
      yield takeEvery(asyncAction.BEGIN, fn);
    };
  }
  return function* watchLogout() {
    yield takeLatest(asyncAction.BEGIN, fn);
  };
}

export const resolveResponseFormError = (err: AsyncActionError | null) => {
  if (!err || err.type != 'INVALID_FORM_DATA') {
    return {};
  }
  return err.content;
};

export const checkFailedResponse = (err: AsyncActionError | null) => {
  return err?.type == 'FAILED_ON_RESPONSE';
};

export const resolveTargetNotFoundError = (err: AsyncActionError | null) => {
  if (!err || err.type != 'TARGET_NOT_FOUND') {
    return null;
  }
  return err.content;
};

export const fillCursorResponseData = (
  state: AsyncCursorPageListBase<any>,
  successAction: ActionBase,
  resultCallback?: (arr: any) => any,
): AsyncCursorPageListBase<any> => {
  let arr = successAction.payload.result;
  if (resultCallback) {
    arr = resultCallback(arr);
  }
  return {
    ...state,
    data: successAction.extra?.cursor ? [...state.data, ...arr] : arr,
    hasMore: successAction.payload.hasMore,
    nextCursor: successAction.payload.nextCursor,
    initializing: false,
    pending: false,
  };
};
