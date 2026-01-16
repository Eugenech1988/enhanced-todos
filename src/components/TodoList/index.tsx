import { useTodo } from '@/context/todoContext.tsx';
import { Todo } from '@/components/Todo';

export const TodoList = () => {
  const { todos, searchQuery } = useTodo();

  // Filter todos based on search query
  const filteredTodos = todos.filter(todo =>
    todo.title && searchQuery
      ? todo.title.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Todos List</h2>
      <ul className="space-y-3">
        {filteredTodos.map((todo, index) => (
          <Todo
            key={todo.id}
            todo={todo}
            index={index}
            totalTodos={filteredTodos.length}
          />
        ))}
      </ul>
    </div>
  );
};