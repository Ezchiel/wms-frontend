import { Link } from 'react-router-dom';
import { ClipboardList } from 'lucide-react';

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-20 h-20 rounded-2xl bg-wms-bg border border-wms-border-color flex items-center justify-center mb-4">
        <ClipboardList className="w-8 h-8 text-wms-muted opacity-50" />
      </div>
      <h3 className="text-[15px] font-bold text-wms-text-main mb-1">No receipts</h3>
      <p className="text-[13px] text-wms-muted mb-5">No receipt is available yet</p>
      <Link
        to="/mobile/tasks"
        className="px-5 py-2.5 bg-wms-primary text-white text-[13px] font-semibold rounded-xl shadow-sm active:scale-95 transition-all"
      >
        Return
      </Link>
    </div>
  );
}

export default EmptyState;
