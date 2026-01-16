import { type TTodo, useTodo } from '@/context/todoContext.tsx';
import { Trash2, Check, GripVertical } from 'lucide-react';
import { cn } from '@/utils';
import { useTodoItemDnD } from '@/hooks/useTodoDnD';

type TodoProps = {
  todo: TTodo;
  index: number;
  totalTodos: number;
};

export const Todo = ({ todo, index, totalTodos }: TodoProps) => {
  const { toggleTodo, removeTodo, filter } = useTodo();

  const { elementRef, dragHandleRef, isDragging, closestEdge } = useTodoItemDnD({
    todo,
    index,
    filter
  });

  const handleToggle = () => {
    toggleTodo(todo.id);
  };

  const handleRemove = () => {
    removeTodo(todo.id);
  };

  return (
    <li
      ref={elementRef}
      className={cn(
        'p-3 relative',
        'hover:bg-gray-50',
        index !== totalTodos - 1 && 'border-b border-gray-200',
        isDragging && 'opacity-70'
      )}
    >
      {closestEdge === 'top' && <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-500" />}
      {closestEdge === 'bottom' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />}

      <div className="flex items-center space-x-3">
        {filter === 'all' && (
          <div ref={dragHandleRef} className="cursor-grab hover:text-gray-600 text-gray-400">
            <GripVertical size={20} />
          </div>
        )}
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={handleToggle}
            className="sr-only"
          />
          <span
            className={cn('flex items-center justify-center h-6 w-6 border-2 rounded-md mr-2 transition-colors duration-200',
              todo.completed
                ? 'bg-blue-500 border-blue-500'
                : 'border-gray-300 hover:border-blue-40')}>
            {todo.completed && (
              <Check size={18} color="white" />
            )}
          </span>
        </label>
        <div className="flex-1 min-w-0 mr-2">
          <span
            className={cn(
              'block truncate text-gray-800',
              todo.completed && 'line-through text-red-500'
            )}
            title={todo.title || ''}
          >
            {todo.title || ''}
          </span>
        </div>
        <button
          onClick={handleRemove}
          className="text-red-500 hover:text-red-700 transition-colors duration-200 cursor-pointer"
          aria-label="Delete task"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </li>
  );
};