import { createAsyncActionType } from '../../shared';

export const LoadMyAccountActionType = createAsyncActionType(
  'USER_LOAD_MY_ACCOUNT',
);

export const UpdateMyAccountActionType = createAsyncActionType(
  'USER_UPDATE_MY_ACCOUNT',
);

export const LoadCitiesActionType = createAsyncActionType('USER_LOAD_CITIES');

export const LoadNotificationSettingActionType = createAsyncActionType(
  'USER_LOAD_NOTIFICATION_SETTING',
);

export const UpdateNotificationSettingActionType = createAsyncActionType(
  'USER_UPDATE_NOTIFICATION_SETTING',
);
