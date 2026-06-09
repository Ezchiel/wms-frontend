import React from 'react';
import { useAppSelector } from '../../../app/hooks';
import type { InventoryIssue } from '../inventoryIssueTypes';

interface Props {
  isOpen: boolean;
  issue: InventoryIssue | null;
  onClose: () => void;
  onApprove: (id: number) => void;
  onConfirm: (id: number) => void;
  onCancel: (id: number) => void;
  actionLoading?: boolean;
}

const IssueDetailModal: React.FC<Props> = ({
  isOpen,
  issue,
  onClose,
  onApprove,
  onConfirm,
  onCancel,
  actionLoading = false,
}) => {
  const user = useAppSelector((state) => state.auth.user);
  const isAuthorized = user?.role === 'ADMIN' || user?.role === 'MANAGER';

  if (!isOpen || !issue) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return 'bg-yellow-100 text-yellow-700';
      case 'APPROVED':
        return 'bg-blue-100 text-blue-700';
      case 'COMPLETED':
        return 'bg-green-100 text-green-700';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity p-4">
      <div className="bg-white w-full max-w-5xl rounded-xl shadow-lg flex flex-col overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-solid border-wms-border-color sticky top-0 bg-white z-10">
          <h2 className="text-[16px] font-semibold text-wms-text-main">
            Issue Detail: <span className="text-wms-primary">{issue.issueCode}</span>
          </h2>
          <button
            onClick={onClose}
            className="text-wms-muted hover:text-red-500 transition-colors cursor-pointer"
          >
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 text-[13px]">
          {/* General Info */}
          <div className="grid grid-cols-2 gap-5 mb-6 bg-gray-50 p-4 rounded-lg border border-wms-border-color">
            <div className="flex flex-col gap-2">
              <p>
                <span className="font-medium text-wms-muted">Customer:</span> {issue.customerName}
              </p>
              <p>
                <span className="font-medium text-wms-muted">Issue Date:</span>{' '}
                {new Date(issue.issueDate).toLocaleDateString('vi-VN')}
              </p>
              <p>
                <span className="font-medium text-wms-muted">Created At:</span>{' '}
                {new Date(issue.createdAt).toLocaleString('vi-VN')}
              </p>
              <p>
                <span className="font-medium text-wms-muted">Created By:</span> {issue.createdBy}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <p>
                <span className="font-medium text-wms-muted">Status:</span>
                <span
                  className={`ml-2 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${getStatusBadge(issue.status)}`}
                >
                  {issue.status}
                </span>
              </p>
              <p>
                <span className="font-medium text-wms-muted">Notes:</span> {issue.notes || 'N/A'}
              </p>
            </div>
          </div>

          {/* Details Table */}
          <h3 className="font-medium text-[14px] mb-3">Product List</h3>
          <div className="border border-solid border-wms-border-color rounded-lg overflow-hidden">
            <table className="w-full text-[13px]">
              <thead className="bg-gray-50 border-b border-wms-border-color">
                <tr>
                  <th className="p-3 text-left">Product Code</th>
                  <th className="p-3 text-left">Product Name</th>
                  <th className="p-3 text-left">Location Barcode</th>
                  <th className="p-3 text-left">Location Description</th>
                  <th className="p-3 text-right w-24">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {issue.details && issue.details.length > 0 ? (
                  issue.details.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-wms-border-color last:border-0 hover:bg-gray-50/50"
                    >
                      <td className="p-3">{item.productCode}</td>
                      <td className="p-3 font-medium">{item.productName}</td>
                      <td className="p-3 font-mono">{item.locationBarcode}</td>
                      <td className="p-3 text-wms-muted">{item.locationDescription || 'N/A'}</td>
                      <td className="p-3 text-right font-medium">{item.quantity}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-5 text-wms-muted">
                      No details available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-solid border-wms-border-color bg-gray-50/50 sticky bottom-0 z-10">
          <button
            onClick={onClose}
            disabled={actionLoading}
            className="py-2 px-5 rounded-md text-[13px] font-medium cursor-pointer bg-white border border-solid border-wms-border-color text-wms-text-main hover:bg-gray-50 transition-colors"
          >
            Close
          </button>

          {isAuthorized && !actionLoading && issue.status === 'DRAFT' && (
            <>
              <button
                onClick={() => onCancel(issue.id)}
                className="py-2 px-5 rounded-md text-[13px] font-medium cursor-pointer bg-red-500 border border-solid border-red-500 text-white hover:opacity-90 transition-all shadow-sm"
              >
                Cancel Issue
              </button>
              <button
                onClick={() => onApprove(issue.id)}
                className="py-2 px-5 rounded-md text-[13px] font-medium cursor-pointer bg-blue-600 border border-solid border-blue-600 text-white hover:opacity-90 transition-all shadow-sm"
              >
                Approve
              </button>
            </>
          )}

          {isAuthorized && !actionLoading && issue.status === 'APPROVED' && (
            <>
              <button
                onClick={() => onCancel(issue.id)}
                className="py-2 px-5 rounded-md text-[13px] font-medium cursor-pointer bg-red-500 border border-solid border-red-500 text-white hover:opacity-90 transition-all shadow-sm"
              >
                Cancel Issue
              </button>
              <button
                onClick={() => onConfirm(issue.id)}
                className="py-2 px-5 rounded-md text-[13px] font-medium cursor-pointer bg-green-600 border border-solid border-green-600 text-white hover:opacity-90 transition-all shadow-sm"
              >
                Confirm (Issue Out)
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default IssueDetailModal;
