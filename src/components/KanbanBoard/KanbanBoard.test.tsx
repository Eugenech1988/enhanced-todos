import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

import { KanbanBoard } from './index';
import { TodoContextProvider } from '@/context/todoContext';

vi.mock('@/components/Column', () => ({
  Column: ({ column, index }: { column: any; index: number }) => (
    <div data-testid={`column-${index}`} data-column-id={column.id}>
      {column.title}
    </div>
  ),
}));

vi.mock('@/hooks/useDnD', () => ({
  useTodoMonitor: () => {}, // Empty mock since we're not testing DnD functionality in this component
}));

const renderWithProvider = (ui: React.ReactElement) => {
  return render(ui, {
    wrapper: ({ children }) => <TodoContextProvider>{children}</TodoContextProvider>,
  });
};

describe('KanbanBoard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    renderWithProvider(<KanbanBoard />);
    expect(screen.getByTestId('kanban-board')).toBeInTheDocument();
  });

  it('renders columns based on context data', () => {
    renderWithProvider(<KanbanBoard />);

    // Check that all default columns are rendered
    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();

    // Check that columns have correct data-testid attributes
    expect(screen.getByTestId('column-0')).toBeInTheDocument();
    expect(screen.getByTestId('column-1')).toBeInTheDocument();
    expect(screen.getByTestId('column-2')).toBeInTheDocument();
  });

  it('assigns correct index to each column', () => {
    renderWithProvider(<KanbanBoard />);

    // Verify that each column gets the correct index
    expect(screen.getByTestId('column-0')).toBeInTheDocument();
    expect(screen.getByTestId('column-1')).toBeInTheDocument();
    expect(screen.getByTestId('column-2')).toBeInTheDocument();
  });

  it('uses responsive grid classes for layout', () => {
    renderWithProvider(<KanbanBoard />);

    // Check that the main container has the expected grid classes
    const container = screen.getByTestId('kanban-board');
    expect(container).toHaveClass('grid');
    expect(container).toHaveClass('grid-flow-row');
    expect(container).toHaveClass('sm:grid-flow-col');
    expect(container).toHaveClass('sm:auto-cols-[minmax(300px,_1fr)]');
    expect(container).toHaveClass('overflow-x-auto');
    expect(container).toHaveClass('gap-4');
    expect(container).toHaveClass('h-full');
    expect(container).toHaveClass('w-full');
  });

  it('renders the correct number of columns', () => {
    renderWithProvider(<KanbanBoard />);

    // Expect 3 default columns
    const columns = screen.getAllByTestId(/^column-\d+$/);
    expect(columns).toHaveLength(3);
  });
});