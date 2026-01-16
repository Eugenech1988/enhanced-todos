import { type TTodo, useTodo } from '@/context/todoContext.tsx';
import { Trash2, Check } from 'lucide-react';
import { cn } from '@/utils';

type TodoProps = {
  todo: TTodo;
  index: number;
  totalTodos: number;
};

export const Todo = ({todo, index, totalTodos}: TodoProps) => {
  const {toggleTodo, removeTodo} = useTodo();

  const handleToggle = () => {
    toggleTodo(todo.id);
  };

  const handleRemove = () => {
    removeTodo(todo.id);
  };

  return (
    <li className={cn(
      'p-3',
      'hover:bg-gray-50',
      index !== totalTodos - 1 && 'border-b border-gray-200'
    )}>
      <div className="flex items-center space-x-3">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={handleToggle}
            className="sr-only"
          />
          <span
            className={cn('flex items-center justify-center h-5 w-5 border-2 rounded-md mr-2 transition-colors duration-200',
              todo.completed
                ? 'bg-blue-500 border-blue-500'
                : 'border-gray-300 hover:border-blue-40')}>
            {todo.completed && (
              <Check size={12} color="white"/>
            )}
          </span>
        </label>
        <div className="flex-1 min-w-0 mr-2">
          <span
            className={cn(
              'block truncate text-gray-800',
              todo.completed && 'line-through text-red-500'
            )}
            title={todo.title}
          >
            {todo.title}
          </span>
        </div>
        <button
          onClick={handleRemove}
          className="text-red-500 hover:text-red-700 transition-colors duration-200 cursor-pointer"
          aria-label="Delete task"
        >
          <Trash2 size={20}/>
        </button>
      </div>
    </li>
  );
};