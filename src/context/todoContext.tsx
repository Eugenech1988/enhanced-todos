import { createContext, useContext, useState, useEffect, type ReactNode, type Dispatch, type SetStateAction } from 'react';

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
  moveMultipleTasksToColumn: (taskIds: string[], targetColumnId: string, insertIndex?: number) => void;
};

const defaultTodoContext: TTodoContextValue = {
  todos: [],
  columns: [],
  addTodo: () => { },
  toggleTodo: () => { },
  removeTodo: () => { },
  updateTodo: () => { },
  setSearchQuery: () => { },
  searchQuery: '',
  filter: 'all',
  setFilter: () => { },
  reorderTodos: () => { },
  selectedIds: [],
  setSelectedIds: () => {},
  clearSelectedTodos: () => { },
  removeSelectedTodos: () => { },
  setCompletedForSelected: () => { },
  moveTaskToColumn: () => { },
  moveMultipleTasksToColumn: () => { },
};

// Initial data structure with columns
const initialTodos: TTodo[] = [
  { id: crypto.randomUUID(), title: 'Learn React', createdAt: new Date().toISOString(), completed: false },
  { id: crypto.randomUUID(), title: 'Learn TypeScript', createdAt: new Date().toISOString(), completed: true },
  { id: crypto.randomUUID(), title: 'Build a Todo App', createdAt: new Date().toISOString(), completed: false },
];

const initialColumns: TColumn[] = [
  { id: crypto.randomUUID(), title: 'To Do', todoIds: [initialTodos[0].id, initialTodos[1].id, initialTodos[2].id] },
  { id: crypto.randomUUID(), title: 'In Progress', todoIds: [] },
  { id: crypto.randomUUID(), title: 'Done', todoIds: [] },
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
    return initialTodos.map(todo => ({
      ...todo,
      createdAt: new Date(todo.createdAt),
    }));
  });

  const [columns, setColumns] = useState<TColumn[]>(() => {
    const savedColumns = sessionStorage.getItem('columns');
    if (savedColumns) {
      const parsedColumns: TColumn[] = JSON.parse(savedColumns);
      // Check if the "In Progress" column exists, if not, add it
      const hasToDoColumn = parsedColumns.some((col) => col.title === 'To Do');
      const hasInProgressColumn = parsedColumns.some((col) => col.title === 'In Progress');
      const hasDoneColumn = parsedColumns.some((col) => col.title === 'Done');
      
      let updatedColumns = [...parsedColumns];
      
      // Add missing standard columns in the right order
      if (!hasToDoColumn) {
        const toDoColumn = {
          id: crypto.randomUUID(),
          title: 'To Do',
          todoIds: []
        };
        updatedColumns.unshift(toDoColumn); // Add at beginning
      }
      
      if (!hasInProgressColumn) {
        const inProgressColumn = {
          id: crypto.randomUUID(),
          title: 'In Progress',
          todoIds: []
        };
        // Find the position after 'To Do' and before 'Done' if they exist
        const toDoIndex = updatedColumns.findIndex(col => col.title === 'To Do');
        updatedColumns.splice(toDoIndex + 1, 0, inProgressColumn);
      }
      
      if (!hasDoneColumn) {
        const doneColumn = {
          id: crypto.randomUUID(),
          title: 'Done',
          todoIds: []
        };
        updatedColumns.push(doneColumn); // Add at end
      }
      
      return updatedColumns;
    }
    return initialColumns;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<TFilters>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    const savedSelectedIds = sessionStorage.getItem('selectedIds');
    return savedSelectedIds ? JSON.parse(savedSelectedIds) : [];
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
    const newTodo = {
      id: crypto.randomUUID(),
      title,
      createdAt: new Date().toISOString(),
      completed: false,
    };

    setTodos(prev => [
      ...prev,
      newTodo,
    ]);

    // If columnId is provided, add the todo to that column
    if (columnId) {
      setColumns(prev =>
        prev.map(column =>
          column.id === columnId
            ? { ...column, todoIds: [...column.todoIds, newTodo.id] }
            : column
        )
      );
    }
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
    
    // Remove the todo ID from all columns
    setColumns(prev =>
      prev.map(column => ({
        ...column,
        todoIds: column.todoIds.filter(todoId => todoId !== id)
      }))
    );
    
    setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
  };

  const reorderTodos = (startIndex: number, endIndex: number, columnId: string) => {
    setColumns(prev => {
      const newColumns = [...prev];
      const columnIndex = newColumns.findIndex(col => col.id === columnId);

      if (columnIndex === -1) return prev;

      const column = newColumns[columnIndex];
      const newTodoIds = Array.from(column.todoIds);
      const [removed] = newTodoIds.splice(startIndex, 1);
      newTodoIds.splice(endIndex, 0, removed);

      newColumns[columnIndex] = {
        ...column,
        todoIds: newTodoIds
      };

      return newColumns;
    });
  };

  const updateTodo = (id: string, title: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, title } : todo
      )
    );
  };

  const clearSelectedTodos = () => {
    setSelectedIds([]);
  };

  const removeSelectedTodos = () => {
    setTodos(prev => prev.filter(todo => !selectedIds.includes(todo.id)));

    // Remove selected todo IDs from all columns
    setColumns(prev =>
      prev.map(column => ({
        ...column,
        todoIds: column.todoIds.filter(todoId => !selectedIds.includes(todoId))
      }))
    );

    setSelectedIds([]);
  };

  const setCompletedForSelected = (completed: boolean) => {
    setTodos(prev =>
      prev.map(todo =>
        selectedIds.includes(todo.id) ? { ...todo, completed } : todo
      )
    );
  };

  const moveTaskToColumn = (taskId: string, targetColumnId: string, insertIndex?: number) => {
    // Find the source column
    const sourceColumn = columns.find(col => col.todoIds.includes(taskId));
  
    if (!sourceColumn || sourceColumn.id === targetColumnId) return;
  
    // Remove from source
    setColumns(prev =>
      prev.map(col =>
        col.id === sourceColumn.id
          ? { ...col, todoIds: col.todoIds.filter(id => id !== taskId) }
          : col
      )
    );
  
    // Insert into target
    setColumns(prev =>
      prev.map(col =>
        col.id === targetColumnId
          ? {
              ...col,
              todoIds: insertIndex !== undefined && insertIndex >= 0 && insertIndex <= col.todoIds.length
                ? [...col.todoIds.slice(0, insertIndex), taskId, ...col.todoIds.slice(insertIndex)]
                : [...col.todoIds, taskId]
            }
          : col
      )
    );
    
    // Handle selection preservation appropriately
    if (selectedIds.includes(taskId)) {
      // If the task was already selected, preserve the selection
      // This handles cases where the task was part of a multi-selection
      setSelectedIds(prev => prev);
    }
    // If the task was not selected before, don't change the selection
  };

  const moveMultipleTasksToColumn = (taskIds: string[], targetColumnId: string, insertIndex?: number) => {
    setColumns(prev => {
      const newColumns = [...prev];
      
      // Find and update source columns
      const updatedColumns = newColumns.map(col => {
        // Remove all taskIds from this column
        const filteredTodoIds = col.todoIds.filter(id => !taskIds.includes(id));
        return { ...col, todoIds: filteredTodoIds };
      });
      
      // Find the target column and add the tasks
      const targetColumnIndex = updatedColumns.findIndex(col => col.id === targetColumnId);
      if (targetColumnIndex !== -1) {
        const targetColumn = updatedColumns[targetColumnIndex];
        if (insertIndex !== undefined && insertIndex >= 0 && insertIndex <= targetColumn.todoIds.length) {
          // Insert at specific index
          const newTodoIds = [...targetColumn.todoIds.slice(0, insertIndex), ...taskIds, ...targetColumn.todoIds.slice(insertIndex)];
          updatedColumns[targetColumnIndex] = { ...targetColumn, todoIds: newTodoIds };
        } else {
          // Append to end
          updatedColumns[targetColumnIndex] = { ...targetColumn, todoIds: [...targetColumn.todoIds, ...taskIds] };
        }
      }
      
      return updatedColumns;
    });
    
    // Preserve the selection after moving the tasks
    // Keep existing selections that are not part of the moved tasks
    setSelectedIds(prev => {
      // Filter out the moved tasks from previous selection to avoid duplicates
      const existingSelectionWithoutMovedTasks = prev.filter(id => !taskIds.includes(id));
      // Return combined selection: existing non-moved selections + moved tasks
      return [...existingSelectionWithoutMovedTasks, ...taskIds];
    });
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
