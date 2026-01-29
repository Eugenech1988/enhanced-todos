import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TodoContextProvider } from '@/context/todoContext';
import { AddTask } from './index';

const mockAddTodo = vi.fn();

vi.mock('@/context/todoContext', async () => {
 const actual = await import('@/context/todoContext');
  return {
    ...actual,
    useTodo: () => ({
      addTodo: mockAddTodo,
      columns: [
        { id: 'todo-column-id', title: 'To Do', tasks: [] }
      ]
    })
  };
});

describe('AddTask', () => {
  const renderWithProvider = () => {
    return render(
      <TodoContextProvider>
        <AddTask />
      </TodoContextProvider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders input field and submit button', () => {
    renderWithProvider();
    
    const input = screen.getByTestId('add-task-input');
    const button = screen.getByTestId('add-task-button');
    
    expect(input).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  it('allows user to enter task title', () => {
    renderWithProvider();
    
    const input = screen.getByTestId('add-task-input');
    fireEvent.change(input, { target: { value: 'New task' } });
    
    expect(input).toHaveValue('New task');
  });

  it('submits form when user clicks Add Task button', async () => {
    renderWithProvider();
    
    const input = screen.getByTestId('add-task-input');
    const button = screen.getByTestId('add-task-button');
    
    fireEvent.change(input, { target: { value: 'Test task' } });
    fireEvent.click(button);
    
    await new Promise(resolve => setTimeout(resolve, 0));
    
    expect(mockAddTodo).toHaveBeenCalledWith('Test task', 'todo-column-id');
  });

  it('shows error when submitting empty task', async () => {
    renderWithProvider();
    
    const button = screen.getByTestId('add-task-button');
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText('Task title is required')).toBeInTheDocument();
    });
  });

  it('shows error when task title is too long', async () => {
    renderWithProvider();
    
    const input = screen.getByTestId('add-task-input');
    const button = screen.getByTestId('add-task-button');
    
    const longTitle = 'a'.repeat(101); // More than 100 characters
    fireEvent.change(input, { target: { value: longTitle } });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText('Task title is too long')).toBeInTheDocument();
    });
  });

  it('resets form after successful submission', async () => {
    renderWithProvider();
    
    const input = screen.getByTestId('add-task-input');
    const button = screen.getByTestId('add-task-button');
    
    fireEvent.change(input, { target: { value: 'Test task' } });
    expect(input).toHaveValue('Test task');
    
    fireEvent.click(button);
    
    await new Promise(resolve => setTimeout(resolve, 0));
    
    expect(input).toHaveValue('');
  });

  it('disables button while submitting', async () => {
    renderWithProvider();
    
    const input = screen.getByTestId('add-task-input');
    const button = screen.getByTestId('add-task-button');
    
    fireEvent.change(input, { target: { value: 'Test task' } });
    fireEvent.click(button);
    
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('Adding…');
  });
});