import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import history from '@app/utils/history';
import appReducer from "@app/redux/reducers";

export default function createReducer(injectedReducers = {}) {
  return combineReducers({
    router: connectRouter(history),
    global: appReducer,
  });
};
