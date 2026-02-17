"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { List, Task } from "@/types";
import { connectSocket, getSocket } from "@/lib/socket";
import AddTaskForm from "@/components/AddTaskForm";
import AddListForm from "@/components/AddListForm";
import SortableTask from "@/components/SortableTask";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

export default function BoardPage() {
  const { boardId } = useParams();
  const [lists, setLists] = useState<List[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    if (!boardId) return;

    fetchLists();
    fetchTasks();
    setupSocket();

    return () => {
      const socket = getSocket();
      socket?.disconnect();
    };
  }, [boardId]);

  const fetchLists = async () => {
    const res = await api.get(`/api/lists/${boardId}`);
    setLists(res.data);
  };

  const fetchTasks = async () => {
    const res = await api.get(`/api/tasks?boardId=${boardId}&limit=100`);
    setTasks(res.data.data);
  };

  const createTask = async (listId: string, title: string) => {
    await api.post("/api/tasks", { title, listId });
  };

  const deleteTask = async (taskId: string) => {
    await api.delete(`/api/tasks/${taskId}`);
  };

  const createList = async (title: string) => {
    if (!boardId) return;
    await api.post("/api/lists", { title, boardId });
    fetchLists();
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeTask = tasks.find((t) => t.id === active.id);
    const overTask = tasks.find((t) => t.id === over.id);

    if (!activeTask || !overTask) return;

    // SAME LIST ONLY (Phase 1)
    if (activeTask.listId !== overTask.listId) return;

    const listTasks = tasks
      .filter((t) => t.listId === activeTask.listId)
      .sort((a, b) => a.position - b.position);

    const oldIndex = listTasks.findIndex((t) => t.id === active.id);
    const newIndex = listTasks.findIndex((t) => t.id === over.id);

    const reordered = arrayMove(listTasks, oldIndex, newIndex);

    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => {
        const updated = reordered.find((r) => r.id === t.id);
        return updated
          ? { ...t, position: reordered.indexOf(updated) }
          : t;
      })
    );

    await api.patch(`/api/tasks/${active.id}/move`, {
      newPosition: newIndex,
    });
  };

  const setupSocket = () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const socket = connectSocket(token);

    socket.emit("join_board", boardId);

    socket.on("task_created", (task: Task) => {
      setTasks((prev) => [...prev, task]);
    });

    socket.on("task_deleted", (taskId: string) => {
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    });

    
  };

  return (
    <div className="h-screen bg-gray-200 p-6 flex flex-col">
      <h1 className="text-2xl font-bold mb-6">Board</h1>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-6 overflow-x-auto flex-1">
          {lists.map((list) => {
            const listTasks = tasks
              .filter((task) => task.listId === list.id)
              .sort((a, b) => a.position - b.position);

            return (
              <div
                key={list.id}
                className="min-w-[300px] bg-gray-100 p-4 rounded-lg shadow flex flex-col"
              >
                <h2 className="font-semibold text-lg mb-4">
                  {list.title}
                </h2>

                <SortableContext
                  items={listTasks.map((task) => task.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="flex-1">
                    {listTasks.map((task) => (
                      <SortableTask
                        key={task.id}
                        task={task}
                        deleteTask={deleteTask}
                      />
                    ))}
                  </div>
                </SortableContext>

                <AddTaskForm
                  listId={list.id}
                  onCreate={createTask}
                />
              </div>
            );
          })}

          <AddListForm onCreate={createList} />
        </div>
      </DndContext>
    </div>
  );
}
