import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from './index';

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
};

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

const setMatchMedia = (matches: boolean) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }),
  });
};

describe('ThemeToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.documentElement.classList.remove('dark');
    document.documentElement.style.colorScheme = '';
    setMatchMedia(false);
  });

  it('renders and initializes theme correctly', () => {
    localStorageMock.getItem.mockReturnValue('dark');
    const { rerender } = render(<ThemeToggle />);
    expect(screen.getByTestId('sun-icon')).toBeInTheDocument();

    localStorageMock.getItem.mockReturnValue(null);
    setMatchMedia(true);
    rerender(<ThemeToggle />);
    expect(screen.getByTestId('sun-icon')).toBeInTheDocument();
  });

  it('toggles theme on click', () => {
    localStorageMock.getItem.mockReturnValue('light');
    render(<ThemeToggle />);

    fireEvent.click(screen.getByTestId('moon-icon'));
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.style.colorScheme).toBe('dark');

    fireEvent.click(screen.getByTestId('sun-icon'));
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(document.documentElement.style.colorScheme).toBe('light');
  });

  it('updates UI icon when theme changes', () => {
    localStorageMock.getItem.mockReturnValue('light');
    const { rerender } = render(<ThemeToggle />);

    expect(screen.getByTestId('moon-icon')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('moon-icon'));
    rerender(<ThemeToggle />);
    expect(screen.getByTestId('sun-icon')).toBeInTheDocument();
  });
});
