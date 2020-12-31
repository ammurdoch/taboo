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
  Breadcrumb,
  PageHeader,
  Descriptions,
  Divider,
} from 'antd';
import ColumnGroup from 'antd/lib/table/ColumnGroup';
import Column from 'antd/lib/table/Column';
import useDeployments from './use-notes';
import { AuthContext } from '../../shared/auth-context';
import settings from '../../settings';
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  MoreOutlined,
  EyeOutlined,
  DownloadOutlined,
  KeyOutlined,
} from '@ant-design/icons';
import CreateDeploymentModal from '../../components/CreateDeploymentModal';
import DeleteDeploymentModal from '../../components/DeleteDeploymentModal';
import EditDeploymentModal from '../../components/EditDeploymentModal';
import handleKeypairAction from '../../shared/keypair-actions';
import YesNoModal from '../../components/YesNoModal';
import SignOut from '../../components/SignOut';
import Version from '../../components/Version';
import { Link, useHistory, useParams } from 'react-router-dom';
import useNotes from './use-notes';
import useDeploymentDetails from '../Deployments/use-deployment-details';
import * as moment from 'moment';
import CreateNoteModal from '../../components/CreateNoteModal';
import DeleteNoteModal from '../../components/DeleteNoteModal';
import EditNoteModal from '../../components/EditNoteModal';

const { Title, Text } = Typography;

const ViewDeployment = () => {
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [editing, setEditing] = useState(null);
  const authContext = useContext(AuthContext);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteKeypairModal, setShowDeleteKeypairModal] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: settings.pageSize,
  });
  const [deletingNote, setDeletingNote] = useState(null);
  const [editingNote, setEditingNote] = useState(null);
  const [showCreateNoteModal, setShowCreateNoteModal] = useState(false);

  const { serialNo } = useParams();

  const nResult = useNotes(serialNo, authContext.state.user);
  const { notes } = nResult;

  const data = useMemo(() => {
    if (notes) {
      return notes.map((note) => ({
        key: note.uuid,
        ...note,
      }));
    }
    return [];
  }, [notes]);

  const deployment = useDeploymentDetails(
    authContext,
    serialNo,
    setLoading,
    setError,
  );

  const handleTableChange = useCallback((params) => {
    setPagination({
      ...params.pagination,
    });
  }, []);

  const handleMenuClick = useCallback(
    async (key) => {
      if (key === 'delete') {
        setShowDeleteKeypairModal(deployment);
      } else {
        await handleKeypairAction(deployment, key);
      }
    },
    [deployment],
  );

  const handleDeleteKeypair = useCallback(async () => {
    setShowDeleteKeypairModal(null);
    await handleKeypairAction(showDeleteKeypairModal, 'delete');
  }, [showDeleteKeypairModal]);

  const handleCancelDeleteKeypair = useCallback(() => {
    setShowDeleteKeypairModal(null);
  }, []);

  return (
    <div className="page notes">
      <div className="breadcrumb-container">
        <Breadcrumb>
          <Breadcrumb.Item>Theora Clear</Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/">Deployments</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{serialNo}</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div style={{ height: 32 }} />
      <Title level={1}>Deployment</Title>
      <div style={{ height: 16 }} />
      {deployment && (
        <Spin spinning={loading}>
          <Card>
            <Descriptions size="small" column={3}>
              <Descriptions.Item label="Serial No.">
                {deployment.serialNo}
              </Descriptions.Item>
              <Descriptions.Item label="Computer Name">
                {deployment.computerName}
              </Descriptions.Item>
              <Descriptions.Item label="Customer">
                {deployment.customerName}
              </Descriptions.Item>
              <Descriptions.Item label="Printer Serial No.">
                {deployment.printerSerialNo}
              </Descriptions.Item>
              <Descriptions.Item label="Invoice No.">
                {deployment.invoiceNo}
              </Descriptions.Item>
              <Descriptions.Item label="Shipment Date">
                {deployment.shipmentDate &&
                  moment(deployment.shipmentDate).format('YYYY-MM-DD')}
              </Descriptions.Item>
            </Descriptions>
          </Card>
          <div style={{ height: 32 }} />
          <div style={{ textAlign: 'center' }}>
            <Text label="App Versions">
              {`UI: ${deployment.uiVersion || '-'} Face: ${
                deployment.faceVersion || '-'
              } Eyes: ${deployment.eyesVersion || '-'} Ears: ${
                deployment.earsVersion || '-'
              } Water: ${deployment.waterVersion || '-'}`}
            </Text>
          </div>
          <Divider />
          <Space className="view-deployment-button-box">
            <Button
              className="view-deployment-button"
              onClick={() => setEditing(serialNo)}
              icon={<EditOutlined />}
            >
              Edit Deployment
            </Button>

            {!deployment.keypair && (
              <Button
                className="view-deployment-button"
                onClick={() => handleMenuClick('generate')}
                icon={<KeyOutlined />}
              >
                Generate Keypair
              </Button>
            )}
            {deployment.keypair && (
              <>
                <Button
                  className="view-deployment-button"
                  onClick={() => handleMenuClick('public')}
                  icon={<DownloadOutlined />}
                >
                  Download Public Key
                </Button>
                <Button
                  className="view-deployment-button"
                  onClick={() => handleMenuClick('private')}
                  icon={<DownloadOutlined />}
                >
                  Download Private Key
                </Button>
                <Button
                  className="view-deployment-button"
                  onClick={() => handleMenuClick('delete')}
                  icon={<DeleteOutlined />}
                >
                  Delete Keypair
                </Button>
              </>
            )}
            <Button
              className="view-deployment-button"
              onClick={() => setDeleting(serialNo)}
              danger
              icon={<DeleteOutlined />}
            >
              Delete Deployment
            </Button>
          </Space>
          <Divider />
        </Spin>
      )}
      {deployment === null && (
        <Text type="danger">This deployment has been deleted</Text>
      )}
      <Title level={2}>Notes</Title>
      <div className="top-actions">
        <Space>
          <Button
            type="primary"
            onClick={() => setShowCreateNoteModal(true)}
            icon={<PlusOutlined />}
          >
            Create Note
          </Button>
        </Space>
      </div>
      <Table
        dataSource={data}
        loading={nResult.loading}
        pagination={{ ...pagination, total: data.length }}
        onChange={handleTableChange}
        style={{ width: '100%' }}
      >
        <Column
          title="Timestamp"
          dataIndex="createdAt"
          defaultSortOrder="ascend"
          sorter={(a, b) => {
            console.log(a, b);
            if (a.createdAt > b.createdAt) {
              return -1;
            }
            if (b.createdAt > a.createdAt) {
              return 1;
            }
            return 0;
          }}
          render={(text, record) => {
            const options = {
              year: 'numeric',
              month: 'numeric',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
              hour12: true,
              timeZone: 'America/Los_Angeles',
            };
            return new Intl.DateTimeFormat('en-US', options).format(
              new Date(record.createdAt),
            );
          }}
        />
        <Column
          title="Author"
          dataIndex="createdBy"
          render={() =>
            authContext.state.user.name || authContext.state.user.email
          }
        />
        <Column title="Note" dataIndex="note" key="note" />
        <Column
          title="Action"
          key="action"
          render={(text, record) => (
            <Space size="middle">
              <Tooltip title="Edit">
                <Button
                  onClick={() => setEditingNote(record.uuid)}
                  icon={<EditOutlined />}
                />
              </Tooltip>
              <Tooltip title="Delete">
                <Button
                  onClick={() => setDeletingNote(record)}
                  icon={<DeleteOutlined />}
                />
              </Tooltip>
            </Space>
          )}
        />
      </Table>
      {nResult.errorMsg && (
        <div className="ant-form-item-has-error" style={{ marginTop: 16 }}>
          <div className="ant-form-item-explain">{nResult.errorMsg}</div>
        </div>
      )}
      <CreateDeploymentModal
        visible={showCreateModal}
        setVisible={setShowCreateModal}
      />
      <DeleteDeploymentModal deleting={deleting} setDeleting={setDeleting} />
      <EditDeploymentModal editing={editing} setEditing={setEditing} />
      <CreateNoteModal
        visible={showCreateNoteModal}
        setVisible={setShowCreateNoteModal}
        deploymentSerialNo={serialNo}
      />
      <DeleteNoteModal deleting={deletingNote} setDeleting={setDeletingNote} />
      <EditNoteModal editing={editingNote} setEditing={setEditingNote} />
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
          justify-content: flex-start;
          align-items: center;
          flex-direction: column;
          padding-top: 80px;
          padding-bottom: 80px;
          padding-left: 20vw;
          padding-right: 20vw;
          position: relative;
          min-height: 100vh;
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
        .breadcrumb-container {
          align-self: stretch;
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
        .notes .ant-spin-nested-loading {
          width: 100%;
        }
        .view-deployment-button-box {
          display: flex;
          justify-content: center;
          margin-bottom: 16px;
          flex-wrap: wrap;
          max-width: 100%;
        }
        .view-deployment-button {
          margin-bottom: 8px;
        }
      `}</style>
    </div>
  );
};

export default ViewDeployment;
