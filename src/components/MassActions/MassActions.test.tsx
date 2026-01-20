import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import { MassActions } from './index';

const removeSelectedTodosMock = vi.fn();
const setCompletedForSelectedMock = vi.fn();

vi.mock('@/context/todoContext.tsx', async () => {
  const actual = await vi.importActual<typeof import('@/context/todoContext')>(
    '@/context/todoContext.tsx'
  );

  return {
    ...actual,
    useTodo: () => ({
      removeSelectedTodos: removeSelectedTodosMock,
      setCompletedForSelected: setCompletedForSelectedMock,
    }),
  };
});

/* ------------------------------------------------------------------ */
/* tests */
/* ------------------------------------------------------------------ */

describe('MassActions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders "No items selected" button when selectedCount is 0', () => {
    render(<MassActions selectedCount={0} />);
    
    const noSelectionButton = screen.getByText('No items selected');
    expect(noSelectionButton).toBeInTheDocument();
    expect(noSelectionButton).toBeDisabled();
  });

  it('does not render action buttons when selectedCount is 0', () => {
    render(<MassActions selectedCount={0} />);
    
    expect(screen.queryByText('Delete (0)')).not.toBeInTheDocument();
    expect(screen.queryByText('Complete')).not.toBeInTheDocument();
    expect(screen.queryByText('Active')).not.toBeInTheDocument();
  });

  it('renders action buttons when selectedCount is greater than 0', () => {
    render(<MassActions selectedCount={3} />);
    
    expect(screen.getByText('Delete (3)')).toBeInTheDocument();
    expect(screen.getByText('Complete')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('calls removeSelectedTodos when Delete button is clicked', () => {
    render(<MassActions selectedCount={2} />);
    
    fireEvent.click(screen.getByText('Delete (2)'));
    
    expect(removeSelectedTodosMock).toHaveBeenCalledTimes(1);
  });

  it('calls setCompletedForSelected with true when Complete button is clicked', () => {
    render(<MassActions selectedCount={2} />);
    
    fireEvent.click(screen.getByText('Complete'));
    
    expect(setCompletedForSelectedMock).toHaveBeenCalledTimes(1);
    expect(setCompletedForSelectedMock).toHaveBeenCalledWith(true);
  });

  it('calls setCompletedForSelected with false when Active button is clicked', () => {
    render(<MassActions selectedCount={2} />);
    
    fireEvent.click(screen.getByText('Active'));
    
    expect(setCompletedForSelectedMock).toHaveBeenCalledTimes(1);
    expect(setCompletedForSelectedMock).toHaveBeenCalledWith(false);
  });

  it('displays correct delete button text with selected count', () => {
    render(<MassActions selectedCount={5} />);
    
    expect(screen.getByText('Delete (5)')).toBeInTheDocument();
  });

  it('has proper styling classes for enabled buttons', () => {
    render(<MassActions selectedCount={2} />);
    
    const deleteButton = screen.getByText('Delete (2)');
    const completeButton = screen.getByText('Complete');
    const activeButton = screen.getByText('Active');
    
    expect(deleteButton).toHaveClass('bg-red-500');
    expect(completeButton).toHaveClass('bg-green-500');
    expect(activeButton).toHaveClass('bg-yellow-500');
  });

  it('has proper styling classes for disabled "No items selected" button', () => {
    render(<MassActions selectedCount={0} />);
    
    const noSelectionButton = screen.getByText('No items selected');
    expect(noSelectionButton).toHaveClass('bg-gray-300');
    expect(noSelectionButton).toHaveClass('text-gray-500');
    expect(noSelectionButton).toBeDisabled();
  });
});