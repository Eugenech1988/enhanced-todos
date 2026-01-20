import { useTodo } from '@/context/todoContext';
import { useRef } from 'react';
import { cn, debounce } from '@/utils';
import { Search } from 'lucide-react';
import { FilterDropdown } from '@/components/FilterDropdown';

export const SearchTasks = () => {
  const { setSearchQuery } = useTodo();
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedSetSearchQuery = useRef(
    debounce(() => {
      if (inputRef.current) {
        setSearchQuery(inputRef.current.value);
      }
    }, 300)
  ).current;

  const handleChange = () => {
    debouncedSetSearchQuery();
  };

  return (
    <div className="mb-4 flex flex-col sm:flex-row gap-2">
      <div className="relative flex-grow">
        <input
          ref={inputRef}
          type="text"
          id="search-task-input"
          data-testid="search-input"
          onChange={handleChange}
          placeholder=" "
          className={cn(
            'peer w-full px-4 leading-[42px] pl-10 border rounded-lg transition-all',
            'border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none',
            'bg-white dark:bg-gray-800',
            'peer-[:not(:placeholder-shown)]:border-blue-500'
          )}
        />

        <Search
          className={cn(
            'absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none transition-colors duration-200 text-gray-400 dark:text-gray-500',
            'peer-focus:text-blue-500',
            'peer-[:not(:placeholder-shown)]:text-blue-500'
          )}
        />

        <label
          htmlFor="search-task-input"
          className={cn(
            'absolute transition-all bg-white dark:bg-gray-800 px-1 pointer-events-none cursor-text',
            'left-10 top-2 text-base text-gray-400 dark:text-gray-500',
            'peer-placeholder-shown:top-2 peer-placeholder-shown:left-10 peer-placeholder-shown:text-base',
            'peer-focus:-top-2.5 peer-focus:left-3 peer-focus:text-sm peer-focus:text-blue-500',
            'peer-[:not(:placeholder-shown)]:-top-2.5 peer-[:not(:placeholder-shown)]:left-3 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:text-blue-500'
          )}
        >
          Search tasks
        </label>
      </div>

      <FilterDropdown />
    </div>
  );
};