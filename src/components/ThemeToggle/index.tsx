import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

export const ThemeToggle = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full border-blue-500 border-1 dark:border-yellow-400 bg-gray-50 hover:bg-gray-200 cursor-pointer dark:bg-gray-600 dark:hover:bg-gray-500 transition-colors duration-200 focus:outline-none"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Moon
          data-testid="moon-icon"
          size={20}
          className="text-blue-500 dark:text-gray-300 transition-transform duration-200 hover:rotate-12"
        />
      ) : (
        <Sun
          data-testid="sun-icon"
          size={20}
          className="text-yellow-400 transition-transform duration-200 hover:-rotate-12"
        />
      )}
    </button>
  );
};
