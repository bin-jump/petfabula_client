import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';
import { fork, all, spawn } from 'redux-saga/effects';
import rootReducer from './rootReducer';
import { authenticationRootSaga } from '../modules/authentication';
import { communityRootSaga } from '../modules/community';

import { logHandleMiddleware } from './middlewares/logHandleMiddleware';

const sagaMiddleware = createSagaMiddleware();

const middlewares = [logHandleMiddleware, sagaMiddleware];

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(...middlewares)),
);

function* rootSaga() {
  yield all([fork(authenticationRootSaga), fork(communityRootSaga)]);
}

sagaMiddleware.run(rootSaga);

export type AppState = ReturnType<typeof rootReducer>;
export default store;
