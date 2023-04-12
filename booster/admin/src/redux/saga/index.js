import { LocalStore } from "@app/utils/local-storage";
import { replace } from "connected-react-router";
import { envName } from "@app/configs";
import { call, put, select, takeLatest } from "@redux-saga/core/effects";
import { POST } from "@app/request";
import { AppConst } from "@app/redux/reducers";
import { removeLoading } from "@app/utils";

const getRouter = (state) => state.router;

function* profile() {
  return yield POST("/admin/getProfile");
}

function* loadUser() {
  const router = yield select(getRouter);
  const user = LocalStore.local.get(`${envName}-uuid`);

  const { data: statusOfProfile } = yield call(profile);

  if (!user || Object.values(user).length === 0) {
    yield put({
      type: AppConst.LOAD_PROFILE_SUCCESS,
      payload: statusOfProfile,
    });
    yield put({
      type: AppConst.LOAD_USER_ERROR,
    });

    removeLoading();
    yield redirectToAuth(statusOfProfile);
    return;
  }

  if (user && user?._id) {
    yield put({
      type: AppConst.LOAD_PROFILE_SUCCESS,
      payload: statusOfProfile,
    });
    yield put({
      type: AppConst.LOAD_USER_SUCCESS,
      payload: user,
    });
  } else {
    yield put({
      type: AppConst.LOAD_PROFILE_SUCCESS,
      payload: statusOfProfile,
    });
    yield put({
      type: AppConst.LOAD_USER_ERROR,
    });

    yield redirectToAuth(statusOfProfile);
  }

  removeLoading();
}

function* redirectToAuth(statusOfProfile) {
  if (statusOfProfile === 0) {
    yield put(replace("/signup"));
  } else if (statusOfProfile === 1) {
    yield put(replace("/login"));
  }
}

export default function* AppSaga() {
  yield takeLatest(AppConst.LOAD_USER, loadUser);
}
