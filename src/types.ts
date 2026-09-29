export interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'treasury' | 'settlement' | 'escrow' | 'credit';
  institution: string;
  accountNumberMask: string;
  balance: number;
  availableBalance: number;
  currency: string;
  lastSynced: string;
  status: 'connected' | 'syncing' | 'error';
  color: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  merchant: string;
  category: string;
  accountId: string;
  accountName: string;
  amount: number;
  type: 'inflow' | 'outflow';
  status: 'reconciled' | 'pending' | 'flagged';
  source: 'Plaid' | 'Stripe' | 'Manual' | 'Invoice Sync' | 'Wire';
  tags?: string[];
  referenceId?: string;
}

export interface CashFlowPoint {
  period: string;
  inflow: number;
  outflow: number;
  netReserve: number;
  projected?: boolean;
}

export interface CategorySpend {
  name: string;
  amount: number;
  budget: number;
  color: string;
}

export interface PipelineNode {
  id: string;
  title: string;
  stage: 'source' | 'ingress' | 'processing' | 'ledger' | 'output';
  stageName: string;
  description: string;
  latency: string;
  throughput: string;
  status: 'healthy' | 'processing' | 'idle';
  samplePayload: Record<string, unknown>;
  inputs: string[];
  outputs: string[];
}

export interface PipelineEvent {
  id: string;
  timestamp: string;
  nodeId: string;
  nodeTitle: string;
  type: 'INFO' | 'SUCCESS' | 'SYNC' | 'RECONCILED';
  message: string;
  payloadPreview: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  company: string;
  avatar?: string;
  avatarAttribution?: {
    photographer: string;
    photographerUrl?: string;
    source: string;
    category?: string;
  };
  phone?: string;
  bio?: string;
  jobTitle?: string;
  location?: string;
  timezone?: string;
  currencyPreference?: string;
  twoFactorEnabled?: boolean;
  emailNotifications?: boolean;
  smsNotifications?: boolean;
}

export interface DesignToken {
  role: string;
  hex: string;
  rgb: string;
  usage: string;
}
