import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from 'react';

export type TTodo = {
  id: string;
  title: string;
  createdAt: Date | string;
  completed: boolean;
};

export type TColumn = {
  id: string;
  title: string;
  todoIds: string[];
};

export type TFilters = 'all' | 'active' | 'completed';

type TTodoContextValue = {
  todos: TTodo[];
  columns: TColumn[];
  addTodo: (title: string, columnId?: string) => void;
  toggleTodo: (id: string) => void;
  removeTodo: (id: string) => void;
  setSearchQuery: (query: string) => void;
  searchQuery: string;
  filter: TFilters;
  setFilter: (filter: TFilters) => void;
  reorderTodos: (startIndex: number, endIndex: number, columnId: string) => void;
  updateTodo: (id: string, title: string) => void;
  selectedIds: string[];
  setSelectedIds: Dispatch<SetStateAction<string[]>>;
  clearSelectedTodos: () => void;
  removeSelectedTodos: () => void;
  setCompletedForSelected: (completed: boolean) => void;
  moveTaskToColumn: (taskId: string, targetColumnId: string, insertIndex?: number) => void;
  moveMultipleTasksToColumn: (
    taskIds: string[],
    targetColumnId: string,
    insertIndex?: number
  ) => void;
};

const defaultTodoContext: TTodoContextValue = {
  todos: [],
  columns: [],
  addTodo: () => {},
  toggleTodo: () => {},
  removeTodo: () => {},
  updateTodo: () => {},
  setSearchQuery: () => {},
  searchQuery: '',
  filter: 'all',
  setFilter: () => {},
  reorderTodos: () => {},
  selectedIds: [],
  setSelectedIds: () => {},
  clearSelectedTodos: () => {},
  removeSelectedTodos: () => {},
  setCompletedForSelected: () => {},
  moveTaskToColumn: () => {},
  moveMultipleTasksToColumn: () => {},
};

const initialTodos: TTodo[] = [
  { id: crypto.randomUUID(), title: 'Design app layout', createdAt: new Date().toISOString(), completed: false },
  { id: crypto.randomUUID(), title: 'Define data models', createdAt: new Date().toISOString(), completed: false },
  { id: crypto.randomUUID(), title: 'Setup project structure', createdAt: new Date().toISOString(), completed: false },
  { id: crypto.randomUUID(), title: 'Implement todo context', createdAt: new Date().toISOString(), completed: false },
  { id: crypto.randomUUID(), title: 'Add drag and drop', createdAt: new Date().toISOString(), completed: false },
  { id: crypto.randomUUID(), title: 'Create reusable UI components', createdAt: new Date().toISOString(), completed: false },
  { id: crypto.randomUUID(), title: 'Initialize Vite + React', createdAt: new Date().toISOString(), completed: true },
  { id: crypto.randomUUID(), title: 'Configure TypeScript', createdAt: new Date().toISOString(), completed: true },
  { id: crypto.randomUUID(), title: 'Setup ESLint and Prettier', createdAt: new Date().toISOString(), completed: true },
];

const initialColumns: TColumn[] = [
  { id: crypto.randomUUID(), title: 'To Do', todoIds: [initialTodos[0].id, initialTodos[1].id, initialTodos[2].id] },
  { id: crypto.randomUUID(), title: 'In Progress', todoIds: [initialTodos[3].id, initialTodos[4].id, initialTodos[5].id] },
  { id: crypto.randomUUID(), title: 'Done', todoIds: [initialTodos[6].id, initialTodos[7].id, initialTodos[8].id] },
];

const TodoContext = createContext<TTodoContextValue>(defaultTodoContext);

export const TodoContextProvider = ({ children }: { children: ReactNode }) => {
  const [todos, setTodos] = useState<TTodo[]>(() => {
    const saved = sessionStorage.getItem('todos');
    if (saved) {
      return JSON.parse(saved).map((t: TTodo) => ({ ...t, createdAt: new Date(t.createdAt) }));
    }
    return initialTodos.map(t => ({ ...t, createdAt: new Date(t.createdAt) }));
  });

  const [columns, setColumns] = useState<TColumn[]>(() => {
    const saved = sessionStorage.getItem('columns');
    if (!saved) return initialColumns;

    const parsed: TColumn[] = JSON.parse(saved);
    const hasToDo = parsed.some(c => c.title === 'To Do');
    const hasInProgress = parsed.some(c => c.title === 'In Progress');
    const hasDone = parsed.some(c => c.title === 'Done');

    let cols = [...parsed];

    if (!hasToDo) cols.unshift({ id: crypto.randomUUID(), title: 'To Do', todoIds: [] });
    if (!hasInProgress) {
      const idx = cols.findIndex(c => c.title === 'To Do');
      cols.splice(idx + 1, 0, { id: crypto.randomUUID(), title: 'In Progress', todoIds: [] });
    }
    if (!hasDone) cols.push({ id: crypto.randomUUID(), title: 'Done', todoIds: [] });

    return cols;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<TFilters>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    const saved = sessionStorage.getItem('selectedIds');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    sessionStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    sessionStorage.setItem('columns', JSON.stringify(columns));
  }, [columns]);

  useEffect(() => {
    sessionStorage.setItem('selectedIds', JSON.stringify(selectedIds));
  }, [selectedIds]);

  const addTodo = (title: string, columnId?: string) => {
    const todo: TTodo = {
      id: crypto.randomUUID(),
      title,
      createdAt: new Date().toISOString(),
      completed: false,
    };

    setTodos(p => [...p, todo]);

    if (columnId) {
      setColumns(p =>
        p.map(c => (c.id === columnId ? { ...c, todoIds: [...c.todoIds, todo.id] } : c))
      );
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(p => p.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const removeTodo = (id: string) => {
    setTodos(p => p.filter(t => t.id !== id));
    setColumns(p => p.map(c => ({ ...c, todoIds: c.todoIds.filter(tid => tid !== id) })));
    setSelectedIds(p => p.filter(sid => sid !== id));
  };

  const reorderTodos = (startIndex: number, endIndex: number, columnId: string) => {
    setColumns(p => {
      const cols = [...p];
      const idx = cols.findIndex(c => c.id === columnId);
      if (idx === -1) return p;

      const ids = [...cols[idx].todoIds];
      const [moved] = ids.splice(startIndex, 1);
      ids.splice(endIndex, 0, moved);

      cols[idx] = { ...cols[idx], todoIds: ids };
      return cols;
    });
  };

  const updateTodo = (id: string, title: string) => {
    setTodos(p => p.map(t => (t.id === id ? { ...t, title } : t)));
  };

  const clearSelectedTodos = () => setSelectedIds([]);

  const removeSelectedTodos = () => {
    setTodos(p => p.filter(t => !selectedIds.includes(t.id)));
    setColumns(p =>
      p.map(c => ({ ...c, todoIds: c.todoIds.filter(id => !selectedIds.includes(id)) }))
    );
    setSelectedIds([]);
  };

  const setCompletedForSelected = (completed: boolean) => {
    setTodos(p => p.map(t => (selectedIds.includes(t.id) ? { ...t, completed } : t)));
  };

  const moveTaskToColumn = (taskId: string, targetColumnId: string, insertIndex?: number) => {
    setColumns(p => {
      const source = p.find(c => c.todoIds.includes(taskId));
      if (!source || source.id === targetColumnId) return p;

      return p.map(c => {
        if (c.id === source.id) {
          return { ...c, todoIds: c.todoIds.filter(id => id !== taskId) };
        }
        if (c.id === targetColumnId) {
          const ids = [...c.todoIds];
          if (insertIndex !== undefined) ids.splice(insertIndex, 0, taskId);
          else ids.push(taskId);
          return { ...c, todoIds: ids };
        }
        return c;
      });
    });
  };

  const moveMultipleTasksToColumn = (
    taskIds: string[],
    targetColumnId: string,
    insertIndex?: number
  ) => {
    setColumns(p => {
      const cols = p.map(c => ({
        ...c,
        todoIds: c.todoIds.filter(id => !taskIds.includes(id)),
      }));

      const idx = cols.findIndex(c => c.id === targetColumnId);
      if (idx !== -1) {
        const ids = [...cols[idx].todoIds];
        if (insertIndex !== undefined) ids.splice(insertIndex, 0, ...taskIds);
        else ids.push(...taskIds);
        cols[idx] = { ...cols[idx], todoIds: ids };
      }

      return cols;
    });

    setSelectedIds(p => [...p.filter(id => !taskIds.includes(id)), ...taskIds]);
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        columns,
        addTodo,
        toggleTodo,
        removeTodo,
        updateTodo,
        reorderTodos,
        setSearchQuery,
        searchQuery,
        filter,
        setFilter,
        selectedIds,
        setSelectedIds,
        clearSelectedTodos,
        removeSelectedTodos,
        setCompletedForSelected,
        moveTaskToColumn,
        moveMultipleTasksToColumn,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = () => useContext(TodoContext);
