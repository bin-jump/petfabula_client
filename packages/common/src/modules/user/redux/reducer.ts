import { createReducer, ActionBase } from '../../shared';
import { UserState } from './types';
import { accountReducer } from './accountHooks';
import { settingReducer } from './settingHooks';

const initialStat: UserState = {
  myAccount: { data: null, pending: false, error: null },
  updateAccount: { data: null, pending: false, error: null },
  cities: { data: [], pending: false, error: null },

  myNotifySetting: { data: null, pending: false, error: null },
  updateNotifySetting: { data: null, pending: false, error: null },
};

export const userRootReducer = createReducer<UserState, ActionBase>(
  initialStat,
  { ...accountReducer, ...settingReducer },
);
