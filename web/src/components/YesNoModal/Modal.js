import React, { useLayoutEffect, useRef, useState } from 'react';
import { Typography, Card, Tooltip, Space, Spin } from 'antd';
import {
  DownloadOutlined,
  MailOutlined,
  PrinterOutlined,
} from '@ant-design/icons';
import Modal from 'antd/lib/modal/Modal';
import firebase from 'firebase/app';

const { Title, Text } = Typography;

const YesNoModal = ({
  title,
  question,
  yesText,
  noText,
  onYes,
  onNo,
  visible,
  loading = false,
  error = null,
  closable = true,
  destroyOnClose = true,
  maskClosable = true,
}) => {
  return (
    <>
      <Modal
        title={title}
        visible={visible}
        closable={closable}
        destroyOnClose={destroyOnClose}
        maskClosable={maskClosable}
        cancelText={noText}
        onCancel={onNo}
        okText={yesText}
        onOk={onYes}
        confirmLoading={loading}
      >
        <Spin spinning={loading}>
          <Space
            direction="vertical"
            align="center"
            style={{ textAlign: 'center' }}
          >
            <Text>{question}</Text>
            {error && (
              <div
                className="server-error ant-form-item-has-error"
                style={{ marginTop: 16 }}
              >
                <div className="ant-form-item-explain">{error}</div>
              </div>
            )}
          </Space>
        </Spin>
      </Modal>
      <style jsx>{``}</style>
      <style jsx global>{``}</style>
    </>
  );
};

export default YesNoModal;
