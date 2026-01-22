import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Column } from './index';
import type { TTodo, TColumn } from '@/context/todoContext';

type UseTodoState = {
  todos: TTodo[];
  columns: TColumn[];
  filter: 'all' | 'active' | 'completed';
  searchQuery: string;
  moveTaskToColumn: (todoId: string, columnId: string) => void;
  moveMultipleTasksToColumn: (todoIds: string[], columnId: string) => void;
  selectedIds: string[];
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
};

let mockState: UseTodoState;

const moveTaskToColumnMock = vi.fn();
const moveMultipleTasksToColumnMock = vi.fn();
const setSelectedIdsMock = vi.fn();

vi.mock('@/context/todoContext', () => ({
  useTodo: () => mockState,
}));

vi.mock('@atlaskit/pragmatic-drag-and-drop/element/adapter', () => ({
  dropTargetForElements: vi.fn(() => vi.fn()),
}));

vi.mock('@/components/Task', () => ({
  Task: ({ todo }: { todo: TTodo }) => (
    <li data-testid={`task-${todo.id}`}>{todo.title}</li>
  ),
}));

const mockColumn: TColumn = {
  id: 'col-1',
  title: 'To Do',
  todoIds: ['1', '2'],
};

const mockTodos: TTodo[] = [
  { id: '1', title: 'Task 1', createdAt: '', completed: false },
  { id: '2', title: 'Task 2', createdAt: '', completed: true },
];

const renderColumn = (column: TColumn = mockColumn) =>
  render(<Column column={column} index={0} />);

describe('Column', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockState = {
      todos: mockTodos,
      columns: [mockColumn],
      filter: 'all',
      searchQuery: '',
      moveTaskToColumn: moveTaskToColumnMock,
      moveMultipleTasksToColumn: moveMultipleTasksToColumnMock,
      selectedIds: [],
      setSelectedIds: setSelectedIdsMock,
    };
  });

  it('renders column title', () => {
    renderColumn();
    expect(screen.getByText('To Do')).toBeInTheDocument();
  });

  it('renders tasks', () => {
    renderColumn();
    expect(screen.getByTestId('task-1')).toBeInTheDocument();
    expect(screen.getByTestId('task-2')).toBeInTheDocument();
  });

  it('shows "No tasks" when empty', () => {
    renderColumn({ ...mockColumn, todoIds: [] });
    expect(screen.getByText('No tasks')).toBeInTheDocument();
  });

  it('shows "Select All" initially', () => {
    renderColumn();
    expect(screen.getByRole('button')).toHaveTextContent('Select All');
  });

  it('shows "Clear All" when all visible tasks selected', () => {
    mockState.selectedIds = ['1', '2'];
    renderColumn();
    expect(screen.getByRole('button')).toHaveTextContent('Clear All');
  });

  it('selects all visible tasks', () => {
    renderColumn();
    fireEvent.click(screen.getByRole('button'));

    const updater = setSelectedIdsMock.mock.calls[0][0] as (
      prev: string[]
    ) => string[];

    expect(updater([])).toEqual(['1', '2']);
  });

  it('selects only completed tasks when filter=completed', () => {
    mockState.filter = 'completed';
    renderColumn();

    fireEvent.click(screen.getByRole('button'));

    const updater = setSelectedIdsMock.mock.calls[0][0] as (
      prev: string[]
    ) => string[];

    expect(updater([])).toEqual(['2']);
  });

  it('clears selected tasks', () => {
    mockState.selectedIds = ['1', '2'];
    renderColumn();

    fireEvent.click(screen.getByRole('button'));

    const updater = setSelectedIdsMock.mock.calls[0][0] as (
      prev: string[]
    ) => string[];

    expect(updater(['1', '2'])).toEqual([]);
  });

  it('applies base styling classes', () => {
    const { container } = renderColumn();
    const column = container.firstChild as HTMLElement;

    expect(column.className).toContain('bg-gray-100');
    expect(column.className).toContain('dark:bg-gray-700');
  });
});
