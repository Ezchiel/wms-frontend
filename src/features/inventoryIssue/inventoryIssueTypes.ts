import type { Meta } from '../../types/api.types';

export type IssueStatus = 'DRAFT' | 'APPROVED' | 'COMPLETED' | 'CANCELLED';

export const TAB_STATUS_MAP: Record<number, IssueStatus | ''> = {
  0: '',
  1: 'DRAFT',
  2: 'APPROVED',
  3: 'COMPLETED',
  4: 'CANCELLED',
};

export interface IssueDetail {
  id: number;
  productId: number;
  productName: string;
  productCode: string;
  locationId: number;
  locationBarcode: string;
  locationDescription: string;
  quantity: number;
}

export interface InventoryIssue {
  id: number;
  issueCode: string;
  customerId: number;
  customerName: string;
  issueDate: string;
  status: IssueStatus;
  notes: string;
  createdBy: string;
  createdAt: string;
  details: IssueDetail[];
}

export interface CreateIssueDetailPayload {
  productId: number;
  locationId: number;
  quantity: number;
}

export interface CreateIssuePayload {
  customerId: number;
  notes?: string;
  details: CreateIssueDetailPayload[];
}

export interface InventoryIssueState {
  issues: InventoryIssue[];
  selectedIssue: InventoryIssue | null;
  loading: boolean;
  actionLoading: boolean;
  error: string | null;
  meta: Meta | null;
}

export interface FetchIssuesParams {
  keyword?: string;
  status?: IssueStatus | '';
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: string;
}
