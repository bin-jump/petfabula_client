import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';
import { fork, all, spawn } from 'redux-saga/effects';
import rootReducer from './rootReducer';
import { authenticationRootSaga } from '../modules/authentication';
import { questionRootSaga, postRootSaga } from '../modules/community';
import { notificationRootSaga } from '../modules/notification';
import { petRootSaga, petRecordRootSaga } from '../modules/pet';
import { userRootSaga } from '../modules/user';
import { feedbackRootSaga } from '../modules/feedback';

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
    fork(notificationRootSaga),
    fork(petRootSaga),
    fork(petRecordRootSaga),
    fork(userRootSaga),
    fork(feedbackRootSaga),
  ]);
}

sagaMiddleware.run(rootSaga);

export type AppState = ReturnType<typeof rootReducer>;
export default store;
