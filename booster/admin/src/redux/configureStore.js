import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';
import { routerMiddleware } from 'connected-react-router';
import createReducer from './reducer';
import rootSaga from '@app/redux/rootSaga';
import history from "@app/utils/history";

const configureStore = (initialState = {}) => {
  let composeEnhancers = compose;
  const reduxSagaMonitorOptions = {};

  if (process.env.NODE_ENV !== 'production' && typeof window === 'object') {
    /* eslint-disable no-underscore-dangle */
    if (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__)
      composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({});
  }

  const sagaMiddleware = createSagaMiddleware(reduxSagaMonitorOptions);
  const middlewares = [sagaMiddleware, routerMiddleware(history)];

  if (process.env.NODE_ENV === 'development') {
    const reduxLoggerMiddleWare = createLogger({
      stateTransformer: state => (state.toJS ? state.toJS() : state),
      timestamp: false,
      logErrors: false,
      collapsed: (getState, action, logEntry) => logEntry, // don't lapse if error
    });

    middlewares.push(reduxLoggerMiddleWare);
  }

  const enhancers = [applyMiddleware(...middlewares)];

  const store = createStore(
    createReducer(),
    initialState,
    composeEnhancers(...enhancers),
  );

  // Extensions
  store.runSaga = sagaMiddleware.run(rootSaga);

  return store;
}

export default configureStore()