import { combineReducers } from 'redux';
import { authenticationRootReducer } from '../modules/authentication';
import { communityRootReducer } from '../modules/community';
import { notificationRootReducer } from '../modules/notification';
import { petRootReducer } from '../modules/pet';
import { userRootReducer } from '../modules/user';
import { LogoutActionType } from '../modules/authentication/redux/actionTypes';

const appReducer = combineReducers({
  authentication: authenticationRootReducer,
  community: communityRootReducer,
  notification: notificationRootReducer,
  pet: petRootReducer,
  user: userRootReducer,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === LogoutActionType.SUCCESS) {
    return appReducer(undefined, action);
  }

  return appReducer(state, action);
};

// const rootReducer = combineReducers({
//   authentication: authenticationRootReducer,
//   community: communityRootReducer,
//   notification: notificationRootReducer,
//   pet: petRootReducer,
//   user: userRootReducer,
// });

export default rootReducer;
