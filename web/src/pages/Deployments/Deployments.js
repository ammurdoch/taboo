import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Form,
  Input,
  Button,
  Checkbox,
  Typography,
  Card,
  Tooltip,
  Spin,
  Table,
  Space,
  Menu,
  Dropdown,
} from 'antd';
import ColumnGroup from 'antd/lib/table/ColumnGroup';
import Column from 'antd/lib/table/Column';
import useDeployments from './use-deployments';
import { AuthContext } from '../../shared/auth-context';
import settings from '../../settings';
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  MoreOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import CreateDeploymentModal from '../../components/CreateDeploymentModal';
import DeleteDeploymentModal from '../../components/DeleteDeploymentModal';
import EditDeploymentModal from '../../components/EditDeploymentModal';
import handleKeypairAction from '../../shared/keypair-actions';
import YesNoModal from '../../components/YesNoModal';
import SignOut from '../../components/SignOut';
import Version from '../../components/Version';
import { useHistory } from 'react-router-dom';

const { Title, Text } = Typography;

const Deployments = () => {
  const [deleting, setDeleting] = useState(null);
  const [editing, setEditing] = useState(null);
  const authContext = useContext(AuthContext);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteKeypairModal, setShowDeleteKeypairModal] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: settings.pageSize,
  });
  const history = useHistory();

  const dResult = useDeployments(authContext.state.user);
  const { deployments } = dResult;

  const data = useMemo(() => {
    if (deployments) {
      return deployments.map((deployment) => ({
        key: deployment.serialNo,
        ...deployment,
      }));
    }
    return [];
  }, [deployments]);

  const handleTableChange = useCallback((params) => {
    setPagination({
      ...params.pagination,
    });
  }, []);

  const handleCreate = useCallback(() => {
    setShowCreateModal(true);
  }, []);

  const handleMenuClick = useCallback(
    (record) => async ({ key }) => {
      console.log('click', record, key);
      if (key === 'delete') {
        setShowDeleteKeypairModal(record);
      } else {
        await handleKeypairAction(record, key);
      }
    },
    [],
  );

  const handleDeleteKeypair = useCallback(async () => {
    setShowDeleteKeypairModal(null);
    await handleKeypairAction(showDeleteKeypairModal, 'delete');
  }, [showDeleteKeypairModal]);

  const handleCancelDeleteKeypair = useCallback(() => {
    setShowDeleteKeypairModal(null);
  }, []);

  return (
    <div className="page deployments">
      <Title className="qr-gen-title">
        <span className="subtitle">Theora Clear</span>
        <br />
        Deployments
      </Title>
      <div className="top-actions">
        <Space>
          <Button type="primary" onClick={handleCreate} icon={<PlusOutlined />}>
            Create Deployment
          </Button>
        </Space>
      </div>
      <Table
        dataSource={data}
        loading={dResult.loading}
        pagination={{ ...pagination, total: data.length }}
        onChange={handleTableChange}
        style={{ width: '100%' }}
      >
        <Column title="Serial No" dataIndex="serialNo" key="serialNo" />
        <Column
          title="Computer Name"
          dataIndex="computerName"
          key="computerName"
        />
        <Column title="Customer" dataIndex="customerName" key="customerName" />
        <Column
          title="App Versions"
          dataIndex="appVersions"
          render={(text, record) => {
            return `UI: ${record.uiVersion || '-'} Face: ${
              record.faceVersion || '-'
            } Eyes: ${record.eyesVersion || '-'} Ears: ${
              record.earsVersion || '-'
            } Water: ${record.waterVersion || '-'}`;
          }}
        />
        <Column
          title="Action"
          key="action"
          render={(text, record) => (
            <Space size="middle">
              <Tooltip title="View">
                <Button
                  onClick={() => history.push(`/deployment/${record.serialNo}`)}
                  icon={<EyeOutlined />}
                />
              </Tooltip>
              <Tooltip title="Edit">
                <Button
                  onClick={() => setEditing(record.serialNo)}
                  icon={<EditOutlined />}
                />
              </Tooltip>
              <Tooltip title="Delete">
                <Button
                  onClick={() => setDeleting(record.serialNo)}
                  icon={<DeleteOutlined />}
                />
              </Tooltip>
              <Dropdown
                overlay={
                  <Menu onClick={handleMenuClick(record)}>
                    {!record.keypair && (
                      <Menu.Item key="generate">Generate Keypair</Menu.Item>
                    )}
                    {record.keypair && (
                      <Menu.Item key="public">Download Public Key</Menu.Item>
                    )}
                    {record.keypair && (
                      <Menu.Item key="private">Download Private Key</Menu.Item>
                    )}
                    {record.keypair && (
                      <Menu.Item key="delete">Delete Keypair</Menu.Item>
                    )}
                  </Menu>
                }
                trigger={['click']}
              >
                <Button icon={<MoreOutlined />} />
              </Dropdown>
            </Space>
          )}
        />
      </Table>
      {dResult.errorMsg && (
        <div className="ant-form-item-has-error" style={{ marginTop: 16 }}>
          <div className="ant-form-item-explain">{dResult.errorMsg}</div>
        </div>
      )}
      <CreateDeploymentModal
        visible={showCreateModal}
        setVisible={setShowCreateModal}
      />
      <DeleteDeploymentModal deleting={deleting} setDeleting={setDeleting} />
      <EditDeploymentModal editing={editing} setEditing={setEditing} />
      <YesNoModal
        title="Delete deployment keypair"
        question={`Are you sure you want to delete the deployment "${
          showDeleteKeypairModal && showDeleteKeypairModal.serialNo
        }'s" private-public keypair?`}
        yesText="Yes"
        noText="No"
        onYes={handleDeleteKeypair}
        onNo={handleCancelDeleteKeypair}
        visible={!!showDeleteKeypairModal}
      />
      <SignOut />
      <Version />
      <style jsx>{`
        .page {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          padding-top: 10vh;
          padding-bottom: 10vh;
          padding-left: 20vw;
          padding-right: 20vw;
          position: relative;
        }
        @media screen and (max-width: 992px) {
          .page {
            padding-left: 5vw;
            padding-right: 5vw;
          }
        }
        @media screen and (max-width: 600px) {
          .page {
            padding-left: 16px;
            padding-right: 16px;
          }
        }
        .subtitle {
          font-size: 24px;
        }
        .top-actions {
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          width: 100%;
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
        .deployments .ant-spin-nested-loading {
          width: 100%;
        }
      `}</style>
    </div>
  );
};

export default Deployments;
