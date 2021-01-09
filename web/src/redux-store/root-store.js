import { createStore, combineReducers } from 'redux';
import enUS from 'antd/es/locale/en_US';
import { authState, profile, SIGN_OUT } from './auth-store';
import { bankAccounts } from './bank-accounts-store';

const appReducer = combineReducers({
  authState,
  bankAccounts,
  profile,
  locale: () => enUS,
});

const rootReducer = (state, action) => {
  if (action.type === SIGN_OUT) {
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

export default createStore(rootReducer);
