"use client";

import { useState } from "react";

interface Props {
  listId: string;
  onCreate: (listId: string, title: string) => void;
}

export default function AddTaskForm({ listId, onCreate }: Props) {
  const [title, setTitle] = useState("");

  const handleCreate = async () => {
    if (!title.trim()) return;

    await onCreate(listId, title);
    setTitle("");
  };

  return (
    <div className="mt-3">
      <input
        className="input mb-2"
        placeholder="New task..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button
        className="btn btn-primary w-full"
        onClick={handleCreate}
      >
        Add Task
      </button>
    </div>
  );
}
