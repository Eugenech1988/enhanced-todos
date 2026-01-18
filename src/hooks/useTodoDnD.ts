import React, { useEffect, useRef, useState } from 'react';
import { draggable, dropTargetForElements, monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { attachClosestEdge, extractClosestEdge, type Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { type TTodo, type TFilters } from '@/context/todoContext';

type UseTodoItemDnDProps = {
  todo: TTodo;
  index: number;
  filter: TFilters;
  searchQuery: string;
  columnId?: string;
};

export const useTodoItemDnD = ({ todo, index, filter, searchQuery, columnId }: UseTodoItemDnDProps) => {
  const elementRef = useRef<HTMLLIElement | null>(null);
  const dropRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    return draggable({
      element,
      getInitialData: () => ({ type: 'todo', todo, index, columnId }),
      onDragStart: () => setIsDragging(true),
      onDrop: () => setIsDragging(false),
    });
  }, [todo, index, filter, searchQuery, columnId]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    return dropTargetForElements({
      element,
      getData: ({ input }) => attachClosestEdge(
        { type: 'todo', todo, index, columnId },
        { element, input, allowedEdges: ['top', 'bottom'] }
      ),
      onDragEnter: ({ self }) => setClosestEdge(extractClosestEdge(self.data)),
      onDrag: ({ self }) => setClosestEdge(extractClosestEdge(self.data)),
      onDragLeave: () => setClosestEdge(null),
      onDrop: () => setClosestEdge(null),
    });
  }, [todo, index, filter, searchQuery, columnId]);

  return { elementRef, dropRef, isDragging, closestEdge };
};

type DragData = {
  type: 'todo' | 'column';
  todo?: TTodo;
  index?: number;
  columnId?: string;
};

type DropData = DragData & { edge?: Edge };

export const useTodoMonitor = (
  reorderTodos: (startIndex: number, endIndex: number, columnId: string) => void,
  moveTaskToColumn: (taskId: string, targetColumnId: string, insertIndex?: number) => void,
  moveMultipleTasksToColumn: (taskIds: string[], targetColumnId: string, insertIndex?: number) => void,
  columns: any[],
  selectedIds: string[],
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>
) => {
  const columnsRef = useRef(columns);

  useEffect(() => {
    columnsRef.current = columns;
  }, [columns]);

  useEffect(() => {
    return monitorForElements({
      onDrop({ source, location }) {
        const destination = location.current.dropTargets[0];
        if (!destination) return;

        const destinationData = destination.data as DropData;
        const sourceIndex = source.data.index as number;
        const sourceColumnId = source.data.columnId as string;
        const destinationColumnId = destinationData.columnId as string;
        const sourceTodo = source.data.todo as TTodo;

        if (sourceColumnId !== destinationColumnId) {
          let destinationIndex: number;

          if (destinationData.type === 'column') {
            destinationIndex = columnsRef.current.find(col => col.id === destinationColumnId)?.todoIds.length || 0;
          } else {
            const closestEdgeOfTarget = extractClosestEdge(destinationData);
            const destinationTaskIndex = columnsRef.current.find(col => col.id === destinationColumnId)?.todoIds.indexOf((destinationData.todo as TTodo).id) ?? (destinationData.index as number);
            destinationIndex = destinationTaskIndex !== -1 ? destinationTaskIndex : destinationData.index as number;
            if (closestEdgeOfTarget === 'bottom') destinationIndex += 1;
          }

          if (selectedIds.length > 1 && selectedIds.includes(sourceTodo.id)) {
            const selectedTasksInSourceColumn = selectedIds.filter(id =>
              columnsRef.current.some(col => col.id === sourceColumnId && col.todoIds.includes(id))
            );
            if (selectedTasksInSourceColumn.length > 0) {
              moveMultipleTasksToColumn(selectedTasksInSourceColumn, destinationColumnId, destinationIndex);
            } else {
              moveTaskToColumn(sourceTodo.id, destinationColumnId, destinationIndex);
            }
          } else {
            moveTaskToColumn(sourceTodo.id, destinationColumnId, destinationIndex);
          }
          return;
        }

        if (destinationData.type !== 'todo') return;

        const destinationTaskIndex = columnsRef.current.find(col => col.id === destinationColumnId)?.todoIds.indexOf((destinationData.todo as TTodo).id) ?? (destinationData.index as number);
        const destinationElementIndex = destinationTaskIndex !== -1 ? destinationTaskIndex : destinationData.index as number;
        const closestEdgeOfTarget = extractClosestEdge(destinationData);

        if (sourceIndex === destinationElementIndex) return;

        let destinationIndex = destinationElementIndex;
        if (closestEdgeOfTarget === 'bottom') destinationIndex = destinationElementIndex + 1;
        if (sourceIndex < destinationIndex) destinationIndex -= 1;

        const selectedTasksInSameColumn = selectedIds.filter(id =>
          columnsRef.current.some(col => col.id === sourceColumnId && col.todoIds.includes(id))
        );

        if (selectedTasksInSameColumn.length > 1) {
          reorderTodos(sourceIndex, destinationIndex, sourceColumnId);
        } else {
          if (!selectedIds.includes(sourceTodo.id)) setSelectedIds(prev => [...prev, sourceTodo.id]);
          reorderTodos(sourceIndex, destinationIndex, sourceColumnId);
          if (!selectedIds.includes(sourceTodo.id)) setSelectedIds(prev => prev.filter(id => id !== sourceTodo.id));
        }
      },
    });
  }, [reorderTodos, moveTaskToColumn, moveMultipleTasksToColumn, selectedIds, setSelectedIds]);
};
