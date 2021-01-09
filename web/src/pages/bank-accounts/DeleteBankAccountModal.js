import React, { useCallback } from 'react';
import YesNoModal from '../../components/YesNoModal';
import { useMutation, gql } from '@apollo/client';
import { deleteBankAccountAction } from '../../redux-store/bank-accounts-store';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { message } from 'antd';

const deleteBankAccountMutation = gql`
  mutation deleteBankAccount($id: ID!) {
    deleteBankAccount(id: $id)
  }
`;

function DeleteBankAccountModal({ bankAccount, setBankAccount }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteBankAccount] = useMutation(deleteBankAccountMutation);
  const dispatch = useDispatch();

  const onYes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await deleteBankAccount({
        variables: {
          id: bankAccount.id,
        },
      });
      dispatch(deleteBankAccountAction(bankAccount.id));
      message.success('Bank account deleted successfully');
      setBankAccount(null);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }, [bankAccount, deleteBankAccount, setBankAccount, dispatch]);

  const onNo = useCallback(() => {
    if (!loading) {
      setBankAccount(null);
    }
  }, [setBankAccount, loading]);

  return (
    <YesNoModal
      title="Delete Bank Account"
      question={`Are you sure you want to delete your bank account "${
        bankAccount && bankAccount.label
      }"?`}
      yesText="Delete"
      noText="Cancel"
      onYes={onYes}
      onNo={onNo}
      visible={!!bankAccount}
      loading={loading}
      error={error}
    />
  );
}

export default DeleteBankAccountModal;
