import { combineReducers } from 'redux';
import { authenticationRootReducer } from '../modules/authentication';

const rootReducer = combineReducers({
  authentication: authenticationRootReducer,
});

export default rootReducer;
