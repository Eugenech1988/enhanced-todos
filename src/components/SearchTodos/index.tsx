import { useTodo } from '@/context/todoContext';
import { useRef, useState } from 'react';
import { cn, debounce } from '@/utils';
import { Search } from 'lucide-react';
import { FilterDropdown } from '@/components/FilterDropdown';

export const SearchTodos = () => {
  const { setSearchQuery } = useTodo();
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');

  const debouncedSetSearchQuery = useRef(
    debounce(() => {
      if (inputRef.current) {
        setSearchQuery(inputRef.current.value);
      }
    }, 300)
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    debouncedSetSearchQuery.current();
  };

  return (
    <div className="mb-4 flex flex-col sm:flex-row gap-2">
      <div className="relative flex-grow">
        <input
          ref={inputRef}
          type="text"
          id="search-todo-input"
          value={inputValue}
          onChange={handleChange}
          placeholder=" "
          required
          className={cn(
            'peer w-full px-4 leading-[42px] pl-10 border rounded-lg transition-all',
            'border-gray-300 focus:border-blue-500 focus:outline-none',
            'invalid:animate-shake',
            inputValue ? 'border-blue-500' : ''
          )}
        />
        <Search
          className={cn(
            'absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none transition-colors duration-200',
            'peer-placeholder-shown:text-gray-400 peer-focus:text-blue-500 peer-not-placeholder-shown:text-blue-500',
            inputValue ? 'text-blue-500' : ''
          )}
        />
        <label
          htmlFor="search-todo-input"
          className={cn(
            'absolute left-3 -top-2.5 bg-white px-1 text-sm transition-all',
            'peer-placeholder-shown:top-2 peer-placeholder-shown:left-10 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400',
            'peer-focus:-top-2.5 peer-focus:left-3 peer-focus:text-sm peer-focus:text-blue-500',
            inputValue ? '-top-2.5 left-3 text-sm text-blue-500' : ''
          )}
        >
          Search todos
        </label>
      </div>

      <FilterDropdown />
    </div>
  );
};
