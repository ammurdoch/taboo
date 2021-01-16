import React, { useContext, useEffect, useRef, useState } from 'react';
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
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../shared/auth-context';

const { Title, Text } = Typography;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);
  const authContext = useContext(AuthContext);
  const history = useHistory();

  return (
    <div className="page qr-gen">
      <Title className="qr-gen-title">Taboo</Title>
      <Spin spinning={loading}>
        <Text>Build your game here</Text>
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

export default Home;
