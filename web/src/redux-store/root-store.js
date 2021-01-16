import { createStore, combineReducers, applyMiddleware } from 'redux';
import enUS from 'antd/es/locale/en_US';
import { authState, profile, SIGN_OUT } from './auth-store';
import thunk from 'redux-thunk';

const appReducer = combineReducers({
  authState,
  profile,
  locale: () => enUS,
});

const rootReducer = (state, action) => {
  console.log('state', state);
  if (action.type === SIGN_OUT) {
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

export default createStore(rootReducer, applyMiddleware(thunk));
