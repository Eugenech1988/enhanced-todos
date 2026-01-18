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
        // Enable drag functionality regardless of filter or search query
        // This allows reordering within the same column even when filtered
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

        // Enable drop functionality regardless of filter or search query
        // This allows reordering within the same column even when filtered
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

// Add a ref to track the latest columns value
export const useTodoMonitor = (reorderTodos: (startIndex: number, endIndex: number, columnId: string) => void, moveTaskToColumn: (taskId: string, targetColumnId: string, insertIndex?: number) => void, moveMultipleTasksToColumn: (taskIds: string[], targetColumnId: string, insertIndex?: number) => void, columns: any[], selectedIds: string[], setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>) => {
    const columnsRef = useRef(columns);

    // Update the ref when columns change
    useEffect(() => {
        columnsRef.current = columns;
    }, [columns]);

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
                        destinationIndex = columnsRef.current.find(col => col.id === destinationColumnId)?.todoIds.length || 0;
                    } else {
                        // Dropping on a task in another column
                        const closestEdgeOfTarget = extractClosestEdge(destinationData);
                        // Get the actual index of the destination task in the current column state
                        const destinationTaskIndex = columnsRef.current.find(col => col.id === destinationColumnId)?.todoIds.indexOf(destinationData.todo.id) ?? destinationData.index as number;
                        destinationIndex = destinationTaskIndex !== -1 ? destinationTaskIndex : destinationData.index as number;
                        if (closestEdgeOfTarget === 'bottom') {
                            destinationIndex += 1;
                        }
                    }

                    // If multiple items are selected, move only the selected items from the same source column
                    if (selectedIds.length > 1 && selectedIds.includes(sourceTodo.id)) {
                        // Get all selected tasks that belong to the source column
                        const selectedTasksInSourceColumn = selectedIds.filter(id => {
                            // Find which column this task belongs to
                            return columnsRef.current.some(col => col.id === sourceColumnId && col.todoIds.includes(id));
                        });

                        // Move only the selected items from the source column to the destination column
                        if (selectedTasksInSourceColumn.length > 0) {
                            moveMultipleTasksToColumn(selectedTasksInSourceColumn, destinationColumnId, destinationIndex);
                        } else {
                            // If no selected tasks are in the source column, move just the source task
                            moveTaskToColumn(sourceTodo.id, destinationColumnId, destinationIndex);
                        }
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

                // Get the actual index of the destination task in the current column state
                const destinationTaskIndex = columnsRef.current.find(col => col.id === destinationColumnId)?.todoIds.indexOf(destinationData.todo.id) ?? destinationData.index as number;
                const destinationElementIndex = destinationTaskIndex !== -1 ? destinationTaskIndex : destinationData.index as number;

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

                // Check if there are multiple selected items in the same column
                const selectedTasksInSameColumn = selectedIds.filter(id => {
                    return columnsRef.current.some(col => col.id === sourceColumnId && col.todoIds.includes(id));
                });

                if (selectedTasksInSameColumn.length > 1) {
                    // Reorder all selected tasks in the column together
                    // This is more complex and would require a different reorder function
                    // For now, we'll just reorder the single dragged item but preserve selection
                    reorderTodos(sourceIndex, destinationIndex, sourceColumnId);
                } else {
                    // When reordering within the same column, preserve the existing selection
                    // Only update selection if the dragged item was not previously selected
                    if (!selectedIds.includes(sourceTodo.id)) {
                        // If the dragged item was not selected, add it to the existing selection
                        setSelectedIds(prev => [...prev, sourceTodo.id]);
                    }
                    // If the item was already selected, keep the selection unchanged
                    
                    reorderTodos(sourceIndex, destinationIndex, sourceColumnId);
                    
                    // Clear the selection of the dragged item after reordering to prevent it from staying selected
                    // Only clear if it was added during this drag operation
                    if (!selectedIds.includes(sourceTodo.id)) {
                        setSelectedIds(prev => prev.filter(id => id !== sourceTodo.id));
                    }
                }
            },
        });
    }, [reorderTodos, moveTaskToColumn, moveMultipleTasksToColumn, selectedIds, setSelectedIds]); // Remove columns from dependency array
};
