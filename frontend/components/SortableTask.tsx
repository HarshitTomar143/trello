"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import AssignUser from "./AssignUser";

export default function SortableTask({ task, deleteTask }: any) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });
  const [showAssign, setShowAssign] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    boxShadow: transform ? "0 10px 24px rgba(0,0,0,0.12)" : undefined,
    opacity: transform ? 0.9 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="card p-3 mb-3 cursor-grab"
    >
      <div className="flex justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <button
            className="drag"
            {...attributes}
            {...listeners}
          >
            Drag
          </button>
          <span className="mr-3">{task.title}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="btn"
            onClick={() => setShowAssign((s) => !s)}
          >
            Assign
          </button>
          <button
            className="btn btn-danger flex items-center gap-1"
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              setDeleting(true);
              await deleteTask(task.id);
              setDeleting(false);
            }}
            disabled={deleting}
          >
            {deleting ? (
              <>
                <span>Deleting</span>
                <span className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
      {Array.isArray(task.assignments) && task.assignments.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {task.assignments.map((a: any) => (
            <span
              key={a.user.id}
              className="chip"
            >
              {a.user.name || a.user.email}
            </span>
          ))}
        </div>
      )}
      {showAssign && <AssignUser taskId={task.id} onClose={() => setShowAssign(false)} />}
    </div>
  );
}
