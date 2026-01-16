import { useTodo } from '@/context/todoContext';
import { Activity, useActionState, useState, useRef } from 'react';
import { cn } from '@/utils';

type State = {
  inputValue: string;
  error: string | null;
};

const initialState: State = {
  inputValue: '',
  error: null
};

export const AddTodo = () => {
  const { addTodo } = useTodo();
  const [isFocused, setIsFocused] = useState(false);
  const [needsShakeAnimation, setNeedsShakeAnimation] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function addTodoAction(_prevState: State, formData: FormData): Promise<State> {
    const inputValue = formData.get('inputValue') as string;

    if (!inputValue || !inputValue.trim()) {
      return { inputValue, error: 'Task title is required' };
    }

    if (inputValue.length > 100) {
      return { inputValue, error: 'Task title is too long' };
    }

    addTodo(inputValue.trim());
    return { inputValue: '', error: null };
  }

  const [state, formAction, isPending] = useActionState(addTodoAction, initialState);
  const showError = state.error && !isFocused;

  const handleBlur = () => {
    setIsFocused(false);
    const currentValue = inputRef.current?.value || '';
    if (!currentValue || !currentValue.trim()) {
      setNeedsShakeAnimation(true);
      // Сброс анимации через следующий тик
      requestAnimationFrame(() => {
        setNeedsShakeAnimation(false);
      });
    }
  };

  return (
    <form action={formAction} className="mb-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            id="add-todo-input"
            name="inputValue"
            ref={inputRef}
            defaultValue={initialState.inputValue}
            placeholder=" "
            onFocus={() => setIsFocused(true)}
            onBlur={handleBlur}
            className={cn(
              'peer w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-blue-500 transition-all placeholder-transparent',
              'border-blue-500 placeholder-shown:border-gray-300 focus:border-blue-500',
              showError && '!border-red-500',
              needsShakeAnimation && 'animate-shake'
            )}
            disabled={isPending}
          />
          <label
            htmlFor="add-todo-input"
            className={cn(
              'absolute left-4 -top-2.5 bg-white px-1 text-sm transition-all text-blue-500',
              'peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2',
              'peer-focus:-top-2.5 peer-focus:text-blue-500 peer-focus:text-sm',
              showError && 'text-red-500'
            )}
          >
            Enter a new todo
          </label>
        </div>
        <button
          type="submit"
          disabled={isPending}
          className={cn(
            'px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer disabled:opacity-50 transition-colors duration-200'
          )}
        >
          {isPending ? 'Adding...' : 'Add Todo'}
        </button>
      </div>
      <Activity mode={showError ? 'visible' : 'hidden'}>
        <p className={cn('mt-2 text-red-500 text-sm')}>
          {state.error}
        </p>
      </Activity>
    </form>
  );
};
