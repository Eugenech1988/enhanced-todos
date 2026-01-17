import { useTodo } from '@/context/todoContext';
import { useState, useRef, type KeyboardEvent, Activity } from 'react';
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
    setOpen(v => !v);
    setActiveIndex(-1);
  };

  const selectFilter = (value: TFilters) => () => {
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
        setActiveIndex(prev => (prev < allowedFilters.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(prev => (prev > 0 ? prev - 1 : allowedFilters.length - 1));
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
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          'flex w-full cursor-pointer items-center justify-between px-4 py-2 text-md font-medium capitalize rounded-md border shadow-sm transition-all outline-none focus:border-blue-500',
          open ? 'border-blue-500 text-blue-600' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
        )}
      >
        {filter}
        <ChevronDown size={16} className={cn('ml-2 transition-transform duration-200', open && 'rotate-180')} />
      </button>

      <Activity mode={open ? 'visible' : 'hidden'}>
        <div
          className={cn(
            'absolute left-0 z-20 mt-2 w-48 rounded-lg bg-white py-1 shadow-xl border border-gray-100 transition-all duration-200 origin-top',
            open ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
          )}
        >
          {allowedFilters.map((f, index) => (
            <button
              key={f}
              type="button"
              onClick={selectFilter(f)}
              className={cn(
                'block cursor-pointer hover:bg-gray-100 w-full px-4 py-2 text-md text-left capitalize transition-colors outline-none',
                filter === f ? 'bg-blue-50 text-blue-700' : 'text-gray-700',
                activeIndex === index ? 'bg-gray-100' : ''
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </Activity>
    </div>
  );
};