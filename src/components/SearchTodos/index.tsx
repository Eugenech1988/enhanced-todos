import { useTodo } from '@/context/todoContext';
import { useRef } from 'react';
import { cn, debounce } from '@/utils';
import { Search } from 'lucide-react';

export const SearchTodos = () => {
  const { setSearchQuery, searchQuery } = useTodo();
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
    <div className="mb-4">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          defaultValue={searchQuery}
          onChange={handleChange}
          placeholder="Search todos..."
          className={cn(
            'w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-blue-500 transition-all',
            'border-gray-300'
          )}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      </div>
    </div>
  );
};
