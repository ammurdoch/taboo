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

const YesNoModal = ({
  title,
  question,
  yesText,
  noText,
  onYes,
  onNo,
  visible,
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
      >
        <div style={{ textAlign: 'center' }}>
          <Text>{question}</Text>
        </div>
      </Modal>
      <style jsx>{``}</style>
      <style jsx global>{``}</style>
    </>
  );
};

export default YesNoModal;
