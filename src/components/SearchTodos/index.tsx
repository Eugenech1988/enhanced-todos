import { useTodo } from '@/context/todoContext';
import { useRef, useState } from 'react';
import { cn, debounce } from '@/utils';
import { Search } from 'lucide-react';

export const SearchTodos = () => {
  const { setSearchQuery, filter, setFilter } = useTodo();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

  const handleSelectFilter = (selectedFilter: 'all' | 'active' | 'completed') => {
    setFilter(selectedFilter);
    setIsDropdownOpen(false);
  };

  const getFilterLabel = () => {
    switch(filter) {
      case 'all': return 'All';
      case 'active': return 'Active';
      case 'completed': return 'Completed';
      default: return 'All';
    }
  };

  return (
    <div className="mb-4 flex flex-col sm:flex-row gap-4">
      <div className="relative flex-grow">
        <input
          ref={inputRef}
          type="text"
          defaultValue=""
          onChange={handleChange}
          placeholder="Search todos..."
          className={cn(
            'w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-blue-500 transition-all',
            'border-gray-300'
          )}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      </div>

      <div className="relative">
        <button
          className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-white focus-visible:ring-2 focus-visible:ring-blue-500"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          {getFilterLabel()}
        </button>

        {isDropdownOpen && (
          <div className="absolute z-10 mt-1 w-48 bg-white shadow-lg rounded-md py-1">
            {(['all', 'active', 'completed'] as const).map((f) => (
              <button
                key={f}
                className={cn(
                  'block w-full text-left px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                  filter === f ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                )}
                onClick={() => handleSelectFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
