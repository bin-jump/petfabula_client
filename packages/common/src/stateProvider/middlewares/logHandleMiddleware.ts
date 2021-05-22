import { MiddlewareAPI, Dispatch, Middleware, AnyAction } from 'redux';

export const logHandleMiddleware: Middleware<Dispatch> =
  ({ dispatch }: MiddlewareAPI) =>
  (next) =>
  (action: AnyAction) => {
    console.log('[Redux Action]: ', action);

    return next(action);
  };
