import { useTodo } from '@/context/todoContext';
import { useState, useRef, Activity } from 'react';
import { useClickOutside } from '@/hooks/useClickOutside';
import { cn } from '@/utils';
import { type TFilters } from '@/context/todoContext';
import { allowedFilters } from '@/constants';
import { ChevronDown } from 'lucide-react';

type Props = {
  className?: string;
};

export const FilterDropdown = ({ className }: Props) => {
  const { filter, setFilter } = useTodo();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, () => setOpen(false));

  const toggle = () => setOpen(v => !v);

  const selectFilter = (value: TFilters) => {
    setFilter(value);
    setOpen(false);
  };

  return (
    <div ref={ref} className={cn('relative inline-block text-left', className)}>
      <button
        type="button"
        onClick={toggle}
        className={cn(
          'flex w-full cursor-pointer items-center justify-between px-4 py-2 text-md font-medium capitalize rounded-md border shadow-sm transition-all',
          open
            ? 'border-blue-500 text-blue-600 ring-blue-500'
            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
        )}
      >
        {filter}

        <ChevronDown
          size={16}
          className={cn(
            'ml-2 transition-transform duration-200',
            open && 'rotate-180'
          )}
        />
      </button>

      <Activity mode={open ? 'visible' : 'hidden'}>
        <div
          className={cn(
            'absolute left-0 z-20 mt-2 w-48 rounded-lg bg-white py-1 shadow-xl border border-gray-100',
            'origin-top transition-all duration-200',
            open
              ? 'opacity-100 scale-100'
              : 'opacity-0 scale-95 pointer-events-none'
          )}
        >
          {allowedFilters.map(f => (
            <button
              key={f}
              type="button"
              onClick={() => selectFilter(f)}
              className={cn(
                'block cursor-pointer w-full px-4 py-2 text-md text-left capitalize transition-colors',
                filter === f
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
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
