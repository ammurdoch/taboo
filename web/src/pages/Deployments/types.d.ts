export type Deployment = {
  serialNo: string;
  computerName: string;
  customerName: string;
  description: string;
  uiVersion: string;
  eyesVersion: string;
  earsVersion: string;
  waterVersion: string;
  faceVersion: string;
  keypair: string;
  printerSerialNo: string;
  invoiceNo: string;
  shipmentDate: Date;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
};

type DeploymentsAction = {
  type: string;
  data: any;
  accountId: string;
  nextCursor: any;
  error?: Error;
};

type DeploymentsState = {
  loading: boolean;
  errorMsg: string;
  deployments: Deployment[] | null;
  nextCursor: any;
  accountId: string;
  hasMore: boolean;
};

type DeploymentReducer = (
  state: DeploymentsState,
  action: any,
) => DeploymentsState;

type UserDeploymentsResult = {
  doQuery: (limit: number, cursor: any) => Promise<void>;
  loading: boolean;
  errorMsg: string;
  deployments: Deployment[] | null;
  nextCursor: any;
  hasMore: boolean;
};