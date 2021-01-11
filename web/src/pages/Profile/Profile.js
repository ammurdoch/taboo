import React, { useContext, useEffect, useRef, useState } from 'react';
import { useQuery, gql, useApolloClient } from '@apollo/client';
import apolloClient from '../../apollo-client';
import { ProfileOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Space, Table, Typography, Tooltip, Form, Card } from 'antd';
import Column from 'antd/lib/table/Column';
import { AuthContext } from '../../shared/auth-context';
import { useHistory } from 'react-router-dom';
import ProfilePic from './ProfilePic';
import { useSelector, shallowEqual } from 'react-redux';
import useProfile from './use-profile';

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

function Profile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const history = useHistory();

  const authContext = useContext(AuthContext);
  const profile = useProfile();

  const locale = useSelector((store) => store.locale, shallowEqual);

  return (
    <div className="page">
      <div className="header">
        <Title style={{ margin: 0 }}>Profile</Title>
      </div>
      <Card cover={<ProfilePic profile={profile} />}>
        <Form {...layout} style={{ width: 600 }}>
          <Form.Item label="Name">
            <Text>{profile.displayName}</Text>
          </Form.Item>
          <Form.Item label="Email">
            <Text>{profile.email}</Text>
          </Form.Item>
          <Form.Item label="Phone Number">
            <Text>{profile.phoneNumber}</Text>
          </Form.Item>
          <Form.Item label="Birthday">
            {profile.birthday && (
              <Text>
                {Intl.DateTimeFormat(locale).format(new Date(profile.birthday))}
              </Text>
            )}
          </Form.Item>
          <Form.Item {...tailLayout} style={{ margin: 0, textAlign: 'center' }}>
            <Button
              type="primary"
              htmlType="button"
              onClick={() => history.push('/profile/edit')}
            >
              Edit Profile
            </Button>
          </Form.Item>
        </Form>
      </Card>
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
        .profile-img {
          width: 100%;
          text-align: center;
          padding: 32px;
          background: #eeeeee;
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

export default Profile;
