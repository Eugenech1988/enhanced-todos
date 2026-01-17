import { useTodo } from '@/context/todoContext';

type MassActionsProps = {
  selectedCount: number;
};

export const MassActions = ({ selectedCount }: MassActionsProps) => {
  const { removeSelectedTodos, setCompletedForSelected } = useTodo();

  const handleSetCompleted = () => {
    setCompletedForSelected(true);
  };

  const handleSetActive = () => {
    setCompletedForSelected(false);
  };

  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 justify-end">
      <button
        onClick={removeSelectedTodos}
        className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer transition-colors duration-200 min-w-[120px]"
      >
        Delete ({selectedCount})
      </button>
      <button
        onClick={handleSetCompleted}
        className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer transition-colors duration-200 min-w-[100px]"
      >
        Complete
      </button>
      <button
        onClick={handleSetActive}
        className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer transition-colors duration-200 min-w-[80px]"
      >
        Active
      </button>
    </div>
  );
};