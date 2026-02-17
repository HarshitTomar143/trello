"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Board } from "@/types";
import { useRouter } from "next/navigation";

export default function BoardsPage() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [title, setTitle] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    const res = await api.get("/api/boards");
    setBoards(res.data);
  };

  const createBoard = async () => {
    await api.post("/api/boards", { title });
    setTitle("");
    fetchBoards();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Boards</h1>

      <div className="flex gap-2 mb-6">
        <input
          className="border p-2"
          placeholder="New board title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          className="bg-black text-white px-4"
          onClick={createBoard}
        >
          Create
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {boards.map((board) => (
          <div
            key={board.id}
            onClick={() => router.push(`/boards/${board.id}`)}
            className="border p-4 cursor-pointer hover:bg-gray-100"
          >
            {board.title}
          </div>
        ))}
      </div>
    </div>
  );
}
