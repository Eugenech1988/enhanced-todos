import { useTodo } from '@/context/todoContext';
import { Column } from '@/components/Column';
import { useTodoMonitor } from '@/hooks/useTodoDnD';

export const KanbanBoard = () => {
  const {
    columns,
    reorderTodos,
    moveTaskToColumn,
    moveMultipleTasksToColumn,
    selectedIds,
    setSelectedIds
  } = useTodo();

  useTodoMonitor(reorderTodos, moveTaskToColumn, moveMultipleTasksToColumn, columns, selectedIds, setSelectedIds);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-4 min-h-[600px] w-full">
      {columns.map((column, index) => (
        <Column key={column.id} column={column} index={index} />
      ))}
    </div>
  );
};