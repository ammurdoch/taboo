import React, { useContext, useLayoutEffect, useRef, useState } from 'react';
import { Form, Input, Button, Typography, Card, Tooltip, Spin } from 'antd';
import {
  DownloadOutlined,
  MailOutlined,
  PrinterOutlined,
} from '@ant-design/icons';
import Modal from 'antd/lib/modal/Modal';
import EditContent from './Content';
import * as firebase from 'firebase/app';
import { AuthContext } from '../../shared/auth-context';

const { Title, Text } = Typography;

const EditDeploymentModel = ({ editing, setEditing }) => {
  const [loading, setLoading] = useState(false);
  const [showSucces, setShowSuccess] = useState(null);
  const [error, setError] = useState(null);
  const authContext = useContext(AuthContext);

  const handleCancel = (e) => {
    setEditing(null);
    setShowSuccess(null);
  };

  const handleEdit = async (values) => {
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
        .doc(editing)
        .update({
          ...values,
          shipmentDate,
          updatedBy: authContext.state.user.uid,
          updatedAt: new Date().toISOString(),
        });
      setShowSuccess(`Deployment "${editing}" successfully updated!`);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <>
      <Modal
        title="Create Deployment"
        visible={!!editing}
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
                  Save
                </Button>,
              ]
        }
      >
        <Spin spinning={loading}>
          {!showSucces && (
            <EditContent
              onSubmit={handleEdit}
              serverError={error}
              setLoading={setLoading}
              setError={setError}
              serialNo={editing}
            />
          )}
          {showSucces && (
            <div style={{ textAlign: 'center' }}>
              <Text>{showSucces}</Text>
            </div>
          )}
        </Spin>
      </Modal>
      <style jsx>{``}</style>
      <style jsx global>{``}</style>
    </>
  );
};

export default EditDeploymentModel;