import { combineReducers } from 'redux';
import { authenticationRootReducer } from '../modules/authentication';
import { communityRootReducer } from '../modules/community';

const rootReducer = combineReducers({
  authentication: authenticationRootReducer,
  community: communityRootReducer,
});

export default rootReducer;
