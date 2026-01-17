import { TaskList } from '@/components/TaskList';
import { AddTask } from '@/components/AddTask';
import { SearchTasks } from '@/components/SearchTasks';

export const App = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-4">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <AddTask/>
          <SearchTasks/>
        </div>
        <TaskList/>
      </div>
    </div>
  );
};
