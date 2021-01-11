import firebase from 'firebase/app';

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
export const authStateChangedAction = (profile) => async (dispatch) => {
  dispatch({
    type: AUTH_STATE_CHANGE,
    payload: {
      profile,
    },
  });

  if (profile.profilePic && profile.profilePic.sm) {
    const storageRef = firebase.storage().ref();
    try {
      const profilePicUrl = await storageRef
        .child(profile.profilePic.sm.s3Key)
        .getDownloadURL();
      dispatch({
        type: AUTH_STATE_CHANGE,
        payload: {
          profile: { ...profile, profilePicUrl },
        },
      });
    } catch (err) {
      console.error(err);
    }
  }
};

const initialAuthState = {
  isLoading: true,
  isSignout: false,
};

export function authState(state = initialAuthState, action) {
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

export function profile(state = initialProfile, action) {
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
