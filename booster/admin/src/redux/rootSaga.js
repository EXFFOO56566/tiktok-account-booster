import {all} from "redux-saga/effects";
import AppSaga from "@app/redux/saga";

export default function* rootSaga() {
  yield all([
    AppSaga(),
  ])
}

