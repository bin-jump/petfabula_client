import { MiddlewareAPI, Dispatch, Middleware, AnyAction } from 'redux';
import { ActionBase, ReduxAsyncAction } from '../../modules/shared';
import { LogoutActionType } from '../../modules/authentication/redux/actionTypes';
import { NotificationCheckActionType } from '../../modules/notification/redux/actionTypes';

// const SILENT_FAILURE_ACTIONS: ReduxAsyncAction[] = [NotificationCheckActionType];

const slientFailureActionTypes = new Set(NotificationCheckActionType.FAILURE);

interface ToastHandler {
  handleSuccess?: (msg: string) => void;
  handleFailure?: (msg: string) => void;
  handleError?: (msg: string) => void;
}

const handler: ToastHandler = {};

export const registerToastHandler = ({
  handleSuccess,
  handleFailure,
}: {
  handleSuccess?: (msg: string) => void;
  handleFailure?: (msg: string) => void;
}) => {
  handler.handleSuccess = handleSuccess;
  handler.handleFailure = handleFailure;
};

export const toastHandleMiddleware: Middleware<Dispatch> =
  ({ dispatch }: MiddlewareAPI) =>
  (next) =>
  (action: AnyAction) => {
    const actionBase = action as ActionBase;
    //   if (actionBase.error?.type) {

    //   }
    const message = actionBase.message;
    if (actionBase.type.endsWith('SUCCESS') && handler.handleSuccess) {
      if (message) {
        handler.handleSuccess(message);
      }
    }

    if (
      actionBase.type.endsWith('FAILURE') &&
      handler.handleFailure &&
      !slientFailureActionTypes.has(action.type as string)
    ) {
      if (actionBase.error?.type == 'FAILED_ON_RESPONSE') {
        handler.handleFailure('error.noNetwork');
      } else if (actionBase.error?.type == 'SERVICE_ERROR') {
        handler.handleFailure('error.serviceError');
      } else if (actionBase.error?.type == 'AUTHENTICATION_REQUIRED') {
        handler.handleFailure('error.authenticationRequired');
        // force logout out of dated login state
        dispatch({ type: LogoutActionType.SUCCESS });
      } else if (message) {
        handler.handleFailure(message);
      }
    }

    return next(action);
  };
