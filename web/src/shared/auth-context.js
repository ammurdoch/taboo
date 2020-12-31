import * as firebase from 'firebase/app';
import * as React from 'react';
import { isEmptyChildren, isFunction } from './react-utils';

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

  const [state, setState] = React.useState(initialAuthState);

  React.useEffect(() => {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        const db = firebase.firestore();
        const doc = await db.collection('users').doc(user.uid).get();
        const profile = doc.data();
        console.log('authStateChange', user, profile);
        setState({
          isLoading: false,
          isSignout: false,
          user: {
            uid: user.uid,
            email: user.email,
            ...profile,
          },
        });
      } else {
        setState({
          isLoading: false,
          isSignout: false,
          user: null,
        });
      }
    });
  }, []);

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
        setState({
          ...state,
          isLoading: true,
          isSignout: true,
        });
        await firebase.auth().signOut();
      },
      signUp: async (values) => {
        const { email, password } = values;
        try {
          await firebase.auth().createUserWithEmailAndPassword(email, password);
        } catch (err) {
          console.log(err.code, err.message);
          return err.message;
        }
        return '';
      },
      state,
    }),
    [state],
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
