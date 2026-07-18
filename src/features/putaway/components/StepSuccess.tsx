import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, CheckCheck, QrCode } from 'lucide-react';

interface SuccessData {
  lpnCode: string;
  productName: string;
  locationCode: string;
}

interface Props {
  data: SuccessData | null;
  completedCount: number;
  onReset: () => void;
}

export const StepSuccess: React.FC<Props> = ({ data, completedCount, onReset }) => {
  if (!data) return null;

  return (
    <div className="flex flex-col items-center gap-6 pt-4 animate-in fade-in zoom-in duration-300">
      {/* Icon Success */}
      <div className="w-24 h-24 rounded-3xl bg-green-100 border-2 border-green-300 flex items-center justify-center shadow-sm shadow-green-200">
        <CheckCircle className="text-green-600 w-11 h-11" />
      </div>

      <div className="text-center">
        <h2 className="text-[22px] font-black text-wms-text-main">Cất hàng thành công!</h2>
        <p className="text-wms-muted text-[14px]">Kiện hàng đã được ghi nhận vào hệ thống</p>
      </div>

      {/* Chi tiết thông tin đã cất */}
      <div className="w-full bg-white rounded-2xl p-5 border border-wms-border-color shadow-sm space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-dashed border-wms-border-color">
          <span className="text-wms-muted text-[13px]">Mã LPN</span>
          <span className="font-mono font-bold text-wms-text-main bg-wms-bg px-2 py-0.5 rounded text-[13px]">
            {data.lpnCode}
          </span>
        </div>

        <div className="space-y-1">
          <p className="text-wms-muted text-[11px] uppercase font-bold tracking-wider">Sản phẩm</p>
          <p className="font-bold text-wms-text-main text-[15px] leading-tight">
            {data.productName}
          </p>
        </div>

        <div className="pt-3 flex items-center gap-3">
          <div className="flex-1 bg-green-50 p-3 rounded-xl border border-green-100">
            <p className="text-green-700 text-[11px] font-bold uppercase mb-1">Vị trí lưu trữ</p>
            <p className="text-[20px] font-black text-green-800 leading-none">
              {data.locationCode}
            </p>
          </div>
        </div>
      </div>

      {/* Thông báo tiến độ phiên làm việc */}
      {completedCount > 0 && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 border border-blue-100 rounded-full">
          <CheckCheck className="text-blue-600 w-4 h-4" />
          <span className="text-[13px] font-bold text-blue-700">
            {completedCount} kiện đã cất trong phiên này
          </span>
        </div>
      )}

      {/* Nhóm nút hành động */}
      <div className="w-full grid grid-cols-1 gap-3 mt-2">
        <button
          onClick={onReset}
          className="w-full h-14 bg-wms-primary text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-wms-primary-hover active:scale-[0.98] transition-all shadow-lg shadow-blue-200 cursor-pointer"
        >
          <QrCode className="w-5 h-5" />
          Cất kiện hàng tiếp theo
        </button>

        <Link
          to="/mobile/tasks"
          className="w-full h-12 border-2 border-wms-border-color text-wms-text-main bg-white font-bold rounded-xl flex items-center justify-center gap-2 active:bg-wms-bg transition-colors"
        >
          Quay lại danh sách tác vụ
        </Link>
      </div>
    </div>
  );
};
