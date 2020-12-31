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
import useNoteDetails from '../../pages/ViewDeployment/use-note-details';

const { Title, Text } = Typography;

const EditContent = ({ uuid, onSubmit, serverError, setLoading, setError }) => {
  const uuidInput = useRef(null);
  const authContext = useContext(AuthContext);

  const note = useNoteDetails(authContext, uuid, setLoading, setError);

  useLayoutEffect(() => {
    if (note) {
      uuidInput.current.focus();
    }
  }, [note]);

  if (!note) return null;

  return (
    <>
      <Form name="basic" onFinish={onSubmit} layout="vertical" id="createNote">
        <Form.Item
          label="Note"
          name="note"
          rules={[{ required: true, message: 'Please enter a note' }]}
          initialValue={note.note}
        >
          <Input ref={uuidInput} />
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
