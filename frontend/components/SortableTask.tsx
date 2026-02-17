"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function SortableTask({ task, deleteTask }: any) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white p-3 rounded shadow mb-3 flex justify-between items-center cursor-grab"
    >
      <span>{task.title}</span>

      <button
        className="text-red-500 text-sm"
        onClick={() => deleteTask(task.id)}
      >
        ✕
      </button>
    </div>
  );
}
