import React, { useState } from 'react';
import type { PickingTask } from '../pickingTypes';
import QrCameraScanner from '../../inventoryCheckMobile/components/QrCameraScanner';
import {
  ArrowLeft,
  ChevronLeft,
  CircleCheckBig,
  MapPin,
  QrCode,
  AlertTriangle,
  Lock,
  Unlock,
  MessageSquare,
} from 'lucide-react';
import { toast } from 'react-toastify';

interface Props {
  task: PickingTask;
  onBack: () => void;
  onConfirm: (taskId: number, pickedQuantity: number, note?: string) => Promise<any>;
  actionLoading: boolean;
}

export const PickingTaskDetail: React.FC<Props> = ({
  task,
  onBack,
  onConfirm,
  actionLoading,
}) => {
  const [isVerified, setIsVerified] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [pickedQty, setPickedQty] = useState<number>(task.requiredQuantity);
  const [note, setNote] = useState<string>('');

  const handleScan = (scannedText: string) => {
    setShowScanner(false);
    if (scannedText.trim() === task.locationBarcode.trim()) {
      setIsVerified(true);
      toast.success('Xác nhận vị trí kệ chính xác!');
    } else {
      toast.error(
        `Sai vị trí! Vui lòng quét kệ ${task.locationBarcode}. Quét được: ${scannedText}`
      );
    }
  };

  const adjustQty = (delta: number) => {
    setPickedQty((prev) => Math.max(0, prev + delta));
  };

  const isDiscrepant = pickedQty < task.requiredQuantity;
  const isSubmitDisabled =
    actionLoading ||
    !isVerified ||
    pickedQty < 0 ||
    (isDiscrepant && !note.trim());

  const handleSubmit = async () => {
    if (pickedQty < 0) {
      toast.error('Số lượng lấy không được âm!');
      return;
    }
    if (isDiscrepant && !note.trim()) {
      toast.error('Vui lòng nhập ghi chú lý do thiếu hàng!');
      return;
    }
    try {
      await onConfirm(task.id, pickedQty, note);
      toast.success('Xác nhận lấy hàng thành công!');
      onBack();
    } catch (err: any) {
      toast.error(err || 'Đã xảy ra lỗi khi xác nhận lấy hàng!');
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 flex items-center justify-between px-4 py-3.5 sticky top-0 z-40 shadow-xs">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onBack}
            className="transition-colors active:opacity-75 p-1.5"
            id="detail-back-btn"
          >
            <ChevronLeft />
          </button>
          <div>
            <h1 className="font-extrabold text-sm text-slate-800">
              Chi tiết: {task.productName}
            </h1>
            <p className="text-[10px] text-slate-400 font-medium">
              Mã vạch sản phẩm: {task.productCode}
            </p>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-md mx-auto w-full px-4 py-4 space-y-4 pb-40">
        {/* Step 1: Info Card */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 space-y-3.5 shadow-xs">
          <h3 className="text-xs font-black text-slate-800 border-b border-slate-55 pb-2">
            THÔNG TIN NHIỆM VỤ
          </h3>
          <div className="space-y-2 text-xs font-semibold text-slate-600">
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Sản phẩm:</span>
              <span className="text-slate-800 text-right max-w-[200px] truncate">{task.productName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Mã sản phẩm:</span>
              <span className="text-slate-800 font-mono">{task.productCode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Phiếu xuất:</span>
              <span className="text-slate-800 font-mono">{task.issueCode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Số lượng yêu cầu:</span>
              <span className="text-blue-600 font-black text-sm">{task.requiredQuantity}</span>
            </div>
          </div>
        </div>

        {/* Step 2: Location Verification */}
        <div className={`bg-white border rounded-2xl p-4 space-y-4 shadow-xs transition-colors ${isVerified ? 'border-emerald-200 bg-emerald-50/5' : 'border-amber-200 bg-amber-50/5'}`}>
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-slate-800">
              BƯỚC 1: XÁC THỰC VỊ TRÍ KỆ
            </h3>
            {isVerified ? (
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-black px-2 py-0.5 rounded-md flex items-center gap-1">
                <Unlock size={11} />
                Đã mở khóa
              </span>
            ) : (
              <span className="text-[10px] bg-amber-100 text-amber-800 font-black px-2 py-0.5 rounded-md flex items-center gap-1">
                <Lock size={11} />
                Đang khóa
              </span>
            )}
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                <MapPin size={16} />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wide block">
                  Kệ đích cần quét
                </span>
                <span className="text-xs font-black text-slate-700 font-mono block mt-0.5">
                  {task.locationBarcode}
                </span>
              </div>
            </div>
            <span className="text-[10px] text-slate-400 font-medium truncate max-w-[150px]">
              {task.locationDescription || 'N/A'}
            </span>
          </div>

          {!isVerified ? (
            <button
              onClick={() => setShowScanner(true)}
              className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-extrabold text-xs rounded-xl transition-all shadow-md"
              id="start-scan-shelf-btn"
            >
              <QrCode size={15} />
              <span>Quét mã vạch kệ</span>
            </button>
          ) : (
            <div className="text-center py-1.5 bg-emerald-100/30 text-emerald-800 border border-emerald-200/50 rounded-xl text-xs font-bold">
              ✓ Đã xác thực kệ thành công
            </div>
          )}
        </div>

        {/* Step 3: Quantities & Stepper (Locked until verified) */}
        <div className={`bg-white border border-slate-100 rounded-2xl p-4 space-y-4 shadow-xs relative ${!isVerified && 'opacity-50 pointer-events-none'}`}>
          {!isVerified && (
            <div className="absolute inset-0 bg-slate-50/20 backdrop-blur-[0.5px] rounded-2xl z-10 flex flex-col items-center justify-center text-center p-4">
              <Lock size={20} className="text-slate-400 mb-1" />
              <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">
                Vui lòng quét đúng kệ để mở khóa đếm
              </p>
            </div>
          )}

          <h3 className="text-xs font-black text-slate-800">
            BƯỚC 2: NHẬP SỐ LƯỢNG ĐÃ LẤY
          </h3>

          <div className="flex items-center gap-2 pt-1">
            {/* Decrement */}
            <div className="flex gap-1 shrink-0">
              <button
                type="button"
                onClick={() => adjustQty(-10)}
                className="w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold active:scale-95 transition-all border border-slate-200/50"
              >
                -10
              </button>
              <button
                type="button"
                onClick={() => adjustQty(-1)}
                className="w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-black active:scale-90 transition-all border border-slate-200/50"
              >
                −
              </button>
            </div>

            {/* Input */}
            <div className="flex-1">
              <input
                type="number"
                min="0"
                value={pickedQty}
                onChange={(e) => {
                  const val = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
                  setPickedQty(Math.max(0, val));
                }}
                placeholder="Số lượng"
                className="w-full text-center bg-white border border-slate-200 py-2.5 rounded-xl text-sm font-black text-slate-800 outline-none focus:ring-1 focus:ring-blue-100"
                id="picked-qty-input"
              />
            </div>

            {/* Increment */}
            <div className="flex gap-1 shrink-0">
              <button
                type="button"
                onClick={() => adjustQty(1)}
                className="w-10 h-10 flex items-center justify-center bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl font-bold active:scale-90 transition-all border border-blue-100"
              >
                +
              </button>
              <button
                type="button"
                onClick={() => adjustQty(10)}
                className="w-10 h-10 flex items-center justify-center bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-extrabold active:scale-95 transition-all border border-blue-100"
              >
                +10
              </button>
            </div>
          </div>

          <div className="flex justify-end text-[10px]">
            <button
              type="button"
              onClick={() => setPickedQty(task.requiredQuantity)}
              className="text-blue-600 hover:underline font-semibold"
              id="reset-required-qty-btn"
            >
              Đặt số lượng mặc định ({task.requiredQuantity})
            </button>
          </div>
        </div>

        {/* Step 4: Ghi chú (Required if discrepant) */}
        {isVerified && (
          <div className="bg-white border border-slate-100 rounded-2xl p-4 space-y-3 shadow-xs">
            <div className="flex items-center gap-1.5 text-slate-700">
              <MessageSquare size={14} className="text-slate-400" />
              <h3 className="text-xs font-black">
                GHI CHÚ / LÝ DO
              </h3>
            </div>
            
            {isDiscrepant && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-800 rounded-xl text-[10px] font-bold flex items-center gap-2">
                <AlertTriangle size={14} className="shrink-0" />
                <span>Số lượng lấy ({pickedQty}) nhỏ hơn yêu cầu ({task.requiredQuantity}). Vui lòng nhập lý do hao hụt (bắt buộc).</span>
              </div>
            )}

            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Nhập ghi chú hoặc lý do lệch số lượng tại đây..."
              rows={3}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:ring-1 focus:ring-blue-100 placeholder-slate-400"
              id="picking-task-note-input"
            />
          </div>
        )}
      </main>

      {/* Sticky Footer */}
      <footer className="w-full z-30 bg-white/95 backdrop-blur-md border-t border-slate-100 px-4 pb-6 pt-3.5 shadow-[0_-4px_22px_rgba(0,0,0,0.04)]">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold py-3.5 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 active:scale-95"
            id="detail-cancel-btn"
          >
            <ArrowLeft size={16} />
            <span>Quay lại</span>
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            className="flex-2 min-w-0 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white disabled:text-slate-400 font-extrabold py-3.5 px-6 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-1.5 active:scale-95"
            id="detail-confirm-btn"
          >
            <CircleCheckBig size={16} />
            <span>Xác nhận lấy hàng</span>
          </button>
        </div>
      </footer>

      {/* Scanner Modal */}
      {showScanner && (
        <QrCameraScanner
          onClose={() => setShowScanner(false)}
          onScan={handleScan}
        />
      )}
    </div>
  );
};

export default PickingTaskDetail;
