'use client';

import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from '@/components/admin/SortableItem';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

interface SortableListProps {
  items: any[];
  onReorder: (items: any[]) => void;
  renderItem: (item: any) => React.ReactNode;
  getId?: (item: any) => string;
}

export function SortableList({ items, onReorder, renderItem, getId }: SortableListProps) {
  const [localItems, setLocalItems] = useState(items);

  // Sync items from parent
  React.useEffect(() => {
    setLocalItems(items);
  }, [items]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = localItems.findIndex((item) =>
        (getId ? getId(item) : item.id) === active.id
      );
      const newIndex = localItems.findIndex((item) =>
        (getId ? getId(item) : item.id) === over.id
      );

      const newItems = arrayMove(localItems, oldIndex, newIndex);
      setLocalItems(newItems);
      onReorder(newItems);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis]}
    >
      <SortableContext
        items={localItems.map((item) => getId ? getId(item) : item.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {localItems.map((item) => (
            <SortableItem key={getId ? getId(item) : item.id} id={getId ? getId(item) : item.id}>
              {renderItem(item)}
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
