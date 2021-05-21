import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';
import { fork, all, spawn } from 'redux-saga/effects';
import rootReducer from './rootReducer';

const sagaMiddleware = createSagaMiddleware();

const middlewares = [sagaMiddleware];

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(...middlewares)),
);

function* rootSaga() {
  yield all([]);
}

sagaMiddleware.run(rootSaga);

export type AppState = ReturnType<typeof rootReducer>;
export default store;
