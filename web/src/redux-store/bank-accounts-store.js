export const READ_BANK_ACCOUNTS = 'READ_BANK_ACCOUNTS';
export const CREATE_BANK_ACCOUNT = 'CREATE_BANK_ACCOUNT';
export const UPDATE_BANK_ACCOUNT = 'UPDATE_BANK_ACCOUNT';
export const DELETE_BANK_ACCOUNT = 'DELETE_BANK_ACCOUNT';

// eslint-disable-next-line no-shadow
export const readBankAccountsAction = (bankAccounts) => ({
  type: READ_BANK_ACCOUNTS,
  payload: {
    bankAccounts,
  },
});

export const createBankAccountAction = (bankAccount) => ({
  type: CREATE_BANK_ACCOUNT,
  payload: {
    bankAccount,
  },
});

export const updateBankAccountAction = (bankAccount) => ({
  type: UPDATE_BANK_ACCOUNT,
  payload: {
    bankAccount,
  },
});

export const deleteBankAccountAction = (bankAccountId) => ({
  type: UPDATE_BANK_ACCOUNT,
  payload: {
    bankAccountId,
  },
});

const initialBankAccounts = [];

export function bankAccounts(state = initialBankAccounts, action) {
  switch (action.type) {
    case READ_BANK_ACCOUNTS: {
      const newState = { ...state };
      action.payload.bankAccounts.forEach((p) => {
        newState[p._id] = p;
      });
      return newState;
    }
    case CREATE_BANK_ACCOUNT:
      return {
        ...state,
        [action.payload.bankAccount.id]: action.payload.bankAccount,
      };
    case UPDATE_BANK_ACCOUNT:
      return {
        ...state,
        [action.payload.bankAccount.id]: action.payload.bankAccount,
      };
    case DELETE_BANK_ACCOUNT: {
      const { bankAccountId } = action.payload;
      return { ...state, [bankAccountId]: undefined };
    }
    default:
      return state;
  }
}
