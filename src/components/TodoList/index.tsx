import { useTodo } from '@/context/todoContext.tsx';
import { Todo } from '@/components/Todo';

export const TodoList = () => {
  const { todos, searchQuery, filter } = useTodo();

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

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Todos List</h2>
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