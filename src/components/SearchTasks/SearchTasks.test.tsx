import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchTasks } from './index';

const setSearchQueryMock = vi.fn();

vi.mock('@/context/todoContext', async () => {
  const actual = await vi.importActual<typeof import('@/context/todoContext')>(
    '@/context/todoContext'
  );
  return {
    ...actual,
    useTodo: () => ({
      setSearchQuery: setSearchQueryMock,
    }),
  };
});

vi.mock('@/utils', async () => {
  const actual = await vi.importActual<typeof import('@/utils')>('@/utils');
  return {
    ...actual,
    debounce: (fn: (...args: any[]) => any) => {
      return fn;
    },
  };
});

describe('SearchTasks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders search input with correct data-testid and label', () => {
    render(<SearchTasks />);
    const input = screen.getByTestId('search-input');

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', ' ');
    expect(screen.getByLabelText('Search tasks')).toBeInTheDocument();
  });

  it('calls setSearchQuery when input value changes', () => {
    render(<SearchTasks />);
    const input = screen.getByTestId('search-input');

    // Изменяем значение input через fireEvent
    fireEvent.change(input, { target: { value: 'test query' } });

    expect(setSearchQueryMock).toHaveBeenCalledTimes(1);
    expect(setSearchQueryMock).toHaveBeenCalledWith('test query');
  });

  it('calls setSearchQuery correctly on multiple changes', () => {
    render(<SearchTasks />);
    const input = screen.getByTestId('search-input');

    fireEvent.change(input, { target: { value: 'first query' } });
    expect(setSearchQueryMock).toHaveBeenCalledWith('first query');

    fireEvent.change(input, { target: { value: 'second query' } });
    expect(setSearchQueryMock).toHaveBeenCalledWith('second query');
  });

  it('clears search query when input is cleared', () => {
    render(<SearchTasks />);
    const input = screen.getByTestId('search-input');

    fireEvent.change(input, { target: { value: 'something' } });
    expect(setSearchQueryMock).toHaveBeenCalledWith('something');

    fireEvent.change(input, { target: { value: '' } });
    expect(setSearchQueryMock).toHaveBeenCalledWith('');
  });
});
