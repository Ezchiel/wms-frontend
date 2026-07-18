import type { Meta } from '../../types/api.types';

export type IssueStatus = 'DRAFT' | 'APPROVED' | 'PICKING' | 'COMPLETED' | 'CANCELLED';

export const TAB_STATUS_MAP: Record<number, IssueStatus | ''> = {
  0: '',
  1: 'DRAFT',
  2: 'APPROVED',
  3: 'PICKING',
  4: 'COMPLETED',
  5: 'CANCELLED',
};

export interface IssueDetail {
  id: number;
  productId: number;
  productName: string;
  productCode: string;
  locationId: number | null;
  locationBarcode: string | null;
  locationDescription: string | null;
  quantity: number;
  batchNo: string | null;
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
  assignedTo: string | null;
}

export interface CreateIssueDetailPayload {
  productId: number;
  locationId?: number; // optional: nullable — hệ thống tự phân bổ nếu không chỉ định
  quantity: number;
  batchNo?: string;    // optional: chỉ điền khi khách yêu cầu xuất đúng lô này
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
  fromDate?: string;
  toDate?: string;
}
