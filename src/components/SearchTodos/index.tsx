import { useTodo } from '@/context/todoContext';
import { useRef, useState } from 'react';
import { cn, debounce } from '@/utils';
import { Search } from 'lucide-react';
import { FilterDropdown } from '@/components/FilterDropdown';

export const SearchTodos = () => {
  const { setSearchQuery } = useTodo();
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [needsShakeAnimation, setNeedsShakeAnimation] = useState(false);

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

  // Определяем, должен ли цвет иконки быть синим
  const shouldShowBlueColor = isFocused || inputValue.trim() !== '';

  // Функция для обработки расфокуса
  const handleBlur = () => {
    setIsFocused(false);
    if (inputValue.trim() === '') {
      setNeedsShakeAnimation(true);
      setTimeout(() => setNeedsShakeAnimation(false), 500); // Сброс анимации после её завершения
    }
  };

  return (
    <div className="mb-4 flex flex-col sm:flex-row gap-4">
      <div className="relative flex-grow">
        <input
          ref={inputRef}
          type="text"
          id="search-todo-input"
          value={inputValue}
          onChange={handleChange}
          placeholder=" "
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          className={cn(
            'peer w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-blue-500 transition-all placeholder-transparent',
            'border-blue-500 placeholder-shown:border-gray-300 focus:border-blue-500',
            needsShakeAnimation && 'animate-shake'
          )}
        />
        <Search
          className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none`}
          color={shouldShowBlueColor ? '#3b82f6' : '#9ca3af'}
        />
        <label
          htmlFor="search-todo-input"
          className={cn(
            'absolute left-3 -top-2.5 bg-white px-1 text-sm transition-all text-blue-500',
            'peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-placeholder-shown:left-10',
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
