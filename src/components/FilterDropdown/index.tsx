import { useTodo } from '@/context/todoContext';
import { Activity, useState } from 'react';
import { cn } from '@/utils';
import { type TFilters } from '@/context/todoContext';
import { allowedFilters } from '@/constants';

type FilterDropdownProps = {
  className?: string;
};
export const FilterDropdown = ({className}: FilterDropdownProps) => {
  const {filter, setFilter} = useTodo();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSelectFilter = (selectedFilter: TFilters) => {
    setFilter(selectedFilter);
    setIsDropdownOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-white focus-visible:ring-2 focus-visible:ring-blue-500 capitalize"
        onClick={toggleDropdown}
      >
        {filter}
      </button>

      <Activity mode={isDropdownOpen ? 'visible' : 'hidden'}>
        <div className="absolute z-10 mt-1 w-48 bg-white shadow-lg rounded-md py-1">
          {(allowedFilters).map((filteredRes) => (
            <button
              key={filteredRes}
              className={cn(
                'block w-full text-left px-4 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:ring-offset-2 capitalize',
                filter === filteredRes ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
              )}
              onClick={() => handleSelectFilter(filteredRes)}
            >
              {filteredRes}
            </button>
          ))}
        </div>
      </Activity>
    </div>
  );
};