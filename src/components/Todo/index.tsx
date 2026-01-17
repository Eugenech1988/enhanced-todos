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

export const Todo = ({todo, index, totalTodos}: TodoProps) => {
  const {
    toggleTodo,
    removeTodo,
    updateTodo,
    filter,
    searchQuery,
    selectedIds,
    setSelectedIds
  } = useTodo();

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [isRemoving, setIsRemoving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const {elementRef, dragHandleRef, isDragging, closestEdge} = useTodoItemDnD({
    todo,
    index,
    filter
  });

  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      removeTodo(todo.id);
    }, 300);
  };

  const handleSelect = () =>
    setSelectedIds(selectedIds.includes(todo.id)
      ? selectedIds.filter(id => id !== todo.id)
      : [...selectedIds, todo.id]
    );

  const handleToggle = () => toggleTodo(todo.id);
  const handleEditClick = () => {
    setIsEditing(true);
    setEditTitle(todo.title);
  };

  const handleEditSave = () => {
    const trimmed = editTitle.trim();
    if (trimmed) updateTodo(todo.id, trimmed);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleEditSave();
    else if (e.key === 'Escape') {
      setEditTitle(todo.title);
      setIsEditing(false);
    }
  };

  const renderTitle = () => {
    if (!searchQuery) return todo.title;
    return todo.title.split(new RegExp(`(${searchQuery})`, 'gi')).map((part, i) =>
      part.toLowerCase() === searchQuery.toLowerCase()
        ? <span key={i} className="bg-yellow-200 text-gray-900 rounded-sm px-0.5">{part}</span>
        : part
    );
  };

  return (
    <li
      ref={elementRef}
      className={cn(
        'p-3 relative bg-white transition-all',
        'hover:bg-gray-50',
        index !== totalTodos - 1 && 'border-b border-gray-200',
        isDragging && 'opacity-50',
        isRemoving ? 'todo-exit' : 'todo-enter'
      )}
    >
      {closestEdge && (
        <div
          className={cn(
            'absolute left-0 right-0 h-0.5 bg-blue-500 z-10',
            closestEdge === 'top' ? 'top-0' : 'bottom-0'
          )}
        />
      )}

      <div className="flex items-center space-x-3">
        {filter === 'all' &&
          <>
            <div ref={dragHandleRef}
                 className="cursor-grab active:cursor-grabbing hover:text-gray-600 text-gray-400 shrink-0">
              <GripVertical size={20}/>
            </div>
            <button onClick={handleSelect} className="flex items-center shrink-0" type="button">
              <div className={cn(
                'w-5 h-5 flex items-center cursor-pointer justify-center rounded transition-colors duration-200',
                selectedIds.includes(todo.id) ? 'bg-indigo-500' : 'border border-gray-400'
              )}>
                {selectedIds.includes(todo.id) && <Check size={14} color="white"/>}
              </div>
            </button>
          </>
        }

        <div className="flex-1 min-w-0 mr-3">
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleEditSave}
              onKeyDown={handleKeyDown}
              className="w-full outline-none bg-transparent border-b-2 border-blue-500 py-0.5"
            />
          ) : (
            <span
              onClick={handleEditClick}
              className={cn(
                'block truncate text-gray-800 cursor-text hover:bg-gray-200/50 px-1 -mx-1 rounded transition-colors',
                todo.completed && 'line-through text-gray-400'
              )}
              title={todo.title || ''}
            >
              {renderTitle()}
            </span>
          )}
        </div>

        <button onClick={handleToggle}
                className="flex items-center cursor-pointer shrink-0 active:scale-90 transition-transform"
                type="button">
          <CircleCheck
            size={24}
            className={cn(
              'transition-all duration-300',
              todo.completed ? 'text-blue-500 fill-blue-500' : 'text-gray-300 fill-none'
            )}
            color={todo.completed ? 'white' : 'currentColor'}
          />
        </button>

        <button
          onClick={handleRemove}
          className="text-gray-400 cursor-pointer hover:text-red-500 transition-colors p-1 shrink-0"
          aria-label="Delete task"
        >
          <Trash2 size={18}/>
        </button>
      </div>
    </li>
  );
};