import { MiddlewareAPI, Dispatch, Middleware, AnyAction } from 'redux';
import { LogoutActionType } from '../../modules/authentication/redux/actionTypes';
import { logoutHandler } from '../../modules/shared/connection';

export interface LogoutHandler {
  handle: () => void;
}

const logoutHandle: { instances: LogoutHandler[] } = {
  instances: [logoutHandler],
};

export const logoutHandleRegister = {
  register(handler: LogoutHandler) {
    if (logoutHandle.instances.indexOf(handler) < 0) {
      logoutHandle.instances.push(handler);
    }
  },
};

export const logoutHandleMiddleware: Middleware<Dispatch> =
  ({ dispatch }: MiddlewareAPI) =>
  (next) =>
  (action: AnyAction) => {
    const actionType = action.type as string;
    if (actionType == LogoutActionType.SUCCESS) {
      for (const h of logoutHandle.instances) {
        h.handle();
      }
    }

    return next(action);
  };
