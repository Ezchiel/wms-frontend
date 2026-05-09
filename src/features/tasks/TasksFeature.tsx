import React from 'react';
import type { InventoryReceipt } from '../inventoryReceipt/inventoryReceiptTypes';
import TaskCard from './components/TaskCard';
import { useTasks } from './useTasks';

export const TasksFeature: React.FC = () => {
  const { state } = useTasks();

  return (
    <>
      <main className="px-5 py-6">
        {/* Search & Filter Area */}
        <div className="flex flex-col gap-4 mb-7">
          <div className="flex items-center gap-2.5">
            <div className="relative flex-1">
              <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-wms-muted text-[16px]"></i>
              <input
                className="w-full pl-11 pr-4 py-3 bg-white border border-wms-border-color rounded-xl focus:outline-none focus:ring-2 focus:ring-wms-primary/20 focus:border-wms-primary text-[14px] text-wms-text-main placeholder:text-wms-muted transition-all shadow-sm"
                placeholder="Search receipt code..."
                type="text"
              />
            </div>
            <button className="w-12 h-12 bg-white border border-wms-border-color text-wms-text-main rounded-xl active:scale-95 transition-transform shadow-sm flex items-center justify-center">
              <i className="fa-solid fa-sliders text-[18px]"></i>
            </button>
          </div>

          <div className="flex gap-2.5 overflow-x-auto pb-2 no-scrollbar">
            {['Receiving', 'Putaway', 'Completed'].map((tab, idx) => (
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
          <h2 className="text-[15px] font-bold text-wms-text-main">Receipts in processing</h2>
          <span className="text-[13px] font-medium text-wms-primary bg-wms-primary/10 px-2.5 py-0.5 rounded-full">
            {state.receivingReceipts.length} tasks
          </span>
        </div>

        {/* Task Cards Grid */}
        {state.loading ? (
          <div className="py-10 text-center text-wms-muted text-[13px]">Loading data...</div>
        ) : state.receivingReceipts.length === 0 ? (
          <div className="py-10 text-center text-wms-muted text-[13px]">
            No receipts are pending.
          </div>
        ) : (
          <div className="space-y-4">
            {state.receivingReceipts.map((receipt: InventoryReceipt) => (
              <TaskCard key={receipt.id} receipt={receipt} />
            ))}
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      {/* <button className="fixed bottom-28 right-5 w-14 h-14 bg-wms-primary text-white rounded-full shadow-[0_4px_15px_rgba(59,130,246,0.4)] flex items-center justify-center active:scale-90 transition-transform z-40">
        <i className="fa-solid fa-qrcode text-[24px]"></i>
      </button> */}
    </>
  );
};
