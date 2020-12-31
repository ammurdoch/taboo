import React, { useLayoutEffect, useRef, useState } from 'react';
import {
  Form,
  Input,
  Button,
  Checkbox,
  Typography,
  Card,
  Tooltip,
  DatePicker,
} from 'antd';

const { Title, Text } = Typography;

const EmailQRContent = ({ onSubmit, serverError }) => {
  const serialNoInput = useRef(null);

  useLayoutEffect(() => {
    serialNoInput.current.focus();
  }, []);

  return (
    <>
      <Form name="basic" onFinish={onSubmit} layout="vertical" id="createNote">
        <Form.Item
          label="Note"
          name="note"
          rules={[{ required: true, message: 'Please enter a serial number' }]}
        >
          <Input ref={serialNoInput} />
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
      <style jsx>{`
        .server-error {
          text-align: center;
        }
      `}</style>
      <style jsx global>{``}</style>
    </>
  );
};

export default EmailQRContent;
