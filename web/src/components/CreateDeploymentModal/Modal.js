import React, { useContext, useLayoutEffect, useRef, useState } from 'react';
import { Form, Input, Button, Checkbox, Typography, Card, Tooltip } from 'antd';
import {
  DownloadOutlined,
  MailOutlined,
  PrinterOutlined,
} from '@ant-design/icons';
import Modal from 'antd/lib/modal/Modal';
import CreateContent from './Content';
import * as firebase from 'firebase/app';
import { AuthContext } from '../../shared/auth-context';

const { Title, Text } = Typography;

const CreateDeploymentModal = ({ visible, setVisible }) => {
  const [loading, setLoading] = useState(false);
  const [showSucces, setShowSuccess] = useState(null);
  const [error, setError] = useState(null);
  const authContext = useContext(AuthContext);

  const handleCancel = (e) => {
    setVisible(false);
    setShowSuccess(null);
  };

  const handleCreate = async (values) => {
    setLoading(true);
    setError(null);
    const db = firebase.firestore();
    try {
      let shipmentDate = null;
      if (values.shipmentDate) {
        shipmentDate = values.shipmentDate.toISOString();
      }
      await db
        .collection('deployments')
        .doc(values.serialNo)
        .set({
          ...values,
          shipmentDate,
          createdBy: authContext.state.user.uid,
          updatedBy: authContext.state.user.uid,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      setShowSuccess('Deployment created!');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <>
      <Modal
        title="Create Deployment"
        visible={visible}
        onCancel={handleCancel}
        closable={!loading}
        destroyOnClose
        maskClosable={!loading}
        footer={
          showSucces
            ? [
                <Button key="done" onClick={handleCancel} disabled={loading}>
                  Done
                </Button>,
              ]
            : [
                <Button key="cancel" onClick={handleCancel} disabled={loading}>
                  Cancel
                </Button>,
                <Button
                  key="send"
                  type="primary"
                  loading={loading}
                  htmlType="submit"
                  form="createDeployment"
                >
                  Create
                </Button>,
              ]
        }
      >
        {!showSucces && (
          <CreateContent onSubmit={handleCreate} serverError={error} />
        )}
        {showSucces && (
          <div style={{ textAlign: 'center' }}>
            <Text>{showSucces}</Text>
          </div>
        )}
      </Modal>
      <style jsx>{``}</style>
      <style jsx global>{``}</style>
    </>
  );
};

export default CreateDeploymentModal;
