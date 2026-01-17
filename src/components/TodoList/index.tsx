import { useTodo } from '@/context/todoContext.tsx';
import { Todo } from '@/components/Todo';
import { useTodoMonitor } from '@/hooks/useTodoDnD';

export const TodoList = () => {
  const { todos, searchQuery, filter, reorderTodos, selectAllTodos, clearSelectedTodos, selectedIds, removeSelectedTodos, setCompletedForSelected } = useTodo();

  const filteredTodos = todos.filter(todo => {
    const matchesSearch = searchQuery
      ? todo.title.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    if (filter === 'active') {
      return matchesSearch && !todo.completed;
    } else if (filter === 'completed') {
      return matchesSearch && todo.completed;
    } else {
      return matchesSearch;
    }
  });

  const handleSelectAll = () => {
    if (selectedIds.length === filteredTodos.length) {
      clearSelectedTodos();
    } else {
      selectAllTodos();
    }
  };

  const handleSetCompleted = () => {
    setCompletedForSelected(true);
  };

  const handleSetActive = () => {
    setCompletedForSelected(false);
  };

  useTodoMonitor(reorderTodos);

  return (
    <div
      className="bg-white rounded-lg shadow-md p-6 max-h-[calc(100vh-220px)] overflow-y-auto relative"
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Todos List</h2>
      {/* Scroll hint indicator */}
      <div className="absolute top-10 right-4 text-xs text-gray-400 hidden md:block">
        ↑↓ Scroll
      </div>
      <div className="mb-4 flex flex-wrap justify-between items-center">
        <button
          onClick={handleSelectAll}
          className="px-3 py-1 text-sm bg-indigo-500 text-white rounded hover:bg-indigo-600 cursor-pointer transition-colors duration-200"
        >
          {selectedIds.length === filteredTodos.length ? 'Clear all' : 'Select all'}
        </button>
        {selectedIds.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={removeSelectedTodos}
              className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer transition-colors duration-200"
            >
              Delete selected ({selectedIds.length})
            </button>
            <button
              onClick={handleSetCompleted}
              className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer transition-colors duration-200"
            >
              Set completed
            </button>
            <button
              onClick={handleSetActive}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer transition-colors duration-200"
            >
              Set active
            </button>
          </div>
        )}
      </div>
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
  );
};