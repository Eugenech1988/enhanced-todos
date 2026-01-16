import { useTodo } from '@/context/todoContext';
import { useRef } from 'react';
import { cn, debounce } from '@/utils';
import { Search } from 'lucide-react';
import { FilterDropdown } from '@/components/FilterDropdown';

export const SearchTodos = () => {
  const { setSearchQuery } = useTodo();
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedSetSearchQuery = useRef(
    debounce(() => {
      if (inputRef.current) {
        setSearchQuery(inputRef.current.value);
      }
    }, 300)
  );

  const handleChange = () => {
    debouncedSetSearchQuery.current();
  };

  return (
    <div className="mb-4 flex flex-col sm:flex-row gap-4">
      <div className="relative flex-grow">
        <input
          ref={inputRef}
          type="text"
          id="search-todo-input"
          defaultValue=""
          onChange={handleChange}
          placeholder=" "
          className={cn(
            'peer w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-blue-500 transition-all placeholder-transparent',
            'border-blue-500 placeholder-shown:border-gray-300 focus:border-blue-500'
          )}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
        <label
          htmlFor="search-todo-input"
          className={cn(
            'absolute left-3 -top-2.5 bg-white px-1 text-sm transition-all text-blue-500',
            'peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-placeholder-shown:left-10',
            'peer-focus:-top-2.5 peer-focus:text-blue-500 peer-focus:text-sm peer-focus:left-3'
          )}
        >
          Search todos...
        </label>
      </div>

      <FilterDropdown />
    </div>
  );
};
