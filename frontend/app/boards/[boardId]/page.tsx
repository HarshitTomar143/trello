"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { Activity, List, Task, User } from "@/types";
import { connectSocket, getSocket } from "@/lib/socket";
import AddTaskForm from "@/components/AddTaskForm";
import AddListForm from "@/components/AddListForm";
import SortableTask from "@/components/SortableTask";
import AuthGuard from "@/components/AuthGuard";
import ActivityFeed from "@/components/ActivityFeed";
import ListColumn from "@/components/ListColumn";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
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
  const listsRef = useRef<List[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    if (!boardId) return;

    fetchLists();
    setupSocket();
    fetchUsers();

    return () => {
      const socket = getSocket();
      socket?.disconnect();
    };
  }, [boardId]);

  const fetchLists = async () => {
    const res = await api.get(`/api/lists/${boardId}`);
    const fetchedLists: List[] = res.data;
    setLists(fetchedLists);
    listsRef.current = fetchedLists;
    await fetchTasksForLists(fetchedLists);
  };

  const fetchTasksForLists = async (listsArg: List[]) => {
    const requests = listsArg.map((l) => api.get(`/api/tasks/${l.id}`));
    const results = await Promise.all(requests);
    const combined = results.flatMap((r) => r.data as Task[]);
    setTasks(combined);
  };
  const fetchUsers = async () => {
    const res = await api.get("/api/auth/users");
    setUsers(res.data);
  };
  const handleDragStart = (event: DragStartEvent) => {
    setActiveTaskId(String(event.active.id));
  };

  const createTask = async (listId: string, title: string) => {
    await api.post("/api/tasks", { title, listId });
  };

  const deleteTask = async (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    try {
      await api.delete(`/api/tasks/${taskId}`);
    } catch {
      await fetchTasksForLists(listsRef.current);
    }
  };

  const createList = async (title: string) => {
    if (!boardId) return;
    await api.post("/api/lists", { title, boardId });
    fetchLists();
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTaskId(null);
    if (!over || active.id === over.id) return;

    const activeTask = tasks.find((t) => t.id === active.id);
    const overTask = tasks.find((t) => t.id === over.id);

    if (!activeTask) return;

    if (overTask && activeTask.listId === overTask.listId) {
      const listTasks = tasks
        .filter((t) => t.listId === activeTask.listId)
        .sort((a, b) => a.position - b.position);

      const oldIndex = listTasks.findIndex((t) => t.id === active.id);
      const newIndex = listTasks.findIndex((t) => t.id === over.id);

      const reordered = arrayMove(listTasks, oldIndex, newIndex);

      setTasks((prev) =>
        prev.map((t) => {
          const updated = reordered.find((r) => r.id === t.id);
          return updated ? { ...t, position: reordered.indexOf(updated) } : t;
        })
      );

      await api.patch(`/api/tasks/${active.id}/move`, {
        newPosition: newIndex,
      });
      return;
    }

    const overIsList = listsRef.current.some((l) => l.id === String(over.id));
    const targetListId = overIsList ? String(over.id) : overTask?.listId || "";
    if (!targetListId) return;
    const targetTasks = tasks.filter((t) => t.listId === targetListId).sort((a, b) => a.position - b.position);
    const newIndex = overIsList ? targetTasks.length : targetTasks.findIndex((t) => t.id === over.id);
    await api.patch(`/api/tasks/${active.id}/move-across`, {
      newListId: targetListId,
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

    socket.on("task_moved", async () => {
      await fetchTasksForLists(listsRef.current);
    });
    socket.on("task_moved_across", async () => {
      await fetchTasksForLists(listsRef.current);
    });
    socket.on("task_assigned", async () => {
      await fetchTasksForLists(listsRef.current);
    });
    socket.on("task_unassigned", async () => {
      await fetchTasksForLists(listsRef.current);
    });

    socket.on("activity_created", (activity: Activity) => {
      setActivities((prev) => [activity, ...prev].slice(0, 100));
    });
  };

  return (
    <AuthGuard>
    <div className="flex flex-col">
      <h1 className="heading mb-4">Board</h1>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-6 flex-1">
          <div className="flex gap-4 overflow-x-auto flex-1">
          {lists.map((list) => {
            const listTasks = tasks
              .filter((task) => task.listId === list.id)
              .sort((a, b) => a.position - b.position);

            return (
              <ListColumn key={list.id} id={list.id} title={list.title}>
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
              </ListColumn>
            );
          })}

          <AddListForm onCreate={createList} />
          </div>
          <div className="hidden lg:block w-80 shrink-0">
            <ActivityFeed activities={activities} users={users} lists={lists} />
          </div>
        </div>
        <DragOverlay>
          {activeTaskId ? (
            <div className="card p-3 opacity-80">
              {tasks.find((t) => t.id === activeTaskId)?.title}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
    </AuthGuard>
  );
}
