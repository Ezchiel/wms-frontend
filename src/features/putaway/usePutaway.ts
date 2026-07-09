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
  // Lỗi 409: vị trí đang bị sản phẩm khác chiếm — hiển thị riêng biệt, không reset flow
  const [conflictError, setConflictError] = useState<string | null>(null);
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
    setConflictError(null);
    setStep('scan_shelf');
    setTimeout(() => shelfInputRef.current?.focus(), 100);
  }, []);

  const handleScanShelf = useCallback(async (explicitShelfCode?: string) => {
    // 1. Kiểm tra trạng thái
    if (confirming || !activeTask) return;

    // 2. Lấy giá trị input (trim để tránh lỗi khoảng trắng)
    const rawInput = typeof explicitShelfCode === 'string' ? explicitShelfCode : shelfInput;
    const input = rawInput.trim().toUpperCase();
    const target = activeTask.suggestedLocationCode.toUpperCase();

    if (input !== target) {
      setShelfError(`Mã kệ không khớp! Yêu cầu: ${target}`);
      return;
    }

    setShelfError(null);
    setConflictError(null);

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
    } else if (confirmPutawayTask.rejected.match(result)) {
      // Kiểm tra xem có phải lỗi 409 (vị trí bị chiếm) không
      // Backend trả message rõ ràng; phân biệt qua nội dung hoặc HTTP status
      const errorMessage = result.payload as string;
      if (isConflictError(errorMessage)) {
        // Lỗi 409: không reset flow — cho phép nhân viên scan vị trí khác
        setConflictError(errorMessage);
        setShelfInput('');
        setTimeout(() => shelfInputRef.current?.focus(), 100);
      }
      // Lỗi khác đã được Redux slice lưu vào state.error, hiển thị qua apiError
    }
  }, [shelfInput, activeTask, confirming, dispatch]);

  const handleReset = useCallback(() => {
    dispatch(clearActiveTask());
    setStep('scan_lpn');
    setLpnInput('');
    setShelfInput('');
    setShelfError(null);
    setConflictError(null);
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
      setConflictError(null);
    }
  }, [step, dispatch]);

  return {
    state: {
      step,
      lpnInput,
      shelfInput,
      shelfError,
      conflictError,
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

/**
 * Kiểm tra xem lỗi trả về có phải lỗi 409 (vị trí bị sản phẩm khác chiếm) không.
 * Backend trả message dạng: "Vị trí "..." hiện đang chứa sản phẩm "..."."
 */
function isConflictError(message: string | undefined): boolean {
  if (!message) return false;
  return message.includes('hiện đang chứa sản phẩm') || message.includes('Không thể cất thêm sản phẩm');
}
