import { useTodo } from '@/context/todoContext.tsx';
import { Todo } from '@/components/Todo';
import { useTodoMonitor } from '@/hooks/useTodoDnD';
import { MassActions } from '@/components/MassActions';
import { useRef, useState, useEffect } from 'react';

export const TodoList = () => {
  const { todos, searchQuery, filter, reorderTodos, selectAllTodos, clearSelectedTodos, selectedIds } = useTodo();
  const containerRef = useRef<HTMLDivElement>(null);
  const [showScrollHint, setShowScrollHint] = useState(false);

  const filteredTodos = todos.filter(todo =>
    (!searchQuery || todo.title.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (
      filter === 'all' ||
      (filter === 'active' && !todo.completed) ||
      (filter === 'completed' && todo.completed)
    )
  );

  useEffect(() => {
    if (containerRef.current) {
      const hasScrollbar = containerRef.current.scrollHeight > containerRef.current.clientHeight;
      setShowScrollHint(hasScrollbar);
    }
  }, [filteredTodos, searchQuery, filter]);

  const handleSelectAll = () => {
    if (selectedIds.length === filteredTodos.length) {
      clearSelectedTodos();
    } else {
      selectAllTodos();
    }
  };

  useTodoMonitor(reorderTodos);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-h-[calc(100vh-220px)] flex flex-col relative">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Todos List</h2>
        <div className="flex flex-wrap justify-between items-center">
          <button
            onClick={handleSelectAll}
            className="px-3 py-1 text-sm bg-indigo-500 text-white rounded hover:bg-indigo-600 cursor-pointer transition-colors duration-200"
          >
            {selectedIds.length === filteredTodos.length ? 'Clear all' : 'Select all'}
          </button>
          <MassActions selectedCount={selectedIds.length} />
        </div>
      </div>
      <div
        ref={containerRef}
        className="overflow-y-auto flex-grow"
      >
        {showScrollHint && (
          <div className="absolute top-10 right-4 text-xs text-gray-400 hidden md:block z-10">
            ↑↓ Scroll
          </div>
        )}
        <ul className="space-y-3 mt-4">
          {filteredTodos.length > 0 ? (
            filteredTodos.map((todo, index) => (
              <Todo
                key={todo.id}
                todo={todo}
                index={index}
                totalTodos={filteredTodos.length}
              />
            ))
          ) : (
            <li className="text-center text-gray-500 py-4">No tasks to display</li>
          )}
        </ul>
      </div>
    </div>
  );
};