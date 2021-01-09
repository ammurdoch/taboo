import { useQuery, gql } from '@apollo/client';
import { useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { updateBankAccountAction } from '../../../redux-store/bank-accounts-store';

const bankAccountQuery = gql`
  query BankAccount($id: ID!) {
    bankAccount(id: $id) {
      id
      owner
      label
      verificationStatus
      createdBy
      updatedBy
      createdAt
      updatedAt
    }
  }
`;

export default function useBankAccounts(_id) {
  const { loading, error, data } = useQuery(bankAccountQuery, {
    variables: {
      id: _id,
    },
  });

  const dispatch = useDispatch();
  useEffect(() => {
    if (data && data.bankAccount) {
      dispatch(updateBankAccountAction(data.bankAccount));
    }
  }, [data, dispatch]);

  const bankAccount = useSelector(
    (store) => store.bankAccounts[_id],
    shallowEqual,
  );

  return {
    bankAccount,
    loading,
    error,
  };
}
