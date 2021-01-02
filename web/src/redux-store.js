import { createStore, combineReducers } from 'redux';
import enUS from 'antd/es/locale/en_US';

export const READ_PROFILE = 'READ_PROFILE';
export const UPDATE_PROFILE = 'UPDATE_PROFILE';
export const SIGN_OUT = 'SIGN_OUT';
export const AUTH_STATE_CHANGE = 'AUTH_STATE_CHANGE';

// eslint-disable-next-line no-shadow
export const readProfileAction = (profile) => ({
  type: READ_PROFILE,
  payload: {
    profile,
  },
});

// eslint-disable-next-line no-shadow
export const updateProfileAction = (profile) => ({
  type: UPDATE_PROFILE,
  payload: {
    profile,
  },
});

export const signOutAction = () => ({
  type: SIGN_OUT,
});

// eslint-disable-next-line no-shadow
export const authStateChangedAction = (profile) => ({
  type: AUTH_STATE_CHANGE,
  payload: {
    profile,
  },
});

const initialAuthState = {
  isLoading: true,
  isSignout: false,
};

function authState(state = initialAuthState, action) {
  switch (action.type) {
    case AUTH_STATE_CHANGE: {
      return {
        isLoading: false,
        isSignout: false,
      };
    }
    case SIGN_OUT:
      return {
        isLoading: true,
        isSignout: true,
      };
    default:
      return state;
  }
}

const initialProfile = null;

function profile(state = initialProfile, action) {
  switch (action.type) {
    case AUTH_STATE_CHANGE:
    case READ_PROFILE:
      return action.payload.profile;
    case UPDATE_PROFILE:
      return { ...state, ...action.payload.profile };
    default:
      return state;
  }
}

const appReducer = combineReducers({ authState, profile, locale: () => enUS });

const rootReducer = (state, action) => {
  if (action.type === SIGN_OUT) {
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

export default createStore(rootReducer);
