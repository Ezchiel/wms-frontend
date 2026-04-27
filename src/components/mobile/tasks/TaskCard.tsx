interface TaskProps {
  id: string;
  company: string;
  priority: 'High' | 'Medium' | 'Low';
  time: string;
  skus: number;
  opacity?: string;
}

const TaskCard = ({ id, company, priority, time, skus, opacity = '' }: TaskProps) => {
  const priorityColors: Record<'High' | 'Medium' | 'Low', string> = {
    High: 'bg-red-50 text-red-600 border-red-200',
    Medium: 'bg-orange-50 text-orange-600 border-orange-200',
    Low: 'bg-slate-50 text-wms-text-main border-wms-border-color',
  };

  return (
    <div
      className={`bg-white rounded-2xl p-4.5 shadow-sm border border-wms-border-color flex flex-col gap-4.5 ${opacity} transition-all`}
    >
      {/* Header Card */}
      <div className="flex justify-between items-start">
        <div>
          <span className="text-wms-primary font-bold text-[13px] block mb-1">{id}</span>
          <h3 className="font-bold text-wms-text-main text-[16px] leading-tight">{company}</h3>
        </div>
        <span
          className={`${priorityColors[priority]} px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border`}
        >
          {priority}
        </span>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-y-3 py-3 border-y border-wms-border-color">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-wms-bg flex items-center justify-center text-wms-muted">
            <i className="fa-regular fa-clock text-[15px]"></i>
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] text-wms-muted font-medium mb-0.5">Thời gian</span>
            <span className="text-[13px] font-semibold text-wms-text-main">{time}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-wms-bg flex items-center justify-center text-wms-muted">
            <i className="fa-solid fa-box-open text-[14px]"></i>
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] text-wms-muted font-medium mb-0.5">Mặt hàng</span>
            <span className="text-[13px] font-semibold text-wms-text-main">{skus} SKUs</span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button className="w-full bg-wms-primary hover:bg-wms-primary-hover text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2.5 active:scale-[0.98] transition-all shadow-sm">
        <i className="fa-solid fa-qrcode text-[18px]"></i>
        Kiểm đếm ngay
      </button>
    </div>
  );
};

export default TaskCard;
