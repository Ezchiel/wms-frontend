import { useCallback, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { clearActiveTask } from './putawaySlice';
import { confirmPutawayTask, fetchPutawayTaskByLpn, claimPutawayTask } from './putawayThunks';

type Step = 'scan_lpn' | 'show_guidance' | 'scan_shelf' | 'success';

export const usePutaway = () => {
  const dispatch = useAppDispatch();
  const { activeTask, loading, confirming, error } = useAppSelector((s) => s.putaway);

  const [step, setStep] = useState<Step>('scan_lpn');
  const [lpnInput, setLpnInput] = useState('');
  const [shelfInput, setShelfInput] = useState('');
  const [shelfError, setShelfError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    lpnCode: string;
    productName: string;
    locationCode: string;
  } | null>(null);
  const [completedCount, setCompletedCount] = useState(0);

  const lpnInputRef = useRef<HTMLInputElement>(null);
  const shelfInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (step === 'scan_lpn') lpnInputRef.current?.focus();
    if (step === 'scan_shelf') shelfInputRef.current?.focus();
  }, [step]);

  const handleScanLpn = useCallback(
    async (explicitLpn?: string) => {
      const codeToScan = explicitLpn || lpnInput;

      if (!codeToScan) return;

      const result = await dispatch(fetchPutawayTaskByLpn(codeToScan));

      if (fetchPutawayTaskByLpn.fulfilled.match(result)) {
        const task = result.payload;
        // Nếu task chưa được phân công (assignedTo = null) và status = PENDING, tự động claim
        if (!task.assignedTo && task.status === 'PENDING') {
          const claimResult = await dispatch(claimPutawayTask(task.id));
          if (claimPutawayTask.rejected.match(claimResult)) {
            return; // Đã xảy ra lỗi khi claim
          }
        }
        setStep('show_guidance');
      }
    },
    [lpnInput, dispatch]
  );

  const handleProceedToScan = useCallback(() => {
    setShelfInput('');
    setShelfError(null);
    setStep('scan_shelf');
    setTimeout(() => shelfInputRef.current?.focus(), 100);
  }, []);

  const handleScanShelf = useCallback(async () => {
    // 1. Kiểm tra trạng thái
    if (confirming || !activeTask) return;

    // 2. Lấy giá trị input (trim để tránh lỗi khoảng trắng)
    const input = shelfInput.trim().toUpperCase();
    const target = activeTask.suggestedLocationCode.toUpperCase();

    if (input !== target) {
      setShelfError(`Mã kệ không khớp! Yêu cầu: ${target}`);
      return;
    }

    // 3. Gọi API xác nhận
    const result = await dispatch(
      confirmPutawayTask({
        taskId: activeTask.id,
        locationId: activeTask.suggestedLocationId,
      })
    );

    // 4. Xử lý kết quả
    if (confirmPutawayTask.fulfilled.match(result)) {
      // Chuyển sang step thành công
      setSuccessData({
        lpnCode: activeTask.lpnCode,
        productName: activeTask.productName,
        locationCode: activeTask.suggestedLocationCode,
      });
      setCompletedCount((prev) => prev + 1);
      setStep('success');
    }
  }, [shelfInput, activeTask, confirming, dispatch]);

  const handleReset = useCallback(() => {
    dispatch(clearActiveTask());
    setStep('scan_lpn');
    setLpnInput('');
    setShelfInput('');
    setShelfError(null);
    setSuccessData(null);
  }, [dispatch]);

  const handleBack = useCallback(() => {
    if (step === 'show_guidance') {
      setStep('scan_lpn');
      setLpnInput('');
      dispatch(clearActiveTask());
    } else if (step === 'scan_shelf') {
      setStep('show_guidance');
      setShelfInput('');
      setShelfError(null);
    }
  }, [step, dispatch]);

  return {
    state: {
      step,
      lpnInput,
      shelfInput,
      shelfError,
      activeTask,
      loading,
      confirming,
      error,
      successData,
      completedCount,
    },
    actions: {
      setLpnInput,
      setShelfInput,
      setCompletedCount,
      handleScanLpn,
      handleProceedToScan,
      handleScanShelf,
      handleReset,
      handleBack,
    },
    lpnInputRef,
    shelfInputRef,
  };
};

