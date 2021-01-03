import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useMutation, gql } from '@apollo/client';
import apolloClient from '../../apollo-client';
import { ProfileOutlined, UserOutlined } from '@ant-design/icons';
import {
  Button,
  Space,
  Typography,
  Form,
  Card,
  Input,
  DatePicker,
  Spin,
  message,
} from 'antd';
import { AuthContext } from '../../shared/auth-context';
import { useHistory } from 'react-router-dom';
import ProfilePic from './ProfilePic';
import moment from 'moment';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { readProfileAction, updateProfileAction } from '../../redux-store';

const { Title, Text } = Typography;

export const updateProfileMutation = gql`
  mutation UpdateProfile($profile: UpdateProfileInput!) {
    updateProfile(profile: $profile) {
      uid
      name
      email
      phoneNumber
      birthday
      profilePicUrl
      createdBy
      updatedBy
      createdAt
      updatedAt
    }
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
  const history = useHistory();
  const authContext = useContext(AuthContext);
  const [updateProfile] = useMutation(updateProfileMutation);
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    setLoading(true);
    setError(null);
    try {
      const { phoneNumber, ...otherValues } = values;
      let standardPhone;
      if (!phoneNumber.startsWith('+') && phoneNumber.length === 10) {
        standardPhone = `+1${phoneNumber}`;
      } else {
        standardPhone = phoneNumber;
      }
      const result = await updateProfile({
        variables: {
          profile: {
            uid: authContext.state.user.uid,
            phoneNumber: standardPhone,
            ...otherValues,
          },
        },
      });
      dispatch(updateProfileAction(result.data.updateProfile));
      message.success('Profile successfully updated');
      history.push('/profile');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const locale = useSelector((store) => store.locale, shallowEqual);

  const user = useMemo(() => {
    return authContext.state.user;
  }, [authContext.state.user]);

  return (
    <div className="page">
      <div className="header">
        <Title style={{ margin: 0 }}>Profile</Title>
      </div>
      {authContext.state.user && (
        <Spin spinning={loading}>
          <Card cover={<ProfilePic />}>
            <Form {...layout} style={{ width: 600 }} onFinish={onFinish}>
              <Form.Item
                label="Name"
                name="name"
                initialValue={user.name}
                rules={[{ required: true, message: 'Please enter your name' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email"
                initialValue={user.email}
                rules={[
                  { required: true, message: 'Please enter your email' },
                  {
                    type: 'email',
                    message:
                      'Please enter a valid email (ex. aaron@gmail.com).',
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Phone Number"
                name="phoneNumber"
                initialValue={user.phoneNumber}
                rules={[
                  {
                    pattern: /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
                    message:
                      'Please enter a valid phone number (ex. 5124026225).',
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Birthday"
                name="birthday"
                initialValue={user.birthday && moment(user.birthday)}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  locale={locale}
                  defaultPickerValue={moment('2000-01-01')}
                />
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
        </Spin>
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
