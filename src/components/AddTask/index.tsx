import { useTodo } from '@/context/todoContext';
import { useActionState, useRef } from 'react';
import { cn } from '@/utils';

type State = {
  error: string | null;
};

const initialState: State = {
  error: null
};

export const AddTask = () => {
  const { addTodo, columns } = useTodo();
  const inputRef = useRef<HTMLInputElement>(null);

  const addTodoAction = async (_: State, formData: FormData): Promise<State> => {
    const value = String(formData.get('inputValue') ?? '').trim();

    if (!value) {
      return { error: 'Task title is required' };
    }

    if (value.length > 100) {
      return { error: 'Task title is too long' };
    }

    const todoColumn = columns.find(col => col.title.toLowerCase() === 'to do');
    const columnId = todoColumn?.id;

    addTodo(value, columnId);
    inputRef.current?.form?.reset();

    return { error: null };
  };

  const [state, formAction, isPending] = useActionState(
    addTodoAction,
    initialState
  );

  const showError = Boolean(state.error);

  return (
    <form action={formAction} className="mb-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            name="inputValue"
            placeholder=" "
            disabled={isPending}
            className={cn(
              'peer w-full px-4 py-2 border rounded-lg transition-all',
              'placeholder-transparent focus:outline-none focus:ring-blue-500',
              'border-gray-300 focus:border-blue-500',
              showError && 'border-red-500 animate-shake'
            )}
          />

          <label
            className={cn(
              'absolute left-4 bg-white px-1 transition-all',
              'top-2 text-base text-gray-400',
              'peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500',
              'peer-not-placeholder-shown:-top-2.5 peer-not-placeholder-shown:text-sm',
              showError && 'text-red-500'
            )}
          >
            Enter a new task
          </label>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 cursor-pointer bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition"
        >
          {isPending ? 'Adding…' : 'Add Task'}
        </button>
      </div>

      {showError && (
        <p className="mt-2 text-sm text-red-500">
          {state.error}
        </p>
      )}
    </form>
  );
};