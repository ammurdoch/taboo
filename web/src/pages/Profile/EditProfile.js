import React, { useContext, useEffect, useRef, useState } from 'react';
import { useQuery, gql, useApolloClient } from '@apollo/client';
import apolloClient from '../../apollo-client';
import { ProfileOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Space, Typography, Form, Card, Input, DatePicker } from 'antd';
import Column from 'antd/lib/table/Column';
import { AuthContext } from '../../shared/auth-context';
import { useHistory } from 'react-router-dom';
import ProfilePic from './ProfilePic';

const { Title, Text } = Typography;

export const helloQuery = gql`
  query Hello {
    hello
  }
`;

const layout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 14 },
};
const tailLayout = {
  wrapperCol: { offset: 0, span: 24 },
};

function EditProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refetches, setRefetches] = useState(0);
  const _refetches = useRef(-1);
  const history = useHistory();
  const authContext = useContext(AuthContext);

  console.log('auth', authContext.state.user);

  const pages = [];

  return (
    <div className="page">
      <div className="header">
        <Title style={{ margin: 0 }}>Profile</Title>
      </div>
      {authContext.state.user && (
        <Card cover={<ProfilePic />}>
          <Form {...layout} style={{ width: 600 }}>
            <Form.Item
              label="Name"
              name="name"
              initialValue={authContext.state.user.name}
              rules={[{ required: true, message: 'Please enter your name' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              initialValue={authContext.state.user.email}
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
              label="Phone Number"
              name="phone"
              initialValue={authContext.state.user.phone}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Birthday"
              name="birthday"
              initialValue={authContext.state.user.birthday}
            >
              <DatePicker />
            </Form.Item>
            <Form.Item
              {...tailLayout}
              style={{ margin: 0, textAlign: 'center' }}
            >
              <Space>
                <Button
                  htmlType="button"
                  onClick={() => history.push('/profile')}
                >
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                  Save
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      )}
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
        .profile-img-container {
          width: 100%;
          text-align: center;
          padding: 16px;
          border-bottom: 1px solid #eeeeee;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .profile-img {
          width: 132px;
          height: 132px;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #f5f5f5;
          border-radius: 200px;
        }
      `}</style>
    </div>
  );
}

export default EditProfile;
