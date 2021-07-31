import { combineReducers } from 'redux';
import { authenticationRootReducer } from '../modules/authentication';
import { communityRootReducer } from '../modules/community';
import { notificationRootReducer } from '../modules/notification';

const rootReducer = combineReducers({
  authentication: authenticationRootReducer,
  community: communityRootReducer,
  notification: notificationRootReducer,
});

export default rootReducer;
