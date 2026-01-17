import { useTodo } from '@/context/todoContext.tsx';
import { Todo } from '@/components/Todo';
import { useTodoMonitor } from '@/hooks/useTodoDnD';
import { MassActions } from '@/components/MassActions';
import { useRef, useState, useEffect, useMemo } from 'react';

export const TodoList = () => {
  const {
    todos,
    searchQuery,
    filter,
    reorderTodos,
    selectAllTodos,
    clearSelectedTodos,
    selectedIds
  } = useTodo();

  const containerRef = useRef<HTMLDivElement>(null);
  const [showScrollHint, setShowScrollHint] = useState(false);

  const filteredTodos = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return todos.filter(todo => {
      const matchesSearch = !query || todo.title.toLowerCase().includes(query);
      const matchesFilter =
        filter === 'all' ||
        (filter === 'active' && !todo.completed) ||
        (filter === 'completed' && todo.completed);
      return matchesSearch && matchesFilter;
    });
  }, [todos, searchQuery, filter]);

  useEffect(() => {
    const checkScroll = () => {
      if (containerRef.current) {
        const { scrollHeight, clientHeight } = containerRef.current;
        setShowScrollHint(scrollHeight > clientHeight);
      }
    };

    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [filteredTodos]);

  const isAllSelected = filteredTodos.length > 0 && selectedIds.length === filteredTodos.length;

  const handleSelectAll = () => {
    isAllSelected ? clearSelectedTodos() : selectAllTodos();
  };

  useTodoMonitor(reorderTodos);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-h-[calc(100vh-220px)] flex flex-col relative">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Todos List</h2>
        <div className="flex flex-wrap justify-between items-center gap-2">
          <button
            onClick={handleSelectAll}
            className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 cursor-pointer transition-colors duration-200 shadow-sm active:scale-95"
          >
            {isAllSelected ? 'Clear all' : 'Select all'}
          </button>
          <MassActions selectedCount={selectedIds.length} />
        </div>
      </div>

      <div ref={containerRef} className="overflow-y-auto flex-grow pr-1 custom-scrollbar">
        {showScrollHint && (
          <div className="sticky top-0 right-0 h-0 z-10 pointer-events-none hidden md:block">
            <div className="absolute -top-2 right-2 text-[10px] font-medium text-gray-400 flex items-center gap-1 bg-white/80 px-2 py-1 rounded-full animate-pulse">
              <span>↑↓ Scroll</span>
            </div>
          </div>
        )}

        <ul className="space-y-3 mt-2 pb-4">
          {filteredTodos.length > 0 ? (
            filteredTodos.map((todo, index) => (
              <li
                key={todo.id}
                className="animate-in fade-in slide-in-from-top-2 duration-300 ease-out"
                style={{ animationFillMode: 'backwards', animationDelay: `${index * 30}ms` }}
              >
                <Todo
                  todo={todo}
                  index={index}
                  totalTodos={filteredTodos.length}
                />
              </li>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-gray-400 animate-in fade-in duration-500">
              <p className="text-sm">No tasks to display</p>
            </div>
          )}
        </ul>
      </div>
    </div>
  );
};