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

export const useTodoMonitor = (reorderTodos: (startIndex: number, endIndex: number, columnId: string) => void, moveTaskToColumn: (taskId: string, targetColumnId: string, insertIndex?: number) => void, columns: any[]) => {
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

                    moveTaskToColumn((source.data.todo as TTodo).id, destinationColumnId, destinationIndex);
                    return;
                }

                // Within the same column
                if (destinationData.type !== 'todo') {
                    return;
                }

                const destinationElementIndex = destinationData.index as number;

                if (
                    typeof destinationElementIndex !== 'number' ||
                    typeof sourceIndex !== 'number'
                ) {
                    return;
                }

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

                reorderTodos(sourceIndex, destinationIndex, sourceColumnId);
            },
        });
    }, [reorderTodos, moveTaskToColumn, columns]);
};
