import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery, gql, useApolloClient } from '@apollo/client';
import { readBankAccountsAction } from '../../../redux-store/bank-accounts-store';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import apolloClient from '../../../apollo-client';

export const allBankAccountsQuery = gql`
  query AllBankAccounts($filters: BankAccountFilters) {
    allBankAccounts(filters: $filters) {
      edges {
        node {
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
    }
  }
`;

export function useBanksAccounts(filters) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refetches, setRefetches] = useState(0);
  const _refetches = useRef(-1);

  const dispatch = useDispatch();
  useEffect(() => {
    async function doAsyncStuff() {
      setLoading(true);
      try {
        const result = await apolloClient.query({
          query: allBankAccountsQuery,
          variables: {
            filters,
          },
          fetchPolicy: 'network-only',
        });
        if (
          result &&
          result.data &&
          result.data.allBankAccounts &&
          result.data.allBankAccounts.edges
        ) {
          dispatch(
            readBankAccountsAction(
              result.data.allBankAccounts.edges.map((edge) => edge.node),
            ),
          );
        }
      } catch (err) {
        setError(err.message);
      }
      _refetches.current = refetches;
      setLoading(false);
    }
    if (_refetches.current !== refetches) {
      doAsyncStuff();
    }
  }, [dispatch, filters, refetches]);

  const bankAccounts = useSelector(
    (store) =>
      Object.values(store.bankAccounts)
        .filter((b) => b)
        .sort((a, b) => a.label.localeCompare(b.label)),
    shallowEqual,
  );

  return {
    bankAccounts,
    loading,
    error,
    refetch: () => setRefetches(refetches + 1),
  };
}
