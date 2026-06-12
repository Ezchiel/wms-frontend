import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  fetchMyPickingTasks,
  fetchPickingTaskById,
  confirmPickingTask,
} from './pickingThunks';
import { setSelectedTask, clearSelectedTask } from './pickingSlice';
import type { PickingTask, PickingTaskStatus } from './pickingTypes';

export const usePicking = () => {
  const dispatch = useAppDispatch();
  const { tasks, selectedTask, loading, actionLoading, error, meta } =
    useAppSelector((state) => state.picking);

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
  };
};

export default usePicking;
