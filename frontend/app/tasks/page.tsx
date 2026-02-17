 "use client";
 
 import { useEffect, useState } from "react";
 import { api } from "@/lib/api";
 import AuthGuard from "@/components/AuthGuard";
 
 interface TaskItem {
   id: string;
   title: string;
   description?: string;
   createdAt: string;
   listId: string;
 }
 
 export default function TasksPage() {
   const [tasks, setTasks] = useState<TaskItem[]>([]);
   const [search, setSearch] = useState("");
   const [page, setPage] = useState(1);
   const [limit, setLimit] = useState(10);
   const [totalPages, setTotalPages] = useState(1);
 
   const fetchTasks = async () => {
     const res = await api.get("/api/tasks", {
       params: { search, page, limit },
     });
     setTasks(res.data.data);
     setTotalPages(res.data.pagination.totalPages);
   };
 
   useEffect(() => {
     fetchTasks();
   }, [page, limit]);
 
   return (
     <AuthGuard>
      <div>
        <h1 className="heading mb-4">Tasks</h1>
        <div className="card p-4 mb-4">
          <div className="flex flex-col sm:flex-row gap-2 items-stretch">
            <input
              className="input flex-1 h-11 text-base"
              placeholder="Search tasks"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="flex gap-2">
              <select
                className="input w-28 h-11 text-base"
                value={limit}
                onChange={(e) => {
                  setPage(1);
                  setLimit(parseInt(e.target.value));
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
              <button
                className="btn btn-primary h-11"
                onClick={() => {
                  setPage(1);
                  fetchTasks();
                }}
              >
                Search
              </button>
            </div>
          </div>
        </div>
 
         <ul className="space-y-2">
           {tasks.map((t) => (
            <li key={t.id} className="card p-3">
               <div className="font-medium">{t.title}</div>
               {t.description && <div className="text-sm text-gray-600">{t.description}</div>}
             </li>
           ))}
         </ul>
 
         <div className="flex items-center gap-2 mt-4">
           <button
            className="btn"
             onClick={() => setPage((p) => Math.max(1, p - 1))}
             disabled={page <= 1}
           >
             Prev
           </button>
           <span>
             Page {page} / {totalPages}
           </span>
           <button
            className="btn"
             onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
             disabled={page >= totalPages}
           >
             Next
           </button>
         </div>
       </div>
     </AuthGuard>
   );
 }
