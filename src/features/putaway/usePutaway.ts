import { useCallback, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { clearSuggestion } from './putawaySlice';
import { confirmPutaway, fetchPutawaySuggestion } from './putawayThunks';

type Step = 'scan_lpn' | 'show_guidance' | 'scan_shelf' | 'success';

export const usePutaway = () => {
  const dispatch = useAppDispatch();
  const { suggestion, loading, confirming, error } = useAppSelector((s) => s.putaway);

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

      const result = await dispatch(fetchPutawaySuggestion(codeToScan));

      if (fetchPutawaySuggestion.fulfilled.match(result)) {
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
    if (confirming || !suggestion) return;

    // 2. Lấy giá trị input (trim để tránh lỗi khoảng trắng)
    const input = shelfInput.trim().toUpperCase();
    const target = suggestion.suggestedLocationCode.toUpperCase();

    if (input !== target) {
      setShelfError(`Mã kệ không khớp! Yêu cầu: ${target}`);
      return;
    }

    // 3. Gọi API xác nhận
    const result = await dispatch(
      confirmPutaway({
        lpnCode: suggestion.lpnCode,
        locationId: suggestion.suggestedLocationId,
      })
    );

    // 4. Xử lý kết quả
    if (confirmPutaway.fulfilled.match(result)) {
      // Chuyển sang step thành công
      setStep('success');
      // ... các logic setSuccessData khác
    }
  }, [shelfInput, suggestion, confirming, dispatch]);

  const handleReset = useCallback(() => {
    dispatch(clearSuggestion());
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
      dispatch(clearSuggestion());
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
      suggestion,
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
