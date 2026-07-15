import type { Meta } from '../../types/api.types';

export type PickingTaskStatus = 'PENDING' | 'IN_PROGRESS' | 'DONE' | 'FAILED';

export interface PickingTask {
  id: number;
  issueId: number;
  issueCode: string;
  productId: number;
  productName: string;
  productCode: string;
  locationId: number;
  locationBarcode: string;
  locationDescription: string;
  batchNo: string | null;
  requiredQuantity: number;
  pickedQuantity: number;
  status: PickingTaskStatus;
  assignedTo: string;
  note: string;
  pickedAt: string | null;
  createdAt: string;
}

export interface ConfirmPickingPayload {
  taskId: number;
  pickedQuantity: number;
  note?: string;
}

export interface PickingState {
  tasks: PickingTask[];
  selectedTask: PickingTask | null;
  loading: boolean;
  actionLoading: boolean;
  error: string | null;
  meta: Meta | null;
}
