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
    setSelectedIds,
    todos,
    filter,
    searchQuery
  } = useTodo();

  useTodoMonitor(reorderTodos, moveTaskToColumn, moveMultipleTasksToColumn, columns, selectedIds, setSelectedIds, todos, filter, searchQuery);

  return (
    <div className="grid grid-flow-row sm:grid-flow-col sm:auto-cols-[minmax(300px,_1fr)] overflow-x-auto gap-4 pb-4 h-full w-full">
      {columns.map((column, index) => (
        <Column key={column.id} column={column} index={index} />
      ))}
    </div>
  );
};