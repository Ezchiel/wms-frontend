import { useState, useEffect } from 'react';
import {
  Search,
  RotateCcw,
  Check,
  AlertCircle,
  FileText,
  Trash2,
  Calendar,
  User,
} from 'lucide-react';
import type { ScanHistory } from '../inventoryCheckScannerMobileTypes';

interface HistoryTabProps {
  onRefreshProducts: () => void;
}

export default function HistoryTab({ onRefreshProducts }: HistoryTabProps) {
  const [histories, setHistories] = useState<ScanHistory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/history');
      const data = await res.json();
      if (res.ok) {
        setHistories(data.histories);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleClearData = async () => {
    const isSure = window.confirm(
      'Bạn có chắc chắn muốn xóa toàn bộ lịch sử kiểm kê và đặt lại trạng thái kho về ban đầu?'
    );
    if (!isSure) return;

    try {
      const res = await fetch('/api/products/reset', { method: 'POST' });
      if (res.ok) {
        alert('Đã xóa lịch sử kiểm kê và thiết lập lại kho hàng về trạng thái ban đầu!');
        fetchHistory();
        onRefreshProducts();
      }
    } catch (e) {
      alert('Đặt lại không thành công.');
    }
  };

  const filteredHistory = histories.filter(
    (h) =>
      h.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (h.note && h.note.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Calculate quick metrics
  const totalCounts = histories.length;
  const matchedCounts = histories.filter((h) => h.status === 'matched').length;
  const mismatchedCounts = histories.filter((h) => h.status === 'mismatched').length;
  const reportedCounts = histories.filter((h) => h.status === 'reported').length;

  return (
    <div className="space-y-6">
      {/* Metrics Banner */}
      <div className="grid grid-cols-4 gap-2 md:gap-4">
        <div className="bg-white border border-neutral-200 rounded-xl p-3.5 text-center shadow-sm">
          <span className="text-[10px] font-bold text-neutral-400 block uppercase tracking-wider">
            Tổng Kiểm
          </span>
          <span className="text-xl md:text-2xl font-extrabold text-neutral-900">{totalCounts}</span>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3.5 text-center shadow-sm">
          <span className="text-[10px] font-bold text-emerald-500 block uppercase tracking-wider">
            Khớp Kho
          </span>
          <span className="text-xl md:text-2xl font-extrabold text-emerald-700">
            {matchedCounts}
          </span>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-3.5 text-center shadow-sm">
          <span className="text-[10px] font-bold text-amber-500 block uppercase tracking-wider">
            Lệch Số
          </span>
          <span className="text-xl md:text-2xl font-extrabold text-amber-700">
            {mismatchedCounts}
          </span>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-xl p-3.5 text-center shadow-sm">
          <span className="text-[10px] font-bold text-red-500 block uppercase tracking-wider">
            Báo Lệch
          </span>
          <span className="text-xl md:text-2xl font-extrabold text-red-700">{reportedCounts}</span>
        </div>
      </div>

      {/* Control panel */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Tìm theo sản phẩm, mã SKU, ghi chú..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-4 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm text-neutral-700 placeholder-neutral-400"
          />
        </div>

        <button
          onClick={handleClearData}
          className="h-11 px-4 border border-red-200 text-red-600 hover:bg-red-50 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition"
          title="Xóa dữ liệu để làm việc từ đầu"
        >
          <Trash2 className="w-4 h-4" />
          Xóa Toàn Bộ Lịch Sử
        </button>
      </div>

      {/* Audit Log Table/List */}
      {loading ? (
        <div className="text-center py-10 space-y-2">
          <RotateCcw className="w-8 h-8 text-neutral-300 animate-spin mx-auto" />
          <p className="text-sm text-neutral-400">Đang tải lịch sử kiểm kho...</p>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-neutral-200 p-6">
          <FileText className="w-12 h-12 text-neutral-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-neutral-800">Chưa có lịch sử kiểm kê phù hợp</p>
          <p className="text-xs text-neutral-400 mt-1">
            Hãy thực hiện quét mã vạch sản phẩm bất kỳ để thêm nhật ký kiểm kê đầu tiên.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-4 border border-neutral-200 shadow-sm hover:border-neutral-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Product and code */}
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-bold text-neutral-950 text-sm">{item.productName}</h4>
                  <span className="px-1.5 py-0.5 font-mono text-[10px] font-semibold bg-neutral-100 border border-neutral-200 rounded text-neutral-600 uppercase">
                    {item.sku}
                  </span>
                </div>

                {/* Meta details */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-neutral-400 font-medium">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {item.timestamp}
                  </span>
                  <span className="flex items-center gap-1 text-neutral-500">
                    <User className="w-3.5 h-3.5 text-neutral-400" />
                    {item.userEmail}
                  </span>
                </div>

                {item.note && (
                  <p className="text-xs text-neutral-500 bg-neutral-50 border border-neutral-150 rounded-lg px-2.5 py-1.5 italic mt-1 font-medium">
                    ✏️ {item.note}
                  </p>
                )}
              </div>

              {/* Status metrics and badges */}
              <div className="flex items-center justify-between md:justify-end gap-4 border-t border-neutral-50 pt-3 md:border-none md:pt-0 shrink-0">
                <div className="text-right flex items-center gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-neutral-400 block uppercase tracking-wider">
                      Hệ Thống
                    </span>
                    <span className="text-sm font-bold text-neutral-700">{item.systemQty}</span>
                  </div>
                  <div className="h-6 w-px bg-neutral-200"></div>
                  <div>
                    <span className="text-[10px] font-bold text-neutral-400 block uppercase tracking-wider">
                      Thực Tế
                    </span>
                    <span className="text-sm font-extrabold text-neutral-900">
                      {item.physicalQty}
                    </span>
                  </div>
                </div>

                <div className="w-26 text-right">
                  {item.status === 'matched' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold leading-none text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full">
                      <Check className="w-3 h-3" />
                      Khớp Lịch
                    </span>
                  ) : item.status === 'reported' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold leading-none text-red-700 bg-red-50 border border-red-200 rounded-full">
                      <AlertCircle className="w-3 h-3 animate-pulse" />
                      Sự Cố Lệch
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold leading-none text-amber-700 bg-amber-50 border border-amber-200 rounded-full">
                      <AlertCircle className="w-3 h-3" />
                      Chênh Lệch
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
