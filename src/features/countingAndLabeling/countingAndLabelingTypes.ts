export interface ItemState {
  detailId: number;
  countedQty: number;
  batchNo: string;
  expiryDate: string;
  serialNumber: string;
  isPrinted: boolean;
  isSubmitting: boolean;
  error: string | null;
  lpnCode: string | null;
}
