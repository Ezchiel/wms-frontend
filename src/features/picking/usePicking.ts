import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  fetchMyPickingTasks,
  fetchPickingTaskById,
  confirmPickingTask,
} from './pickingThunks';
import { setSelectedTask, clearSelectedTask } from './pickingSlice';
import { fetchAvailableIssues, claimInventoryIssue } from '../inventoryIssue/inventoryIssueThunks';
import type { PickingTask, PickingTaskStatus } from './pickingTypes';

export const usePicking = () => {
  const dispatch = useAppDispatch();
  const { tasks, selectedTask, loading, actionLoading, error, meta } =
    useAppSelector((state) => state.picking);
  const { issues: availableIssues, loading: issuesLoading } = useAppSelector(
    (state) => state.inventoryIssues
  );

  const fetchTasks = useCallback(
    (status?: PickingTaskStatus) => {
      dispatch(fetchMyPickingTasks(status ? { status } : undefined));
    },
    [dispatch]
  );

  const fetchTaskById = useCallback(
    (taskId: number) => {
      dispatch(fetchPickingTaskById(taskId));
    },
    [dispatch]
  );

  const confirmTask = useCallback(
    async (taskId: number, pickedQuantity: number, note?: string) => {
      return dispatch(confirmPickingTask({ taskId, pickedQuantity, note })).unwrap();
    },
    [dispatch]
  );

  const setSelected = useCallback(
    (task: PickingTask | null) => {
      dispatch(setSelectedTask(task));
    },
    [dispatch]
  );

  const clearSelected = useCallback(() => {
    dispatch(clearSelectedTask());
  }, [dispatch]);

  const fetchAvailable = useCallback(
    (params?: any) => {
      dispatch(fetchAvailableIssues(params || {}));
    },
    [dispatch]
  );

  const claimIssue = useCallback(
    async (issueId: number) => {
      return dispatch(claimInventoryIssue(issueId)).unwrap();
    },
    [dispatch]
  );

  return {
    tasks,
    selectedTask,
    loading,
    actionLoading,
    error,
    meta,
    fetchTasks,
    fetchTaskById,
    confirmTask,
    setSelected,
    clearSelected,
    availableIssues,
    issuesLoading,
    fetchAvailable,
    claimIssue,
  };
};

export default usePicking;
