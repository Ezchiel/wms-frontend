import React from 'react';
import { Link } from 'react-router-dom';

// Định nghĩa các bước chính
const STEPS = ['scan_lpn', 'show_guidance', 'scan_shelf'] as const;

// Định nghĩa Type dựa trên mảng trên + bước success
type PutawayStep = (typeof STEPS)[number] | 'success';

interface Props {
  step: PutawayStep;
  completedCount: number;
  onBack: () => void;
}

export const PutawayHeader: React.FC<Props> = ({ step, completedCount, onBack }) => {
  // Tìm index mà không dùng 'any'
  // Ép kiểu về 'readonly string[]' là cách an toàn để dùng .indexOf()
  // mà không vi phạm luật no-explicit-any
  const currentStepIndex =
    step === 'success' ? STEPS.length : (STEPS as readonly string[]).indexOf(step);

  return (
    <header className="flex items-center justify-between px-5 py-4 w-full sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-wms-border-color shadow-sm">
      <div className="flex items-center gap-3">
        {step !== 'scan_lpn' && step !== 'success' ? (
          <button
            onClick={onBack}
            className="text-wms-text-main w-9 h-9 bg-wms-bg rounded-full flex items-center justify-center"
          >
            <i className="fa-solid fa-arrow-left text-[16px]"></i>
          </button>
        ) : (
          <Link
            to="/mobile/tasks"
            className="text-wms-text-main w-9 h-9 bg-wms-bg rounded-full flex items-center justify-center"
          >
            <i className="fa-solid fa-arrow-left text-[16px]"></i>
          </Link>
        )}
        <div>
          <h1 className="font-bold text-wms-text-main text-[17px] leading-tight">
            Cất hàng (Putaway)
          </h1>
          {completedCount > 0 && (
            <p className="text-[11px] text-wms-primary font-semibold -mt-0.5">
              {completedCount} kiện đã cất xong
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              step === 'success'
                ? 'w-2 bg-green-500'
                : i === currentStepIndex
                  ? 'w-5 bg-wms-primary'
                  : i < currentStepIndex
                    ? 'w-2 bg-wms-primary/40'
                    : 'w-2 bg-wms-border-color'
            }`}
          />
        ))}
      </div>
    </header>
  );
};
