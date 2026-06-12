import { useEffect, useState } from 'react';
import type { PickingTask } from './pickingTypes';
import { usePicking } from './usePicking';
import PickingTaskList from './components/PickingTaskList';
import PickingTaskDetail from './components/PickingTaskDetail';

type View = 'list' | 'detail';

export default function PickingFeature() {
  const {
    tasks,
    loading,
    actionLoading,
    fetchTasks,
    confirmTask,
    setSelected,
    clearSelected,
  } = usePicking();

  const [view, setView] = useState<View>('list');
  const [activeTask, setActiveTask] = useState<PickingTask | null>(null);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleSelectTask = (task: PickingTask) => {
    setActiveTask(task);
    setSelected(task);
    setView('detail');
  };

  const handleBackToList = () => {
    setView('list');
    setActiveTask(null);
    clearSelected();
    fetchTasks();
  };

  const handleRefresh = () => {
    fetchTasks();
  };

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

  return (
    <PickingTaskList
      tasks={tasks}
      loading={loading}
      onRefresh={handleRefresh}
      onSelectTask={handleSelectTask}
    />
  );
}
