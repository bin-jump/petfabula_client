import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';
import { fork, all, spawn } from 'redux-saga/effects';
import rootReducer from './rootReducer';
import { authenticationRootSaga } from '../modules/authentication';
import { questionRootSaga, postRootSaga } from '../modules/community';

import { logHandleMiddleware } from './middlewares/logHandleMiddleware';
import { toastHandleMiddleware } from './middlewares/toastHandleMiddleware';
import { loginAssertMiddleware } from './middlewares/loginAssertMiddleware';

const sagaMiddleware = createSagaMiddleware();

const middlewares = [
  logHandleMiddleware,
  loginAssertMiddleware,
  toastHandleMiddleware,
  sagaMiddleware,
];

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(...middlewares)),
);

function* rootSaga() {
  yield all([
    fork(authenticationRootSaga),
    fork(postRootSaga),
    fork(questionRootSaga),
  ]);
}

sagaMiddleware.run(rootSaga);

export type AppState = ReturnType<typeof rootReducer>;
export default store;
