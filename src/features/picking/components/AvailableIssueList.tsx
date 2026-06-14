import React from 'react';
import type { InventoryIssue } from '../../inventoryIssue/inventoryIssueTypes';
import { ClipboardList, Calendar, RefreshCw, Layers, ArrowLeft } from 'lucide-react';

interface Props {
  issues: InventoryIssue[];
  loading: boolean;
  onRefresh: () => void;
  onClaim: (issueId: number) => void;
  onBackToMyTasks?: () => void;
  actionLoading?: boolean;
}

export const AvailableIssueList: React.FC<Props> = ({
  issues,
  loading,
  onRefresh,
  onClaim,
  onBackToMyTasks,
  actionLoading = false,
}) => {
  return (
    <div className="bg-slate-50 min-h-screen flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40 shadow-xs">
        <div className="px-4 pt-4 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {onBackToMyTasks && (
              <button
                type="button"
                onClick={onBackToMyTasks}
                className="transition-colors active:opacity-75 p-1.5 -ml-1 text-slate-600"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <div>
              <h1 className="font-black text-base text-slate-800 leading-tight">Phiếu xuất kho sẵn sàng</h1>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                Chọn phiếu để bắt đầu lấy hàng
              </p>
            </div>
          </div>
          <button
            onClick={onRefresh}
            disabled={loading}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 transition-all active:scale-90"
            id="available-refresh-btn"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-md mx-auto w-full px-4 py-4 space-y-4 pb-28">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-slate-400 font-semibold">Đang tải phiếu xuất...</p>
          </div>
        ) : issues.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 bg-white border border-slate-100 rounded-2xl">
            <ClipboardList size={32} className="text-slate-300" />
            <div className="text-center">
              <p className="text-xs font-extrabold text-slate-500">Không có phiếu sẵn sàng</p>
              <p className="text-[10px] text-slate-400 mt-1">
                Hiện tại không có phiếu APPROVED nào chờ nhận.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {issues.map((issue) => (
              <div
                key={issue.id}
                className="bg-white border border-slate-100 rounded-2xl p-4 space-y-3 shadow-xs hover:border-blue-100 transition-colors"
              >
                {/* Code & Title */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-black text-slate-800 leading-snug font-mono">
                      {issue.issueCode}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-semibold mt-1">
                      KH: {issue.customerName}
                    </p>
                  </div>
                </div>

                {/* Details info */}
                <div className="grid grid-cols-2 gap-3 pt-1 text-[11px] text-slate-500 font-semibold">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Layers size={13} className="text-slate-400 shrink-0" />
                    <span>Số dòng: {issue.details?.length || 0} SP</span>
                  </div>
                  <div className="flex items-center gap-1.5 min-w-0 justify-end">
                    <Calendar size={13} className="text-slate-400 shrink-0" />
                    <span>{new Date(issue.issueDate).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>

                {/* Claim Button */}
                <button
                  onClick={() => onClaim(issue.id)}
                  disabled={actionLoading}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 active:scale-[0.98] text-white font-extrabold text-xs rounded-xl transition-all shadow-xs cursor-pointer mt-2"
                >
                  {actionLoading ? 'Đang nhận phiếu...' : 'Nhận & bắt đầu picking'}
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AvailableIssueList;
