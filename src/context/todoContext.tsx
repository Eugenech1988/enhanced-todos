import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type TTodo = {
  id: string;
  title: string;
  createdAt: Date | string;
  completed: boolean;
};

export type TFilters = 'all' | 'active' | 'completed';

type TTodoContextValue = {
  todos: TTodo[];
  addTodo: (title: string) => void;
  toggleTodo: (id: string) => void;
  removeTodo: (id: string) => void;
  setSearchQuery: (query: string) => void;
  searchQuery: string;
  filter: TFilters;
  setFilter: (filter: TFilters) => void;
  reorderTodos: (startIndex: number, endIndex: number) => void;
  updateTodo: (id: string, title: string) => void;
};

const defaultTodoContext: TTodoContextValue = {
  todos: [],
  addTodo: () => { },
  toggleTodo: () => { },
  removeTodo: () => { },
  updateTodo: () => { },
  setSearchQuery: () => { },
  searchQuery: '',
  filter: 'all',
  setFilter: () => { },
  reorderTodos: () => { },
};

const defaultValue: TTodo[] = [
  { id: crypto.randomUUID(), title: 'Learn React', createdAt: new Date().toISOString(), completed: false },
  { id: crypto.randomUUID(), title: 'Learn TypeScript', createdAt: new Date().toISOString(), completed: true },
  { id: crypto.randomUUID(), title: 'Build a Todo App', createdAt: new Date().toISOString(), completed: false },
];

const TodoContext = createContext<TTodoContextValue>(defaultTodoContext);

export const TodoContextProvider = ({ children }: { children: ReactNode }) => {
  const [todos, setTodos] = useState<TTodo[]>(() => {
    const savedTodos = sessionStorage.getItem('todos');
    if (savedTodos) {
      const parsedTodos = JSON.parse(savedTodos);
      return parsedTodos.map((todo: TTodo) => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
      }));
    }
    return defaultValue.map(todo => ({
      ...todo,
      createdAt: new Date(todo.createdAt),
    }));
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<TFilters>('all');

  useEffect(() => {
    sessionStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (title: string) => {
    setTodos(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title,
        createdAt: new Date().toISOString(),
        completed: false,
      },
    ]);
  };

  const toggleTodo = (id: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    );
  };

  const removeTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const reorderTodos = (startIndex: number, endIndex: number) => {
    setTodos(prev => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  };

  const updateTodo = (id: string, title: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, title } : todo
      )
    );
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        addTodo,
        toggleTodo,
        removeTodo,
        updateTodo,
        reorderTodos,
        setSearchQuery,
        searchQuery,
        filter,
        setFilter,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = () => useContext(TodoContext);
