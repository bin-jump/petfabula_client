import { combineReducers } from 'redux';
import { authenticationRootReducer } from '../modules/authentication';
import { communityRootReducer } from '../modules/community';
import { notificationRootReducer } from '../modules/notification';
import { petRootReducer } from '../modules/pet';
import { userRootReducer } from '../modules/user';

const rootReducer = combineReducers({
  authentication: authenticationRootReducer,
  community: communityRootReducer,
  notification: notificationRootReducer,
  pet: petRootReducer,
  user: userRootReducer,
});

export default rootReducer;
