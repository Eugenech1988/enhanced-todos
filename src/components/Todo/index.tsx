import { type TTodo, useTodo } from '@/context/todoContext.tsx';
import { Trash2, Check, GripVertical } from 'lucide-react';
import { cn } from '@/utils';
import { useTodoItemDnD } from '@/hooks/useTodoDnD';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

type TodoProps = {
  todo: TTodo;
  index: number;
  totalTodos: number;
};

export const Todo = ({ todo, index, totalTodos }: TodoProps) => {
  const { toggleTodo, removeTodo, updateTodo, filter, searchQuery } = useTodo();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);

  const { elementRef, dragHandleRef, isDragging, closestEdge } = useTodoItemDnD({
    todo,
    index,
    filter
  });

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleToggle = () => {
    toggleTodo(todo.id);
  };

  const handleRemove = () => {
    removeTodo(todo.id);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setEditTitle(todo.title);
  };

  const handleEditSave = () => {
    if (editTitle.trim()) {
      updateTodo(todo.id, editTitle.trim());
    } else {
      setEditTitle(todo.title);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEditSave();
    } else if (e.key === 'Escape') {
      setEditTitle(todo.title);
      setIsEditing(false);
    }
  };

  const renderTitle = () => {
    if (!searchQuery || !todo.title) return todo.title;

    const parts = todo.title.split(new RegExp(`(${searchQuery})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === searchQuery.toLowerCase() ? (
        <span key={i} className="bg-yellow-200 text-gray-900 rounded-sm px-0.5">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <motion.li
      ref={elementRef}
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'p-3 relative',
        'hover:bg-gray-50',
        index !== totalTodos - 1 && 'border-b border-gray-200',
        isDragging && 'opacity-50'
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
                : 'border-gray-300 hover:border-blue-400')}>
            {todo.completed && (
              <Check size={18} color="white" />
            )}
          </span>
        </label>
        <div className="flex-1 min-w-0 pr-2">
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleEditSave}
              onKeyDown={handleKeyDown}
              className="w-full px-2 py-1 outline-none shadow-none focus:ring-0 border-b border-blue-500 ml-2"
            />
          ) : (
            <span
              onClick={handleEditClick}
              className={cn(
                'block truncate text-gray-800 cursor-text hover:bg-gray-100 px-1 -mx-1 rounded',
                todo.completed && 'line-through text-red-500'
              )}
              title={todo.title || ''}
            >
              {renderTitle()}
            </span>
          )}
        </div>
        <button
          onClick={handleRemove}
          className="text-red-500 hover:text-red-700 transition-colors duration-200 cursor-pointer"
          aria-label="Delete task"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </motion.li>
  );
};