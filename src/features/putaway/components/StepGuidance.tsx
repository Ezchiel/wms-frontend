import React from 'react';
import { Boxes, Tag, Route, QrCode } from 'lucide-react';

interface Props {
  suggestion: {
    lpnCode: string;
    productName: string;
    suggestedLocationCode: string;
  };
  onProceed: () => void;
}

export const StepGuidance: React.FC<Props> = ({ suggestion, onProceed }) => {
  return (
    <div className="flex flex-col gap-5">
      {/* Target location card */}
      <section className="bg-wms-primary text-white rounded-2xl p-6 flex flex-col items-center justify-center shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <p className="text-[12px] uppercase font-bold tracking-widest text-white/80 mb-2 relative z-10">
          Suggested location
        </p>
        <h2 className="text-[48px] font-black tracking-tight leading-none mb-1 relative z-10 drop-shadow-sm">
          {suggestion.suggestedLocationCode}
        </h2>
        <p className="text-[13px] text-white/90 text-center max-w-[85%] mt-3 font-medium relative z-10">
          Move to the shelf and scan QR code to confirm
        </p>
      </section>

      {/* Product info */}
      <section className="bg-white rounded-2xl p-4 shadow-sm border border-wms-border-color">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-wms-bg border border-wms-border-color flex items-center justify-center">
            <Boxes className="text-wms-muted w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] text-wms-muted font-bold uppercase tracking-wide mb-0.5">
              Item
            </p>
            <h3 className="text-[14px] font-bold text-wms-text-main leading-tight truncate">
              {suggestion.productName}
            </h3>
            <div className="mt-1.5 inline-flex items-center gap-1.5 px-2 py-0.5 bg-wms-bg border border-wms-border-color rounded text-[11px] font-bold">
              <Tag className="text-wms-muted w-3 h-3" />
              {suggestion.lpnCode}
            </div>
          </div>
        </div>
      </section>

      {/* Map hint */}
      <div className="flex items-start gap-3 p-3.5 bg-amber-50 border border-amber-200 rounded-xl">
        <Route className="text-amber-600 w-4 h-4 mt-0.5 shrink-0" />
        <p className="text-[12px] text-amber-800 leading-relaxed">
          The system has selected the optimal location based on the same type of product already available at the shelf and the shortest path.
        </p>
      </div>

      <button
        onClick={onProceed}
        className="w-full h-14 bg-wms-primary text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-wms-primary-hover active:scale-[0.98] transition-all shadow-lg cursor-pointer"
      >
        <QrCode className="w-5 h-5" />
        Confirm & Scan Shelf
      </button>
    </div>
  );
};
