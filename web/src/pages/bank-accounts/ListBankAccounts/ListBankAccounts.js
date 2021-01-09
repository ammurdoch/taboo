import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Space, Table, Typography, Tooltip } from 'antd';
import Column from 'antd/lib/table/Column';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import settings from '../../../settings';
import { generateUuid } from '../../../shared/utils';
import { useBanksAccounts } from './use-banks-accounts';
import { shallowEqual, useSelector } from 'react-redux';
import DeleteBankAccountModal from '../DeleteBankAccountModal';

const { Title, Text } = Typography;

function ListBanksAccounts() {
  const history = useHistory();
  const [pagination, setPagination] = useState({
    current: 1,
    bankAccountSize: settings.bankAccountSize,
  });
  const [deleting, setDeleting] = useState(null);

  const { loading, error, refetch, bankAccounts } = useBanksAccounts({});

  const handleTableChange = useCallback((params) => {
    setPagination({
      ...params.pagination,
    });
  }, []);

  const handleCreate = useCallback(() => {
    const bankAccountId = generateUuid();
    history.push(`bank-account/edit/${bankAccountId}`);
  }, [history]);

  const locale = useSelector((store) => store.locale, shallowEqual);

  return (
    <div className="bankAccount">
      <div className="header">
        <Title style={{ margin: 0 }}>Banks Accounts</Title>
      </div>
      <div className="top-actions">
        <Space>
          <Button onClick={() => refetch()}>Refetch!</Button>
          <Button type="primary" onClick={handleCreate} icon={<PlusOutlined />}>
            Create Bank Account
          </Button>
        </Space>
      </div>
      <Table
        dataSource={bankAccounts}
        loading={loading}
        pagination={{ ...pagination, total: bankAccounts.length }}
        onChange={handleTableChange}
        style={{ width: '100%' }}
        rowKey="id"
      >
        <Column title="Label" dataIndex="label" key="label" />
        <Column
          title="Created"
          dataIndex="createdAt"
          render={(text, record) =>
            Intl.DateTimeFormat(locale).format(new Date(record.createdAt))
          }
        />
        <Column
          title="Action"
          key="action"
          render={(text, record) => (
            <Space size="middle">
              {/* <Tooltip title="View">
                <Button
                  onClick={() => history.push(`/deployment/${record.serialNo}`)}
                  icon={<EyeOutlined />}
                />
              </Tooltip> */}
              <Tooltip title="Edit">
                <Button
                  onClick={() =>
                    history.push(`/bank-account/edit/${record.id}`)
                  }
                  icon={<EditOutlined />}
                />
              </Tooltip>
              <Tooltip title="Delete">
                <Button
                  onClick={() => setDeleting(record)}
                  icon={<DeleteOutlined />}
                />
              </Tooltip>
            </Space>
          )}
        />
      </Table>
      <DeleteBankAccountModal
        setBankAccount={setDeleting}
        bankAccount={deleting}
      />
      {error && (
        <div className="ant-form-item-has-error" style={{ marginTop: 16 }}>
          <div className="ant-form-item-explain">{error}</div>
        </div>
      )}
      <style jsx>{`
        .bankAccount {
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
          .bankAccount {
            padding-left: 5vw;
            padding-right: 5vw;
          }
        }
        @media screen and (max-width: 600px) {
          .bankAccount {
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

export default ListBanksAccounts;
