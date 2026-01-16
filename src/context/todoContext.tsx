import { createContext, useContext, useState, type ReactNode } from 'react';

export type TTodo = {
  id: string;
  title: string;
  createdAt: Date;
  completed: boolean;
};

type TTodoContextValue = {
  todos: TTodo[];
  addTodo: (title: string) => void;
  toggleTodo: (id: string) => void;
  removeTodo: (id: string) => void;
};

const defaultTodoContext: TTodoContextValue = {
  todos: [],
  addTodo: () => {},
  toggleTodo: () => {},
  removeTodo: () => {},
};

const defaultValue: TTodo[] = [
  { id: crypto.randomUUID(), title: 'Learn React', createdAt: new Date(), completed: false },
  { id: crypto.randomUUID(), title: 'Learn TypeScript', createdAt: new Date(), completed: true },
  { id: crypto.randomUUID(), title: 'Build a Todo App', createdAt: new Date(), completed: false },
];

const TodoContext = createContext<TTodoContextValue>(defaultTodoContext);

export function TodoContextProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState<TTodo[]>(defaultValue);

  function addTodo(title: string) {
    setTodos((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title,
        createdAt: new Date(),
        completed: false,
      },
    ]);
  }

  function toggleTodo(id: string) {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    );
  }

  function removeTodo(id: string) {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }

  return (
    <TodoContext.Provider
      value={{
        todos,
        addTodo,
        toggleTodo,
        removeTodo,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
}

export function useTodo() {
  return useContext(TodoContext);
}
