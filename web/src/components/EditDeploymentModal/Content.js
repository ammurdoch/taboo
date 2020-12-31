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
import { AuthContext } from '../../shared/auth-context';
import useDeploymentDetails from '../../pages/Deployments/use-deployment-details';
import * as moment from 'moment';

const { Title, Text } = Typography;

const EditContent = ({
  serialNo,
  onSubmit,
  serverError,
  setLoading,
  setError,
}) => {
  const serialNoInput = useRef(null);
  const authContext = useContext(AuthContext);

  const deployment = useDeploymentDetails(
    authContext,
    serialNo,
    setLoading,
    setError,
  );

  useLayoutEffect(() => {
    if (deployment) {
      serialNoInput.current.focus();
    }
  }, [deployment]);

  if (!deployment) return null;

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
          rules={[{ required: true, message: 'Please enter a serial number' }]}
          initialValue={deployment.serialNo}
        >
          <Input disabled />
        </Form.Item>
        <Form.Item
          label="Computer Name"
          name="computerName"
          rules={[{ required: true, message: 'Please enter a computer name' }]}
          initialValue={deployment.computerName}
        >
          <Input ref={serialNoInput} />
        </Form.Item>
        <Form.Item
          label="Customer Name"
          name="customerName"
          rules={[{ required: true, message: 'Please enter a customer name' }]}
          initialValue={deployment.customerName}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: 'Please enter a description' }]}
          initialValue={deployment.description}
        >
          <Input />
        </Form.Item>
        <Form.Item
          initialValue={deployment.printerSerialNo}
          label="Printer Serial No."
          name="printerSerialNo"
        >
          <Input />
        </Form.Item>
        <Form.Item
          initialValue={deployment.invoiceNo}
          label="Invoice No."
          name="invoiceNo"
        >
          <Input />
        </Form.Item>
        <Form.Item
          initialValue={
            deployment.shipmentDate ? moment(deployment.shipmentDate) : null
          }
          label="Shipment Date"
          name="shipmentDate"
        >
          <DatePicker style={{ width: '100%' }} allowClear />
        </Form.Item>
        <Form.Item
          initialValue={deployment.uiVersion}
          label="UI Version"
          name="uiVersion"
        >
          <Input />
        </Form.Item>
        <Form.Item
          initialValue={deployment.faceVersion}
          label="Face Version"
          name="faceVersion"
        >
          <Input />
        </Form.Item>
        <Form.Item
          initialValue={deployment.eyesVersion}
          label="Eyes Version"
          name="eyesVersion"
        >
          <Input />
        </Form.Item>
        <Form.Item
          initialValue={deployment.earsVersion}
          label="Ears Version"
          name="earsVersion"
        >
          <Input />
        </Form.Item>
        <Form.Item
          initialValue={deployment.waterVersion}
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

export default EditContent;
