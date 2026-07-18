import React from 'react';
import { Loader2 } from 'lucide-react';
import PageHeader from '../../layouts/MobileLayout/PageHeader';
import { StepGuidance } from './components/StepGuidance';
import { StepScanLPN } from './components/StepScanLPN';
import { StepScanShelf } from './components/StepScanShelf';
import { StepSuccess } from './components/StepSuccess';
import { usePutaway } from './usePutaway';

const STEPS = ['scan_lpn', 'show_guidance', 'scan_shelf'] as const;

export const PutawayFeature: React.FC = () => {
  const { state, actions, lpnInputRef, shelfInputRef } = usePutaway();

  const currentStepIndex =
    state.step === 'success' ? STEPS.length : (STEPS as readonly string[]).indexOf(state.step);

  const progressDots = (
    <div className="flex items-center gap-1.5 shrink-0">
      {STEPS.map((_, i) => (
        <div
          key={i}
          className={`h-2 rounded-full transition-all duration-300 ${
            state.step === 'success'
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
  );

  return (
    <div className="bg-wms-bg min-h-screen font-sans text-wms-text-main flex flex-col">
      <PageHeader
        title="Cất hàng (Putaway)"
        subtitle={state.completedCount > 0 ? `${state.completedCount} kiện đã cất xong` : undefined}
        backTo={state.step !== 'scan_lpn' && state.step !== 'success' ? actions.handleBack : "/mobile/tasks"}
        rightSlot={progressDots}
      />

      <main className="flex-1 flex flex-col px-5 pt-6 pb-8 max-w-md mx-auto w-full relative">
        {/* Overlay Loading */}
        {(state.loading || state.confirming) && (
          <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-[1px] flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="animate-spin text-wms-primary w-8 h-8" />
              <span className="text-[12px] font-medium text-wms-muted">Đang xử lý...</span>
            </div>
          </div>
        )}

        {/* Step 1: Quét mã LPN */}
        {state.step === 'scan_lpn' && (
          <StepScanLPN
            inputRef={lpnInputRef}
            value={state.lpnInput}
            error={state.error}
            onChange={actions.setLpnInput}
            onSubmit={actions.handleScanLpn}
          />
        )}

        {/* Step 2: Hiển thị gợi ý vị trí (Chỉ render khi có activeTask) */}
        {state.step === 'show_guidance' && state.activeTask && (
          <StepGuidance suggestion={state.activeTask} onProceed={actions.handleProceedToScan} />
        )}

        {/* Step 3: Quét xác nhận mã kệ */}
        {state.step === 'scan_shelf' && state.activeTask && (
          <StepScanShelf
            suggestedCode={state.activeTask.suggestedLocationCode}
            shelfInput={state.shelfInput}
            shelfRef={shelfInputRef}
            shelfError={state.shelfError}
            apiError={state.error}
            conflictError={state.conflictError}
            confirming={state.confirming}
            onConfirm={actions.handleScanShelf}
            onInputChange={actions.setShelfInput}
          />
        )}

        {/* Step 4: Thông báo thành công */}
        {state.step === 'success' && (
          <StepSuccess
            data={state.successData}
            completedCount={state.completedCount}
            onReset={actions.handleReset}
          />
        )}
      </main>
    </div>
  );
};
