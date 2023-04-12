export const AppConst = {
  LOAD_USER_SUCCESS: 'App/LOAD_USER_SUCCESS',
  LOAD_USER_ERROR: 'App/LOAD_USER_ERROR',
  LOAD_USER: 'App/LOAD_USER',
  LOAD_PROFILE_SUCCESS: 'App/LOAD_PROFILE_SUCCESS',
  LOAD_PROFILE: 'App/LOAD_PROFILE',
}

// The initial state of the App
export const initialState = {
  user: undefined,
  profile: 0
};

/* eslint-disable default-case, no-param-reassign */
const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case AppConst.LOAD_USER: return ({
      ...state,
    })

    case AppConst.LOAD_USER_SUCCESS: return ({
      ...state,
      user: action.payload,
    })

    case AppConst.LOAD_PROFILE_SUCCESS: return ({
      ...state,
      profile: action.payload,
    })

    case AppConst.LOAD_USER_ERROR: return ({
      ...state,
      user: undefined,
    })

    default: return ({
      ...state,
    })
  }
}

export default appReducer;
