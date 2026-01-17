import { useTodo } from '@/context/todoContext.tsx';
import { KanbanBoard } from '@/components/KanbanBoard';
import { MassActions } from '@/components/MassActions';

export const TaskList = () => {
  const {
    selectedIds
  } = useTodo();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-h-[calc(100vh-220px)] flex flex-col relative w-full">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Task Board</h2>
        <div className="flex flex-wrap justify-end items-center gap-2">
          <MassActions selectedCount={selectedIds.length} />
        </div>
      </div>
      
      <div className="overflow-x-auto pb-4 w-full">
        <KanbanBoard />
      </div>
    </div>
  );
};