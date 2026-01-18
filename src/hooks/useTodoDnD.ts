import { useEffect, useRef, useState } from 'react';
import { draggable, dropTargetForElements, monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { attachClosestEdge, extractClosestEdge, type Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { type TTodo } from '@/context/todoContext';

type UseTodoItemDnDProps = {
    todo: TTodo;
    index: number;
    filter: string;
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

        if (filter !== 'all' || searchQuery) return;

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

        if (filter !== 'all' || searchQuery) return;

        return dropTargetForElements({
            element,
            getData: ({ input }) => {
                return attachClosestEdge(
                    { type: 'todo', todo, index, columnId },
                    { element, input, allowedEdges: ['top', 'bottom'] },
                );
            },
            onDragEnter: ({ self }) => {
                const closestEdge = extractClosestEdge(self.data);
                setClosestEdge(closestEdge);
            },
            onDrag: ({ self }) => {
                const closestEdge = extractClosestEdge(self.data);
                setClosestEdge(closestEdge);
            },
            onDragLeave: () => {
                setClosestEdge(null);
            },
            onDrop: () => {
                setClosestEdge(null);
            },
        });
    }, [todo, index, filter, searchQuery, columnId]);

    return { elementRef, dropRef, isDragging, closestEdge };
};

export const useTodoMonitor = (reorderTodos: (startIndex: number, endIndex: number, columnId: string) => void, moveTaskToColumn: (taskId: string, targetColumnId: string, insertIndex?: number) => void, moveMultipleTasksToColumn: (taskIds: string[], targetColumnId: string, insertIndex?: number) => void, columns: any[], selectedIds: string[], setSelectedIds: (ids: string[]) => void) => {
    useEffect(() => {
        return monitorForElements({
            onDrop({ source, location }) {
                const destination = location.current.dropTargets[0];
                if (!destination) {
                    return;
                }

                const destinationData = destination.data;
                const sourceIndex = source.data.index as number;
                const sourceColumnId = source.data.columnId as string;
                const destinationColumnId = destinationData.columnId as string;
                
                // Get the source todo
                const sourceTodo = source.data.todo as TTodo;

                // If dragging to a different column, move the task
                if (sourceColumnId !== destinationColumnId) {
                    let destinationIndex: number;

                    if (destinationData.type === 'column') {
                        // Dropping on empty column
                        destinationIndex = columns.find(col => col.id === destinationColumnId)?.todoIds.length || 0;
                    } else {
                        // Dropping on a task in another column
                        const closestEdgeOfTarget = extractClosestEdge(destinationData);
                        destinationIndex = destinationData.index as number;
                        if (closestEdgeOfTarget === 'bottom') {
                            destinationIndex += 1;
                        }
                    }

                    // If multiple items are selected, move all selected items
                    if (selectedIds.length > 1 && selectedIds.includes(sourceTodo.id)) {
                        // Move all selected items to the destination column
                        moveMultipleTasksToColumn(selectedIds, destinationColumnId, destinationIndex);
                    } else {
                        // Move only the single dragged item
                        moveTaskToColumn(sourceTodo.id, destinationColumnId, destinationIndex);
                    }
                    return;
                }

                // Within the same column - only move the single dragged item
                // and potentially update selection to just this item
                if (destinationData.type !== 'todo') {
                    return;
                }

                const destinationElementIndex = destinationData.index as number;

                const closestEdgeOfTarget = extractClosestEdge(destinationData);

                if (sourceIndex === destinationElementIndex) {
                    return;
                }

                let destinationIndex = destinationElementIndex;

                if (closestEdgeOfTarget === 'bottom') {
                    destinationIndex = destinationElementIndex + 1;
                }

                if (sourceIndex < destinationIndex) {
                    destinationIndex -= 1;
                }

                // When reordering within the same column, we want to make sure
                // only the dragged item is selected (if it wasn't already)
                if (!selectedIds.includes(sourceTodo.id)) {
                    // If the dragged item was not selected, clear all selections
                    setSelectedIds([sourceTodo.id]);
                } else if (selectedIds.length > 1) {
                    // If multiple items were selected, select only the dragged item
                    setSelectedIds([sourceTodo.id]);
                }
                
                reorderTodos(sourceIndex, destinationIndex, sourceColumnId);
            },
        });
    }, [reorderTodos, moveTaskToColumn, moveMultipleTasksToColumn, columns, selectedIds, setSelectedIds]);
};
