import { AddTask } from '@/components/AddTask';
import { SearchTasks } from '@/components/SearchTasks';
import { KanbanBoard } from '@/components/KanbanBoard';
import { MassActions } from '@/components/MassActions';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useTodo } from '@/context/todoContext';

export const App = () => {
  const {selectedIds} = useTodo();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 transition-colors duration-200">
      <div className="flex items-center mb-4 px-4 sm:px-6 lg:px-8">
        <h1 className='text-3xl font-semibold text-gray-900 dark:text-white flex-grow text-center'>Kanban Board</h1>
        <div>
          <ThemeToggle />
        </div>
      </div>
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <AddTask/>
          <SearchTasks/>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-h-[calc(100vh-220px)] flex flex-col relative w-full max-w-7xl mx-auto">
          <div className="mb-4 sm:mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Task Board</h2>
            <div className="flex flex-wrap justify-end items-center gap-2">
              <MassActions selectedCount={selectedIds.length}/>
            </div>
          </div>

          <div className="overflow-x-auto pb-4">
            <KanbanBoard/>
          </div>
        </div>
      </div>
    </div>
  );
};
