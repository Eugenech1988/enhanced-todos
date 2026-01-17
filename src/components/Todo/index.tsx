import { type TTodo, useTodo } from '@/context/todoContext.tsx';
import { Trash2, CircleCheck, Check, GripVertical } from 'lucide-react';
import { cn } from '@/utils';
import { useTodoItemDnD } from '@/hooks/useTodoDnD';
import { useState, useRef, useEffect } from 'react';

type TodoProps = {
  todo: TTodo;
  index: number;
  totalTodos: number;
};

export const Todo = ({ todo, index, totalTodos }: TodoProps) => {
  const { toggleTodo, removeTodo, updateTodo, filter, searchQuery, selectedIds, setSelectedIds } = useTodo();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSelect = () => {
    if (selectedIds.includes(todo.id)) {
      setSelectedIds(selectedIds.filter(id => id !== todo.id));
    } else {
      setSelectedIds([...selectedIds, todo.id]);
    }
  };

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
    <li
      ref={elementRef}
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
          <div ref={dragHandleRef} className="cursor-grab hover:text-gray-600 text-gray-40">
            <GripVertical size={20} />
          </div>
        )}
        {filter === 'all' && (
          <button
            onClick={handleSelect}
            className="flex items-center cursor-pointer"
            type="button"
          >
            {selectedIds.includes(todo.id) ? (
              <span className="w-5 h-5 flex items-center justify-center rounded bg-indigo-500">
                <Check size={14} color="white" />
              </span>
            ) : (
              <span className="w-5 h-5 flex items-center justify-center rounded border border-gray-400"></span>
            )}
          </button>
        )}
        <div className="flex-1 min-w-0 mr-3">
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleEditSave}
              onKeyDown={handleKeyDown}
              className="w-full outline-none shadow-none focus:ring-0 border-b border-blue-500"
            />
          ) : (
            <span
              onClick={handleEditClick}
              className={cn(
                'block truncate text-gray-800 cursor-text hover:bg-gray-100 px-1 -mx-1 rounded',
                todo.completed && 'line-through text-blue-500'
              )}
              title={todo.title || ''}
            >
              {renderTitle()}
            </span>
          )}
        </div>
        <button
          onClick={handleToggle}
          className="flex items-center cursor-pointer"
          type="button"
        >
          <CircleCheck
            size={todo.completed ? 24 : 22}
            color={todo.completed ? "white" : "#9ca3af"}
            fill={todo.completed ? "#3b82f6" : "none"}
          />
        </button>
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