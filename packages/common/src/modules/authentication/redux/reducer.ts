import { createReducer, ActionBase } from '../../shared';
import { AuthenticationState } from './types';
import { loginReducer } from './loginHooks';
import { registerReducer } from './registerHooks';
import { checkLoginReducer } from './checkLoginHooks';

const initialStat: AuthenticationState = {
  // emailPassordLoginResult: { data: null, pending: false, error: null },
  emailCodeSendRegisterCodeResult: { data: null, pending: false, error: null },
  emailCodeRegisterAndLoginResult: { data: null, pending: false, error: null },
  emailCodeSendLoginCodeResult: { data: null, pending: false, error: null },
  emailCodeLoginResult: { data: null, pending: false, error: null },
  logoutResult: { data: null, pending: false, error: null },
  currentUser: { data: null, pending: false, error: null },
  oauthRegisterLoginResult: { data: null, pending: false, error: null },
};

export const authenticationRootReducer = createReducer<
  AuthenticationState,
  ActionBase
>(initialStat, { ...loginReducer, ...registerReducer, ...checkLoginReducer });
