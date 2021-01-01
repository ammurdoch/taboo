import React, { useEffect, useRef, useState } from 'react';
import { useQuery, gql, useApolloClient } from '@apollo/client';
import apolloClient from '../apollo-client';

export const helloQuery = gql`
  query Hello {
    hello
  }
`;

function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refetches, setRefetches] = useState(0);
  const _refetches = useRef(-1);

  const pages = useEffect(() => {
    async function doAsyncStuff() {
      setLoading(true);
      try {
        const result = await apolloClient.query({
          query: helloQuery,
          fetchPolicy: 'network-only',
        });
        if (result && result.data && result.data.hello) {
          console.log('hello', result.data.hello);
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
  }, [refetches]);

  return <div>heyo</div>;
}

export default Dashboard;
