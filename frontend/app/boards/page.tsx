"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Board } from "@/types";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";

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
    <AuthGuard>
    <div>
      <h1 className="heading mb-4">My Boards</h1>

      <div className="flex gap-2 mb-6">
        <input
          className="input"
          placeholder="New board title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          className="btn btn-primary"
          onClick={createBoard}
        >
          Create
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {boards.map((board) => (
          <div
            key={board.id}
            onClick={() => router.push(`/boards/${board.id}`)}
            className="card p-4 cursor-pointer hover:bg-gray-50"
          >
            {board.title}
          </div>
        ))}
      </div>
    </div>
    </AuthGuard>
  );
}
