import { useTodo } from '@/context/todoContext';
import type { TTodo } from '@/context/todoContext';
import { Task } from '@/components/Task';
import { useMemo, useRef, useEffect } from 'react';
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
    setSelectedIds
  } = useTodo();
  
  const columnRef = useRef<HTMLDivElement>(null);
  
  // Set up drop target for the column container to allow dropping tasks from other columns
  useEffect(() => {
    const element = columnRef.current;
    if (!element) return;
    
    return dropTargetForElements({
      element,
      getData: () => ({ type: 'column', columnId: column.id }),
      onDrop: (arg) => {
        const sourceData = arg.source.data;
        if (sourceData.type === 'todo' && sourceData.columnId !== column.id) {
          // Check if multiple items are selected and the source todo is among them
          if (selectedIds.length > 1 && selectedIds.includes((sourceData.todo as TTodo).id)) {
            // Get all selected tasks that belong to the source column
            const selectedTasksInSourceColumn = selectedIds.filter(id => {
              // Find which column this task belongs to by checking all columns
              return columns.some(col =>
                col.id === sourceData.columnId &&
                col.todoIds.includes(id)
              );
            });
            
            // Move only the selected items from the source column to this column
            if (selectedTasksInSourceColumn.length > 0) {
              moveMultipleTasksToColumn(selectedTasksInSourceColumn, column.id);
            } else {
              // If no selected tasks are in the source column, move just the source task
              moveTaskToColumn((sourceData.todo as TTodo).id, column.id);
            }
          } else {
            // Move only the single dragged item
            moveTaskToColumn((sourceData.todo as TTodo).id, column.id);
          }
        }
      },
    });
  }, [column.id, moveTaskToColumn, moveMultipleTasksToColumn, selectedIds, setSelectedIds, columns]);

  const filteredTodos = useMemo(() => {
    const query = searchQuery.toLowerCase();
    const columnTodos = todos.filter(todo => column.todoIds.includes(todo.id));
    
    return columnTodos.filter(todo => {
      const matchesSearch = !query || todo.title.toLowerCase().includes(query);
      const matchesFilter =
        filter === 'all' ||
        (filter === 'active' && !todo.completed) ||
        (filter === 'completed' && todo.completed);
      return matchesSearch && matchesFilter;
    });
  }, [todos, column.todoIds, searchQuery, filter]);


  // Determine if all visible tasks in this column are currently selected
  const allVisibleTasksInColumnSelected = useMemo(() => {
    const columnTodos = todos.filter(todo => column.todoIds.includes(todo.id));
    const filteredColumnTodos = columnTodos.filter(todo => {
      const matchesSearch = !searchQuery || todo.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter =
        filter === 'all' ||
        (filter === 'active' && !todo.completed) ||
        (filter === 'completed' && todo.completed);
      return matchesSearch && matchesFilter;
    });

    const filteredColumnTodoIds = filteredColumnTodos.map(todo => todo.id);
    return filteredColumnTodoIds.length > 0 &&
           filteredColumnTodoIds.every(todoId => selectedIds.includes(todoId));
  }, [todos, column.todoIds, searchQuery, filter, selectedIds]);

  const handleSelectAllInColumn = () => {
    // Get all task IDs in this column that match the current filter
    const columnTodos = todos.filter(todo => column.todoIds.includes(todo.id));
    const filteredColumnTodos = columnTodos.filter(todo => {
      const matchesSearch = !searchQuery || todo.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter =
        filter === 'all' ||
        (filter === 'active' && !todo.completed) ||
        (filter === 'completed' && todo.completed);
      return matchesSearch && matchesFilter;
    });

    const todoIds = filteredColumnTodos.map(todo => todo.id);
    
    if (allVisibleTasksInColumnSelected) {
      // If all are selected, clear them from selection
      setSelectedIds(prev => prev.filter(id => !todoIds.includes(id)));
    } else {
      // If not all are selected, select them all
      setSelectedIds(prev => [...new Set([...prev, ...todoIds])]);
    }
  };

  return (
    <div ref={columnRef} className="flex flex-col bg-gray-100 rounded-lg shadow-sm p-4 min-h-[500px] max-h-[calc(100vh-100px)]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-gray-800">
            {column.title}
          </h3>
        </div>
        <button
          onClick={handleSelectAllInColumn}
          className="px-3 py-1.5 text-xs bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 cursor-pointer transition-colors duration-200 shadow-sm"
        >
          {allVisibleTasksInColumnSelected ? 'Clear All' : 'Select All'}
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2">
        <ul className="space-y-2">
          {filteredTodos.length > 0 ? (
            filteredTodos.map((todo, filteredIdx) => {
              const actualIndex = column.todoIds.indexOf(todo.id);
              return (
                <Task
                  key={todo.id}
                  todo={todo}
                  index={actualIndex}
                  totalTodos={filteredTodos.length}
                  columnId={column.id}
                  animationDelay={filteredIdx * 30}
                />
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-gray-400 text-sm">
              <p>No tasks</p>
            </div>
          )}
        </ul>
      </div>
    </div>
  );
};