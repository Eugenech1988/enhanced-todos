import { AddTask } from '@/components/AddTask';
import { SearchTasks } from '@/components/SearchTasks';
import { KanbanBoard } from '@/components/KanbanBoard';
import { MassActions } from '@/components/MassActions';
import { useTodo } from '@/context/todoContext';

export const App = () => {
  const {selectedIds} = useTodo();

  return (
    <div className="min-h-screen bg-gray-50 py-4">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <AddTask/>
          <SearchTasks/>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 max-h-[calc(100vh-151px)] flex flex-col relative w-full">
          <div className="mb-4 sm:mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Task Board</h2>
            <div className="flex flex-wrap justify-end items-center gap-2">
              <MassActions selectedCount={selectedIds.length}/>
            </div>
          </div>

          <div className="overflow-x-auto pb-4 w-full">
            <KanbanBoard/>
          </div>
        </div>
      </div>
    </div>
  );
};
