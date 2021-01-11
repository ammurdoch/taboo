import firebase from 'firebase/app';
import * as React from 'react';
import { isEmptyChildren, isFunction } from './react-utils';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  authStateChangedAction,
  signOutAction,
} from '../redux-store/auth-store';
import { useHistory } from 'react-router-dom';
import fetchProfile from './fetch-profile';

const initialAuthState = {
  isLoading: true,
  isSignout: false,
  user: null,
};

export const AuthContext = React.createContext({
  signIn: async () => '',
  signOut: () => null,
  signUp: async () => '',
  state: initialAuthState,
});

export const AuthContextProvider = (props) => {
  const { component, children } = props;

  const dispatch = useDispatch();
  const authState = useSelector((store) => store.authState, shallowEqual);
  const currentUser = useSelector((store) => store.profile, shallowEqual);
  const state = React.useMemo(
    () => ({
      ...authState,
      user: currentUser,
    }),
    [authState, currentUser],
  );

  React.useEffect(() => {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        const profile = await fetchProfile();
        console.log('user', profile);
        dispatch(authStateChangedAction(profile));
      } else {
        dispatch(authStateChangedAction(null));
      }
    });
  }, [dispatch]);

  const authContext = React.useMemo(
    () => ({
      signIn: async (values) => {
        const { email, password } = values;
        try {
          await firebase.auth().signInWithEmailAndPassword(email, password);
        } catch (err) {
          console.log(err.code, err.message);
          return err.message;
        }
        return '';
      },
      signOut: async () => {
        dispatch(signOutAction());
        await firebase.auth().signOut();
      },
      state,
    }),
    [state, dispatch],
  );

  return (
    <AuthContext.Provider value={authContext}>
      {component
        ? React.createElement(component, authContext)
        : children // children come last, always called
        ? isFunction(children)
          ? children(authContext)
          : !isEmptyChildren(children)
          ? React.Children.only(children)
          : null
        : null}
    </AuthContext.Provider>
  );
};
