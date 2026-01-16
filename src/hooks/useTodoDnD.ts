import { useEffect, useRef, useState } from 'react';
import { draggable, dropTargetForElements, monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { attachClosestEdge, extractClosestEdge, type Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { type TTodo } from '@/context/todoContext';

type UseTodoItemDnDProps = {
    todo: TTodo;
    index: number;
    filter: string;
};

export const useTodoItemDnD = ({ todo, index, filter }: UseTodoItemDnDProps) => {
    const elementRef = useRef<HTMLLIElement | null>(null);
    const dragHandleRef = useRef<HTMLDivElement | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [closestEdge, setClosestEdge] = useState<Edge | null>(null);

    useEffect(() => {
        const element = elementRef.current;
        const dragHandle = dragHandleRef.current;
        if (!element || !dragHandle) return;
        if (filter !== 'all') return;

        return draggable({
            element,
            dragHandle,
            getInitialData: () => ({ type: 'todo', todo, index }),
            onDragStart: () => setIsDragging(true),
            onDrop: () => setIsDragging(false),
        });
    }, [todo, index, filter]);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;
        if (filter !== 'all') return;

        return dropTargetForElements({
            element,
            getData: ({ input }) => {
                return attachClosestEdge(
                    { type: 'todo', todo, index },
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
    }, [todo, index, filter]);

    return { elementRef, dragHandleRef, isDragging, closestEdge };
};

export const useTodoMonitor = (reorderTodos: (startIndex: number, endIndex: number) => void) => {
    useEffect(() => {
        return monitorForElements({
            onDrop({ source, location }) {
                const destination = location.current.dropTargets[0];
                if (!destination) {
                    return;
                }

                const destinationElementIndex = destination.data.index;
                const sourceIndex = source.data.index;

                if (
                    typeof destinationElementIndex !== 'number' ||
                    typeof sourceIndex !== 'number'
                ) {
                    return;
                }

                const closestEdgeOfTarget = extractClosestEdge(destination.data);

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

                reorderTodos(sourceIndex, destinationIndex);
            },
        });
    }, [reorderTodos]);
};
