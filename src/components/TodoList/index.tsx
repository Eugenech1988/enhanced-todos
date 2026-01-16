import { useTodo } from '@/context/todoContext.tsx';
import { Todo } from '@/components/Todo';

export const TodoList = () => {
  const { todos } = useTodo();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Task List</h2>
      <ul className="space-y-3">
        {todos.map((todo, index) => (
          <Todo
            key={todo.id}
            todo={todo}
            index={index}
            totalTodos={todos.length}
          />
        ))}
      </ul>
    </div>
  );
};