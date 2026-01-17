import { TaskList } from '@/components/TaskList';
import { AddTodo } from '@/components/AddTodo';
import { SearchTodos } from '@/components/SearchTodos';

export const App = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-4">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">Kanban Board</h1>
        <div className="max-w-3xl mx-auto space-y-6">
          <AddTodo/>
          <SearchTodos/>
        </div>
        <TaskList/>
      </div>
    </div>
  );
};
