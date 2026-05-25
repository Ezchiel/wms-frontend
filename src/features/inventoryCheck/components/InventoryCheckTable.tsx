import type { InventoryCheck, CheckStatus } from '../inventoryCheckTypes';

interface Props {
  checks: InventoryCheck[];
  loading: boolean;
  onViewDetail: (check: InventoryCheck) => void;
}

const STATUS_CONFIG: Record<CheckStatus, { label: string; className: string }> = {
  PENDING: {
    label: 'Chờ xác nhận',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  COMPLETED: {
    label: 'Hoàn thành',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  CANCELLED: {
    label: 'Đã huỷ',
    className: 'bg-red-50 text-red-600 border-red-200',
  },
};

const formatDate = (isoStr: string) => {
  try {
    return new Date(isoStr).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoStr;
  }
};

export default function InventoryCheckTable({ checks, loading, onViewDetail }: Props) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 gap-3 text-wms-muted">
        <svg className="w-5 h-5 animate-spin text-wms-primary" fill="none" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <span className="text-sm">Đang tải dữ liệu...</span>
      </div>
    );
  }

  if (checks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-wms-muted gap-3">
        <i className="fa-regular fa-folder-open text-4xl text-wms-border-color"></i>
        <p className="text-sm">Không tìm thấy phiếu kiểm kê nào</p>
      </div>
    );
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-wms-border-color bg-wms-bg">
          <th className="text-left px-5 py-3.5 text-[12px] font-semibold text-wms-muted uppercase tracking-wider">
            Mã phiếu
          </th>
          <th className="text-left px-5 py-3.5 text-[12px] font-semibold text-wms-muted uppercase tracking-wider">
            Ngày kiểm
          </th>
          <th className="text-left px-5 py-3.5 text-[12px] font-semibold text-wms-muted uppercase tracking-wider">
            Trạng thái
          </th>
          <th className="text-left px-5 py-3.5 text-[12px] font-semibold text-wms-muted uppercase tracking-wider">
            Người tạo
          </th>
          <th className="text-left px-5 py-3.5 text-[12px] font-semibold text-wms-muted uppercase tracking-wider">
            Số dòng
          </th>
          <th className="text-left px-5 py-3.5 text-[12px] font-semibold text-wms-muted uppercase tracking-wider">
            Ghi chú
          </th>
          <th className="text-center px-5 py-3.5 text-[12px] font-semibold text-wms-muted uppercase tracking-wider">
            Thao tác
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-wms-border-color">
        {checks.map((check) => {
          const statusCfg = STATUS_CONFIG[check.status];
          const discrepantCount = check.details.filter((d) => d.variance !== 0).length;

          return (
            <tr key={check.id} className="hover:bg-wms-bg/50 transition-colors">
              <td className="px-5 py-4">
                <span className="font-semibold text-wms-text-main font-mono text-[13px]">
                  {check.checkCode}
                </span>
              </td>
              <td className="px-5 py-4 text-wms-muted text-[13px]">
                {formatDate(check.checkDate)}
              </td>
              <td className="px-5 py-4">
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-md text-[12px] font-semibold border ${statusCfg.className}`}
                >
                  {statusCfg.label}
                </span>
              </td>
              <td className="px-5 py-4 text-wms-text-main text-[13px]">{check.createdBy || '—'}</td>
              <td className="px-5 py-4">
                <div className="flex items-center gap-2">
                  <span className="text-wms-text-main font-medium">{check.details.length}</span>
                  {discrepantCount > 0 && (
                    <span className="text-[11px] bg-red-50 text-red-600 border border-red-200 px-1.5 py-0.5 rounded font-semibold">
                      {discrepantCount} lệch
                    </span>
                  )}
                </div>
              </td>
              <td className="px-5 py-4 text-wms-muted text-[13px] max-w-48">
                <span className="truncate block">{check.notes || '—'}</span>
              </td>
              <td className="px-5 py-4 text-center">
                <button
                  onClick={() => onViewDetail(check)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-wms-primary border border-wms-primary/30 rounded-lg hover:bg-wms-primary/5 transition-colors cursor-pointer"
                >
                  <i className="fa-solid fa-eye text-[11px]"></i>
                  Chi tiết
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
