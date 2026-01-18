import { useTodo } from '@/context/todoContext';
import type { TTodo } from '@/context/todoContext';
import { Task } from '@/components/Task';
import { useRef, useEffect } from 'react';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

type ColumnProps = {
  column: {
    id: string;
    title: string;
    todoIds: string[];
  };
  index: number;
};

export const Column = ({ column }: ColumnProps) => {
  const {
    todos,
    columns,
    filter,
    searchQuery,
    moveTaskToColumn,
    moveMultipleTasksToColumn,
    selectedIds,
    setSelectedIds,
  } = useTodo();

  const columnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = columnRef.current;
    if (!element) return;

    return dropTargetForElements({
      element,
      getData: () => ({ type: 'column', columnId: column.id }),
      onDrop: (arg) => {
        const sourceData = arg.source.data;

        if (sourceData.type === 'todo' && sourceData.columnId !== column.id) {
          if (column.todoIds.length === 0) {
            const todoId = (sourceData.todo as TTodo).id;

            if (selectedIds.length > 1 && selectedIds.includes(todoId)) {
              const selectedTasksInSourceColumn = selectedIds.filter(id => {
                const todo = todos.find(t => t.id === id);
                if (!todo) return false;

                const matchesSearch =
                  !searchQuery || todo.title.toLowerCase().includes(searchQuery.toLowerCase());

                const matchesFilter =
                  filter === 'all' ||
                  (filter === 'active' && !todo.completed) ||
                  (filter === 'completed' && todo.completed);

                const inColumn = columns.some(
                  col => col.id === sourceData.columnId && col.todoIds.includes(id)
                );

                return matchesSearch && matchesFilter && inColumn;
              });

              if (selectedTasksInSourceColumn.length > 0) {
                moveMultipleTasksToColumn(selectedTasksInSourceColumn, column.id);
                return;
              }
            }

            moveTaskToColumn(todoId, column.id);
          }
        }
      },
    });
  }, [
    column.id,
    column.todoIds.length,
    moveTaskToColumn,
    moveMultipleTasksToColumn,
    selectedIds,
    columns,
    todos,
    filter,
    searchQuery,
  ]);

  const allVisibleTasksInColumnSelected = (() => {
    const filteredTodoIds = todos
      .filter(todo => column.todoIds.includes(todo.id))
      .filter(todo => {
        const matchesSearch =
          !searchQuery || todo.title.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesFilter =
          filter === 'all' ||
          (filter === 'active' && !todo.completed) ||
          (filter === 'completed' && todo.completed);

        return matchesSearch && matchesFilter;
      })
      .map(todo => todo.id);

    return (
      filteredTodoIds.length > 0 &&
      filteredTodoIds.every(id => selectedIds.includes(id))
    );
  })();

  const handleSelectAllInColumn = () => {
    const visibleTodoIds = todos
      .filter(todo => column.todoIds.includes(todo.id))
      .filter(todo => {
        const matchesSearch =
          !searchQuery || todo.title.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesFilter =
          filter === 'all' ||
          (filter === 'active' && !todo.completed) ||
          (filter === 'completed' && todo.completed);

        return matchesSearch && matchesFilter;
      })
      .map(todo => todo.id);

    if (allVisibleTasksInColumnSelected) {
      setSelectedIds(prev => prev.filter(id => !visibleTodoIds.includes(id)));
    } else {
      setSelectedIds(prev => [...new Set([...prev, ...visibleTodoIds])]);
    }
  };

  return (
    <div
      ref={columnRef}
      className="flex flex-col bg-gray-100 rounded-lg shadow-sm p-4 min-h-[500px] w-full"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {column.title}
        </h3>

        <button
          onClick={handleSelectAllInColumn}
          className="px-3 py-1.5 text-xs bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors"
        >
          {allVisibleTasksInColumnSelected ? 'Clear All' : 'Select All'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2">
        <ul className="space-y-2">
          {column.todoIds.length > 0 ? (
            column.todoIds.map((todoId, index) => {
              const todo = todos.find(t => t.id === todoId);
              if (!todo) return null;

              const matchesSearch =
                !searchQuery ||
                todo.title.toLowerCase().includes(searchQuery.toLowerCase());

              const matchesFilter =
                filter === 'all' ||
                (filter === 'active' && !todo.completed) ||
                (filter === 'completed' && todo.completed);

              if (!matchesSearch || !matchesFilter) return null;

              return (
                <Task
                  key={todo.id}
                  todo={todo}
                  index={index}
                  totalTodos={column.todoIds.length}
                  columnId={column.id}
                  animationDelay={index * 30}
                />
              );
            })
          ) : (
            <div className="flex items-center justify-center py-10 text-gray-400 text-sm">
              No tasks
            </div>
          )}
        </ul>
      </div>
    </div>
  );
};
