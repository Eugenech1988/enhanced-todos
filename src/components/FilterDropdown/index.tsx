import { useTodo } from '@/context/todoContext';
import { useState, useRef, type KeyboardEvent } from 'react';
import { useClickOutside } from '@/hooks/useClickOutside';
import { cn } from '@/utils';
import { type TFilters } from '@/context/todoContext';
import { allowedFilters } from '@/constants';
import { ChevronDown } from 'lucide-react';

export const FilterDropdown = ({ className }: { className?: string }) => {
  const { filter, setFilter } = useTodo();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, () => setOpen(false));

  const toggle = () => {
    setOpen((v) => !v);
    setActiveIndex(-1);
  };

  const selectFilter = (value: TFilters) => {
    if (value !== filter) {
      setFilter(value);
    }
    setOpen(false);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'Escape':
        setOpen(false);
        break;
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) => (prev < allowedFilters.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : allowedFilters.length - 1));
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (activeIndex >= 0) {
          selectFilter(allowedFilters[activeIndex]);
        } else {
          setOpen(false);
        }
        break;
      case 'Tab':
        setOpen(false);
        break;
    }
  };

  return (
    <div
      ref={ref}
      className={cn('relative inline-block text-left', className)}
      onKeyDown={handleKeyDown}
    >
      <button
        type="button"
        onClick={toggle}
        data-testid="filter-toggle"
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          'flex w-full cursor-pointer items-center justify-between px-4 py-2 text-md font-medium capitalize rounded-md border shadow-sm transition-all outline-none focus:border-blue-500',
          open ? 'border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400' : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
        )}
      >
        {filter}
        <ChevronDown
          size={16}
          className={cn('ml-2 transition-transform duration-200', open && 'rotate-180')}
        />
      </button>

      {open && (
        <div
          className="absolute right-0 md:left-0 md:right-[initial] z-20 mt-2 w-48 rounded-lg bg-white dark:bg-gray-800 py-1 shadow-xl border border-gray-100 dark:border-gray-600 origin-top animate-in fade-in zoom-in-95 duration-100"
          role="listbox"
          data-testid="filter-listbox"
        >
          {allowedFilters.map((f, index) => (
            <button
              key={f}
              type="button"
              data-testid={`filter-option-${f}`}
              onClick={() => selectFilter(f)}
              role="option"
              aria-selected={filter === f}
              className={cn(
                'block cursor-pointer w-full px-4 py-2 text-md text-left capitalize transition-colors outline-none',
                filter === f ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300',
                activeIndex === index ? 'bg-gray-100 dark:bg-gray-700' : 'hover:bg-gray-50 dark:hover:bg-gray-600'
              )}
            >
              {f}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};