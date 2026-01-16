import { useTodo } from '@/context/todoContext';
import { Activity, useActionState } from 'react';
import { cn } from '@/utils';

type State = {
  inputValue: string;
  error: string | null;
};

const initialState: State = {
  inputValue: '',
  error: null
};

export const TodoActions = () => {
  const {addTodo} = useTodo();

  async function addTodoAction(_prevState: State, formData: FormData): Promise<State> {
    const inputValue = formData.get('inputValue') as string;

    if (!inputValue || !inputValue.trim()) {
      return {inputValue, error: 'Task title is required'};
    }

    if (inputValue.length > 100) {
      return {inputValue, error: 'Task title is too long'};
    }

    addTodo(inputValue.trim());
    return {inputValue: '', error: null};
  }

  const [state, formAction, isPending] = useActionState(addTodoAction, initialState);

  return (
    <form action={formAction} className="mb-8">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            name="inputValue"
            defaultValue=""
            placeholder="Enter a new todo"
            className={cn(
              'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-blue-500 transition-all',
              state.error ? 'border-red-500' : 'border-gray-300'
            )}
            disabled={isPending}
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className={cn(
            'px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer disabled:opacity-50'
          )}
        >
          {isPending ? 'Adding...' : 'Add Todo'}
        </button>
      </div>
      <Activity mode={state.error ? 'visible' : 'hidden'}>
        <p className={cn(state.error ? 'block' : 'hidden', 'mt-2 text-red-500 text-sm')}>
          {state.error}
        </p>
      </Activity>
    </form>
  );
};
