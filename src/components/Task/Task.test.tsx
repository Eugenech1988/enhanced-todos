import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import { Task } from './index';
import type { TTodo } from '@/context/todoContext';

const toggleTodoMock = vi.fn();
const removeTodoMock = vi.fn();
const updateTodoMock = vi.fn();
const setSelectedIdsMock = vi.fn();

vi.mock('@/context/todoContext.tsx', async () => {
  const actual = await vi.importActual<typeof import('@/context/todoContext')>(
    '@/context/todoContext.tsx'
  );

  return {
    ...actual,
    useTodo: () => ({
      toggleTodo: toggleTodoMock,
      removeTodo: removeTodoMock,
      updateTodo: updateTodoMock,
      filter: 'all',
      searchQuery: '',
      selectedIds: [],
      setSelectedIds: setSelectedIdsMock,
    }),
  };
});

vi.mock('@/hooks/useTodoDnD', () => ({
  useTodoItemDnD: () => ({
    elementRef: { current: null },
    dropRef: { current: null },
    isDragging: false,
    closestEdge: null,
  }),
}));

const mockTodo: TTodo = {
  id: '1',
  title: 'Test task',
  createdAt: new Date().toISOString(),
  completed: false,
};

const renderTask = (todo: TTodo = mockTodo) =>
  render(
    <Task
      todo={todo}
      index={0}
      totalTodos={1}
    />
  );

describe('Task', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders title', () => {
    renderTask();
    expect(screen.getByText('Test task')).toBeInTheDocument();
  });

  it('calls toggleTodo when toggle button is clicked', () => {
    renderTask();

    fireEvent.click(screen.getByTestId('toggle-completed'));

    expect(toggleTodoMock).toHaveBeenCalledTimes(1);
    expect(toggleTodoMock).toHaveBeenCalledWith('1');
  });

  it('shows strikethrough when todo is completed', () => {
    renderTask({ ...mockTodo, completed: true });

    expect(screen.getByText('Test task')).toHaveClass('line-through');
  });

  it('enters edit mode on title click', () => {
    renderTask();

    fireEvent.click(screen.getByText('Test task'));

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('saves edited title on Enter', () => {
    renderTask();

    fireEvent.click(screen.getByText('Test task'));

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Updated task' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(updateTodoMock).toHaveBeenCalledWith('1', 'Updated task');
  });

  it('calls removeTodo after delete click', () => {
    renderTask();

    fireEvent.click(screen.getByTestId('delete-task'));

    vi.advanceTimersByTime(300);

    expect(removeTodoMock).toHaveBeenCalledTimes(1);
    expect(removeTodoMock).toHaveBeenCalledWith('1');
  });
});
