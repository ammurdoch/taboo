import React, { useLayoutEffect, useRef, useState } from 'react';
import { Form, Input, Button, Checkbox, Typography, Card, Tooltip } from 'antd';
import {
  DownloadOutlined,
  MailOutlined,
  PrinterOutlined,
} from '@ant-design/icons';
import Modal from 'antd/lib/modal/Modal';
import firebase from 'firebase/app';

const { Title, Text } = Typography;

const DeleteDeploymentModal = ({ deleting, setDeleting }) => {
  const [loading, setLoading] = useState(false);
  const [showSucces, setShowSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleCancel = (e) => {
    setDeleting(null);
    setShowSuccess(null);
  };

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    const db = firebase.firestore();
    try {
      await db.collection('deployments').doc(deleting).delete();
      setShowSuccess(`Deployment "${deleting}" deleted!`);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <>
      <Modal
        title="Delete Deployment"
        visible={!!deleting}
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
                  key="delete"
                  type="primary"
                  loading={loading}
                  onClick={handleDelete}
                >
                  Delete
                </Button>,
              ]
        }
      >
        {!showSucces && (
          <div style={{ textAlign: 'center' }}>
            <Text>{`Are you sure you want to delete the deployment "${deleting}"?`}</Text>
          </div>
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

export default DeleteDeploymentModal;
