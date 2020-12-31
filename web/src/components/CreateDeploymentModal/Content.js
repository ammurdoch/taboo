import React, { useContext, useLayoutEffect, useRef, useState } from 'react';
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
      <Form
        name="basic"
        onFinish={onSubmit}
        layout="vertical"
        id="createDeployment"
      >
        <Form.Item
          label="Serial No"
          name="serialNo"
          rules={[{ required: true, message: 'Please enter a note' }]}
        >
          <Input ref={serialNoInput} />
        </Form.Item>
        <Form.Item
          label="Computer Name"
          name="computerName"
          rules={[{ required: true, message: 'Please enter a computer name' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Customer Name"
          name="customerName"
          rules={[{ required: true, message: 'Please enter a customer name' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: 'Please enter a description' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          initialValue={null}
          label="Printer Serial No."
          name="printerSerialNo"
        >
          <Input />
        </Form.Item>
        <Form.Item initialValue={null} label="Invoice No." name="invoiceNo">
          <Input />
        </Form.Item>
        <Form.Item
          initialValue={null}
          label="Shipment Date"
          name="shipmentDate"
        >
          <DatePicker style={{ width: '100%' }} allowClear />
        </Form.Item>
        <Form.Item initialValue={null} label="UI Version" name="uiVersion">
          <Input />
        </Form.Item>
        <Form.Item initialValue={null} label="Face Version" name="faceVersion">
          <Input />
        </Form.Item>
        <Form.Item initialValue={null} label="Eyes Version" name="eyesVersion">
          <Input />
        </Form.Item>
        <Form.Item initialValue={null} label="Ears Version" name="earsVersion">
          <Input />
        </Form.Item>
        <Form.Item
          initialValue={null}
          label="Water Version"
          name="waterVersion"
        >
          <Input />
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
