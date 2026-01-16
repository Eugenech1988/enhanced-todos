import { TodoList } from '@/components/TodoList';
import { TodoActions } from '@/components/TodoActions';

export const App = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-4">
      <div className="max-w-md mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">Enhanced Todos</h1>
        <TodoActions />
        <TodoList />
      </div>
    </div>
  );
};
