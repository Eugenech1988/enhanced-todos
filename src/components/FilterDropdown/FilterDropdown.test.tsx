import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FilterDropdown } from './index';
import { allowedFilters } from '@/constants';

const setFilterMock = vi.fn();

vi.mock('@/context/todoContext', async () => {
  const actual = await vi.importActual<typeof import('@/context/todoContext')>(
    '@/context/todoContext'
  );

  return {
    ...actual,
    useTodo: () => ({
      filter: 'all',
      setFilter: setFilterMock,
    }),
  };
});

describe('FilterDropdown', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with default filter', () => {
    render(<FilterDropdown />);

    const button = screen.getByTestId('filter-toggle');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('all');
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens and closes dropdown on click', () => {
    render(<FilterDropdown />);
    const button = screen.getByTestId('filter-toggle');

    fireEvent.click(button);
    expect(screen.getByTestId('filter-listbox')).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-expanded', 'true');

    fireEvent.click(button);
    expect(screen.queryByTestId('filter-listbox')).not.toBeInTheDocument();
  });

  it('renders all allowed filters', () => {
    render(<FilterDropdown />);
    fireEvent.click(screen.getByTestId('filter-toggle'));

    allowedFilters.forEach((f) => {
      expect(screen.getByTestId(`filter-option-${f}`)).toBeInTheDocument();
    });
  });

  it('selects filter on click', () => {
    render(<FilterDropdown />);
    fireEvent.click(screen.getByTestId('filter-toggle'));

    fireEvent.click(screen.getByTestId('filter-option-active'));

    expect(setFilterMock).toHaveBeenCalledWith('active');
    expect(screen.queryByTestId('filter-listbox')).not.toBeInTheDocument();
  });

  it('selects filter with Enter when option is active', () => {
    render(<FilterDropdown />);
    const button = screen.getByTestId('filter-toggle');

    fireEvent.keyDown(button, { key: 'ArrowDown' }); // open
    fireEvent.keyDown(button, { key: 'ArrowDown' }); // index 0 = all
    fireEvent.keyDown(button, { key: 'ArrowDown' }); // index 1 = active
    fireEvent.keyDown(button, { key: 'Enter' });

    expect(setFilterMock).toHaveBeenCalledWith('active');
  });


  it('selects filter with Enter', () => {
    render(<FilterDropdown />);
    const button = screen.getByTestId('filter-toggle');

    fireEvent.keyDown(button, { key: 'ArrowDown' }); // open
    fireEvent.keyDown(button, { key: 'ArrowDown' }); // all
    fireEvent.keyDown(button, { key: 'ArrowDown' }); // active
    fireEvent.keyDown(button, { key: 'Enter' });

    expect(setFilterMock).toHaveBeenCalledWith('active');
  });

  it('closes dropdown on Escape', () => {
    render(<FilterDropdown />);
    const button = screen.getByTestId('filter-toggle');

    fireEvent.keyDown(button, { key: 'ArrowDown' });
    expect(screen.getByTestId('filter-listbox')).toBeInTheDocument();

    fireEvent.keyDown(button, { key: 'Escape' });
    expect(screen.queryByTestId('filter-listbox')).not.toBeInTheDocument();
  });
});
