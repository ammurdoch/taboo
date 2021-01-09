import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { message, Form, Input, Button, Typography, Spin, Space } from 'antd';
import useBankAccount from './use-bank-account';
import { useHistory, useParams } from 'react-router-dom';
import { useMutation, gql } from '@apollo/client';
import { LeftOutlined } from '@ant-design/icons';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import {
  createBankAccountAction,
  updateBankAccountAction,
} from '../../../redux-store/bank-accounts-store';
import useProfile from '../../Profile/use-profile';

const { Title, Text } = Typography;

const createBankAccountMutation = gql`
  mutation createBankAccount($bankAccount: BankAccountCreateInput!) {
    createBankAccount(bankAccount: $bankAccount) {
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

const updateBankAccountMutation = gql`
  mutation updateBankAccount($bankAccount: BankAccountUpdateInput!) {
    updateBankAccount(bankAccount: $bankAccount) {
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

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 12 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 12 },
};

const EditBankAccount = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { _id } = useParams();
  const [updateBankAccount] = useMutation(updateBankAccountMutation);
  const [createBankAccount] = useMutation(createBankAccountMutation);
  const history = useHistory();

  const bankAccountResult = useBankAccount(_id);
  const { bankAccount } = bankAccountResult;
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const profile = useProfile();

  const onSubmit = useCallback(
    async (values) => {
      setLoading(true);
      setError(null);
      try {
        if (bankAccount) {
          const { label } = values;
          const result = await updateBankAccount({
            variables: {
              bankAccount: {
                id: _id,
                label,
              },
            },
          });
          dispatch(updateBankAccountAction(result.data.updateBankAccount));
          message.success('Bank account updated successfully');
        } else {
          const result = await createBankAccount({
            variables: {
              bankAccount: {
                id: _id,
                owner: profile.uid,
                ...values,
              },
            },
          });
          dispatch(createBankAccountAction(result.data.createBankAccount));
          message.success('Bank account created successfully');
        }
        history.push('/bank-accounts');
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    },
    [
      bankAccount,
      createBankAccount,
      updateBankAccount,
      _id,
      history,
      dispatch,
      profile,
    ],
  );

  const nameInput = useRef(null);

  useLayoutEffect(() => {
    nameInput.current.focus();
  }, []);

  const onBack = useCallback(() => {
    history.goBack();
  }, [history]);

  useEffect(() => {
    if (bankAccount && !loading) {
      form.setFieldsValue(bankAccount);
    }
  }, [form, bankAccount, loading]);

  let pageTitle;
  let btnText;
  if (bankAccount) {
    pageTitle = 'Edit Bank Account';
    btnText = 'Update';
  } else {
    pageTitle = 'Connect a Bank Account';
    btnText = 'Submit';
  }

  return (
    <div className="bankAccount">
      <div className="header">
        <div className="header-col first">
          <Button
            type="text"
            key="cancel"
            onClick={onBack}
            icon={<LeftOutlined />}
          >
            Back
          </Button>
        </div>
        <div className="header-col" style={{ flex: 2 }}>
          <Title style={{ margin: 0 }}>{pageTitle}</Title>
        </div>
        <div className="header-col" />
      </div>
      <Spin spinning={loading || bankAccountResult.loading}>
        <Form
          name="bankAccount"
          onFinish={onSubmit}
          {...layout}
          id="editBankAccount"
          form={form}
        >
          <Form.Item
            label="Label"
            name="label"
            rules={[{ required: true, message: 'Please enter a label' }]}
            extra="e.g., Checking, Savings ..."
          >
            <Input ref={nameInput} />
          </Form.Item>
          <Form.Item
            label="Routing Number"
            name="routingNo"
            rules={[
              {
                required: !bankAccountResult.bankAccount,
                message: 'Please enter a routing number',
              },
              {
                pattern: /^\d{9}$/,
                message: 'Please enter a valid routing number.',
              },
            ]}
          >
            <Input disabled={!!bankAccountResult.bankAccount} />
          </Form.Item>
          <Form.Item
            label="Account Number"
            name="accountNo"
            rules={[
              {
                required: !bankAccountResult.bankAccount,
                message: 'Please enter an account number',
              },
              {
                pattern: /^\d{8,12}$/,
                message: 'Please enter a valid account number.',
              },
            ]}
          >
            <Input disabled={!!bankAccountResult.bankAccount} />
          </Form.Item>
          <div style={{ height: 16 }} />
          <Form.Item {...tailLayout}>
            <Space>
              <Button
                key="cancel"
                onClick={onBack}
                htmlType="button"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                key="send"
                type="primary"
                loading={loading}
                htmlType="submit"
              >
                {btnText}
              </Button>
            </Space>
          </Form.Item>
          {error && (
            <div
              className="server-error ant-form-item-has-error"
              style={{ marginTop: 16 }}
            >
              <div className="ant-form-item-explain">{error}</div>
            </div>
          )}
        </Form>
      </Spin>
      <style jsx>{`
        .bankAccount {
          flex: 1;
          display: flex;
          justify-content: flex-start;
          align-items: stretch;
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
        .header-col {
          flex: 1;
          text-align: center;
        }
        .header-col.first {
          text-align: left;
        }
      `}</style>
      <style jsx global>{``}</style>
    </div>
  );
};

export default EditBankAccount;
