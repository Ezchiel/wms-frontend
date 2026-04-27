import TaskCard from '../../components/mobile/tasks/TaskCard';

function Tasks() {
  return (
    <>
      {/* TopAppBar */}
      <header className="flex items-center justify-between px-5 py-4 w-full sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-wms-border-color shadow-sm">
        <div className="flex items-center gap-3">
          <button className="text-wms-text-main w-9 h-9 active:opacity-70 bg-wms-bg rounded-full flex items-center justify-center">
            <i className="fa-solid fa-bars text-[18px]"></i>
          </button>
          <h1 className="font-bold text-wms-text-main text-[17px]">Warehouse Tasks</h1>
        </div>
        <button className="text-wms-text-main w-9 h-9 active:opacity-70 bg-wms-bg rounded-full flex items-center justify-center relative">
          <i className="fa-regular fa-bell text-[18px]"></i>
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
      </header>

      <main className="px-5 py-6">
        {/* Search & Filter Area */}
        <div className="flex flex-col gap-4 mb-7">
          <div className="flex items-center gap-2.5">
            <div className="relative flex-1">
              <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-wms-muted text-[16px]"></i>
              <input
                className="w-full pl-11 pr-4 py-3 bg-white border border-wms-border-color rounded-xl focus:outline-none focus:ring-2 focus:ring-wms-primary/20 focus:border-wms-primary text-[14px] text-wms-text-main placeholder:text-wms-muted transition-all shadow-sm"
                placeholder="Tìm kiếm mã phiếu nhập..."
                type="text"
              />
            </div>
            <button className="w-12 h-12 bg-white border border-wms-border-color text-wms-text-main rounded-xl active:scale-95 transition-transform shadow-sm flex items-center justify-center">
              <i className="fa-solid fa-sliders text-[18px]"></i>
            </button>
          </div>

          <div className="flex gap-2.5 overflow-x-auto pb-2 no-scrollbar">
            {['Tất cả', 'Chờ xử lý', 'Đang thực hiện', 'Hoàn thành'].map((tab, idx) => (
              <button
                key={tab}
                className={`px-4.5 py-2 rounded-full text-[13px] font-semibold whitespace-nowrap transition-colors shadow-sm ${
                  idx === 0
                    ? 'bg-wms-primary text-white border border-wms-primary'
                    : 'bg-white border border-wms-border-color text-wms-text-main active:bg-gray-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Task List Title */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[15px] font-bold text-wms-text-main">Phiếu chờ xử lý</h2>
          <span className="text-[13px] font-medium text-wms-primary bg-wms-primary/10 px-2.5 py-0.5 rounded-full">
            4 nhiệm vụ
          </span>
        </div>

        {/* Task Cards Grid */}
        <div className="space-y-4">
          <TaskCard
            id="#RCV-2604-001"
            company="Global Logistics Co."
            priority="High"
            time="14:30 - Hôm nay"
            skus={24}
          />
          <TaskCard
            id="#RCV-2604-005"
            company="FastTrack Supplies"
            priority="Medium"
            time="16:00 - Hôm nay"
            skus={12}
          />
          <TaskCard
            id="#RCV-2604-008"
            company="Green Earth Packaging"
            priority="Low"
            time="09:00 - Ngày mai"
            skus={56}
            opacity="opacity-70"
          />
        </div>
      </main>

      {/* Floating Action Button */}
      <button className="fixed bottom-28 right-5 w-14 h-14 bg-wms-primary text-white rounded-full shadow-[0_4px_15px_rgba(59,130,246,0.4)] flex items-center justify-center active:scale-90 transition-transform z-40">
        <i className="fa-solid fa-qrcode text-[24px]"></i>
      </button>
    </>
  );
}

export default Tasks;
