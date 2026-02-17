"use client";

import { useState } from "react";

interface Props {
  onCreate: (title: string) => void;
}

export default function AddListForm({ onCreate }: Props) {
  const [title, setTitle] = useState("");

  const handleCreate = async () => {
    if (!title.trim()) return;

    await onCreate(title);
    setTitle("");
  };

  return (
    <div className="min-w-[300px] card p-4">
      <input
        className="input mb-2"
        placeholder="New list..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <button
        className="btn btn-primary w-full"
        onClick={handleCreate}
      >
        Add List
      </button>
    </div>
  );
}
