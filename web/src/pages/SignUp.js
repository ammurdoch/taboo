import React, { useEffect, useRef, useState } from 'react';
import firebase from 'firebase/app';
import {
  Form,
  Input,
  Button,
  Checkbox,
  Typography,
  Card,
  Tooltip,
  Spin,
} from 'antd';
import { useMutation, gql } from '@apollo/client';
import { generateUuid } from '../shared/utils';
import { useHistory } from 'react-router-dom';

const { Title, Text } = Typography;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const signUpMutation = gql`
  mutation SignUp($uid: ID!, $email: String!, $password: String!) {
    signUp(uid: $uid, email: $email, password: $password) {
      displayName
      email
    }
  }
`;

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [signUp] = useMutation(signUpMutation);
  const history = useHistory();

  const onFinish = async (values) => {
    setLoading(true);
    setServerError(null);
    try {
      const result = await signUp({
        variables: {
          uid: generateUuid(),
          ...values,
        },
      });
      history.push('/sign-in');
    } catch (err) {
      setServerError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="page qr-gen">
      <Title className="qr-gen-title">Taboo</Title>
      <Spin spinning={loading}>
        <Form
          {...layout}
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          className="signin-form"
        >
          <Title level={3}>Sign Up</Title>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please enter your email' },
              {
                type: 'email',
                message: 'Please enter a valid email (ex. aaron@gmail.com).',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button
              type="link"
              htmlType="button"
              onClick={() => history.push('/sign-in')}
            >
              Sign In
            </Button>
            <Button type="primary" htmlType="submit">
              Sign Up
            </Button>
          </Form.Item>
          {serverError && (
            <div
              className="server-error ant-form-item-has-error"
              style={{ marginTop: 16 }}
            >
              <div className="ant-form-item-explain">{serverError}</div>
            </div>
          )}
        </Form>
      </Spin>
      <style jsx>{`
        .page {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          padding-top: 10vh;
          padding-bottom: 10vh;
        }
        .subtitle {
          font-size: 24px;
        }
        .server-error {
          text-align: center;
        }
      `}</style>
      <style jsx global>{`
        .qr-gen-title {
          text-align: center;
        }
        .ant-form-item-explain,
        .ant-form-item-extra {
          padding-bottom: 8px;
        }
        .signin-form {
          width: 30vw;
        }
        @media screen and (max-width: 992px) {
          .signin-form {
            width: 60vw;
          }
        }
        @media screen and (max-width: 600px) {
          .signin-form {
            width: 100vw;
            padding: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default SignUp;
