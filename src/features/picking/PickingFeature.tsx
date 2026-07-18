import { useEffect, useState, useCallback } from 'react';
import type { PickingTask } from './pickingTypes';
import { usePicking } from './usePicking';
import PickingTaskList from './components/PickingTaskList';
import PickingTaskDetail from './components/PickingTaskDetail';
import AvailableIssueList from './components/AvailableIssueList';
import { toast } from 'react-toastify';

type View = 'available_issues' | 'my_tasks' | 'detail';

export default function PickingFeature() {
  const {
    tasks,
    loading,
    actionLoading,
    fetchTasks,
    confirmTask,
    setSelected,
    clearSelected,
    availableIssues,
    issuesLoading,
    fetchAvailable,
    claimIssue,
  } = usePicking();

  const [view, setView] = useState<View>('available_issues');
  const [activeTask, setActiveTask] = useState<PickingTask | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    if (!loading && !isInitialized) {
      const hasActiveTasks = tasks.some(
        (t) => t.status === 'PENDING' || t.status === 'IN_PROGRESS'
      );
      if (hasActiveTasks) {
        setView('my_tasks');
      } else {
        setView('available_issues');
        fetchAvailable({ page: 1, size: 100 });
      }
      setIsInitialized(true);
    }
  }, [loading, tasks, isInitialized, fetchAvailable]);

  // Automatically redirect to available issues if all tasks are finished
  useEffect(() => {
    if (view === 'my_tasks' && isInitialized && !loading) {
      const hasActiveTasks = tasks.some(
        (t) => t.status === 'PENDING' || t.status === 'IN_PROGRESS'
      );
      if (!hasActiveTasks && tasks.length > 0) {
        toast.info('Tất cả nhiệm vụ đã hoàn thành! Quay lại danh sách phiếu sẵn sàng.');
        setView('available_issues');
        fetchAvailable({ page: 1, size: 100 });
      }
    }
  }, [tasks, loading, view, isInitialized, fetchAvailable]);

  const handleSelectTask = useCallback((task: PickingTask) => {
    setActiveTask(task);
    setSelected(task);
    setView('detail');
  }, [setSelected]);

  const handleBackToList = useCallback(() => {
    setView('my_tasks');
    setActiveTask(null);
    clearSelected();
    fetchTasks();
  }, [clearSelected, fetchTasks]);

  const [availableParams, setAvailableParams] = useState<any>({ page: 1, size: 100 });

  const handleRefreshAvailable = useCallback(() => {
    fetchAvailable(availableParams);
  }, [fetchAvailable, availableParams]);

  const handleRefreshTasks = useCallback(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleFetchAvailable = useCallback((params: any) => {
    const newParams = { page: 1, size: 100, ...params };
    setAvailableParams(newParams);
    fetchAvailable(newParams);
  }, [fetchAvailable]);

  const handleClaim = useCallback(async (issueId: number) => {
    try {
      await claimIssue(issueId);
      toast.success('Nhận phiếu thành công! Bắt đầu thực hiện nhiệm vụ.');
      await fetchTasks();
      setView('my_tasks');
    } catch (err: any) {
      toast.error(err || 'Đã xảy ra lỗi khi nhận phiếu!');
    }
  }, [claimIssue, fetchTasks]);

  const handleBackToMyTasks = useCallback(() => {
    setView('my_tasks');
    fetchTasks();
  }, [fetchTasks]);

  if (view === 'detail' && activeTask) {
    return (
      <PickingTaskDetail
        task={activeTask}
        onBack={handleBackToList}
        onConfirm={confirmTask}
        actionLoading={actionLoading}
      />
    );
  }

  if (view === 'available_issues') {
    return (
      <AvailableIssueList
        issues={availableIssues}
        loading={issuesLoading}
        onRefresh={handleRefreshAvailable}
        onClaim={handleClaim}
        onBackToMyTasks={tasks.length > 0 ? handleBackToMyTasks : undefined}
        actionLoading={actionLoading}
        onFetchIssues={handleFetchAvailable}
      />
    );
  }

  return (
    <PickingTaskList
      tasks={tasks}
      loading={loading}
      onRefresh={handleRefreshTasks}
      onSelectTask={handleSelectTask}
      onSelectNewIssue={() => setView('available_issues')}
    />
  );
}
