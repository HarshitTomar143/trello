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
    <div className="min-w-[300px] bg-gray-200 p-4 rounded-lg shadow">
      <input
        className="w-full border p-2 rounded mb-2"
        placeholder="New list..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <button
        className="w-full bg-black text-white p-2 rounded"
        onClick={handleCreate}
      >
        Add List
      </button>
    </div>
  );
}
