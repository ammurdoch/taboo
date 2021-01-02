import React, { useEffect, useRef, useState } from 'react';
import { useQuery, gql, useApolloClient } from '@apollo/client';
import apolloClient from '../apollo-client';
import { SmileOutlined } from '@ant-design/icons';
import { Button, Space, Table, Typography, Tooltip, Result } from 'antd';
import Column from 'antd/lib/table/Column';

const { Title, Text } = Typography;

export const helloQuery = gql`
  query Hello {
    hello
  }
`;

function Payments() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refetches, setRefetches] = useState(0);
  const _refetches = useRef(-1);

  useEffect(() => {
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

  const pages = [];

  return (
    <div className="page">
      <div className="header">
        <Title style={{ margin: 0 }}>Payments</Title>
      </div>
      <Result icon={<SmileOutlined />} title="Coming Soon!" />
      {error && (
        <div className="ant-form-item-has-error" style={{ marginTop: 16 }}>
          <div className="ant-form-item-explain">{error}</div>
        </div>
      )}
      <style jsx>{`
        .page {
          flex: 1;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          flex-direction: column;
          padding-top: 10vh;
          padding-bottom: 10vh;
          padding-left: 10vw;
          padding-right: 10vw;
          position: relative;
        }
        @media screen and (max-width: 992px) {
          .page {
            padding-left: 5vw;
            padding-right: 5vw;
          }
        }
        @media screen and (max-width: 600px) {
          .page {
            padding-left: 16px;
            padding-right: 16px;
          }
        }
        .header {
          display: flex;
          justify-content: center;
          padding-top: 32px;
          padding-bottom: 32px;
        }
        .top-actions {
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          width: 100%;
        }
      `}</style>
    </div>
  );
}

export default Payments;
