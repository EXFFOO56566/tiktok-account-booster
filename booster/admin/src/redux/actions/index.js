import {AppConst} from "@app/redux/reducers";

export const loadUser = () => {
  return {
    type: AppConst.LOAD_USER,
  };
}