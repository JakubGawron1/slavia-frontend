"use client";

import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { LibraryExercise, PlanExercise } from "@/lib/api/generated/models";
import { ExerciseBlock } from "@/components/plans/editor/ExerciseBlock";

function SortableItem({
  exercise,
  library,
  onChange,
  onRemove,
  onMove,
  canUp,
  canDown,
}: {
  exercise: PlanExercise;
  library: LibraryExercise[];
  onChange: (next: PlanExercise) => void;
  onRemove: () => void;
  onMove: (dir: -1 | 1) => void;
  canUp: boolean;
  canDown: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: exercise.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div ref={setNodeRef} style={style}>
      <ExerciseBlock
        exercise={exercise}
        library={library}
        onChange={onChange}
        onRemove={onRemove}
        onMove={onMove}
        canUp={canUp}
        canDown={canDown}
        dragHandle={
          <button
            type="button"
            className="cursor-grab px-1 py-1 font-display text-sm leading-none tracking-[0.2em] text-paper/25 hover:text-paper active:cursor-grabbing"
            aria-label="Przeciągnij ćwiczenie"
            {...attributes}
            {...listeners}
          >
            ⋮⋮
          </button>
        }
      />
    </div>
  );
}

export function SortableExercises({
  exercises,
  library,
  onChange,
}: {
  exercises: PlanExercise[];
  library: LibraryExercise[];
  onChange: (next: PlanExercise[]) => void;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = exercises.findIndex((e) => e.id === active.id);
    const newIndex = exercises.findIndex((e) => e.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    onChange(arrayMove(exercises, oldIndex, newIndex));
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <SortableContext
        items={exercises.map((e) => e.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {exercises.map((ex, i) => (
            <SortableItem
              key={ex.id}
              exercise={ex}
              library={library}
              onChange={(next) =>
                onChange(exercises.map((e) => (e.id === next.id ? next : e)))
              }
              onRemove={() => onChange(exercises.filter((e) => e.id !== ex.id))}
              onMove={(dir) => {
                const j = i + dir;
                if (j < 0 || j >= exercises.length) return;
                onChange(arrayMove(exercises, i, j));
              }}
              canUp={i > 0}
              canDown={i < exercises.length - 1}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
