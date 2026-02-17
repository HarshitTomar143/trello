 "use client";
 
 import { useEffect, useState } from "react";
 import { api } from "@/lib/api";
 
 interface User {
   id: string;
   name: string;
   email: string;
 }
 
 export default function AssignUser({ taskId, onClose }: { taskId: string; onClose: () => void }) {
   const [users, setUsers] = useState<User[]>([]);
   const [selected, setSelected] = useState<string>("");
   const [loading, setLoading] = useState(false);
 
   useEffect(() => {
     const load = async () => {
       const res = await api.get("/api/auth/users");
       setUsers(res.data);
     };
     load();
   }, []);
 
   const assign = async () => {
     if (!selected) return;
     setLoading(true);
     await api.post(`/api/tasks/${taskId}/assign`, { userId: selected });
     setLoading(false);
     onClose();
   };
 
   const unassign = async () => {
     if (!selected) return;
     setLoading(true);
     await api.delete(`/api/tasks/${taskId}/unassign/${selected}`);
     setLoading(false);
     onClose();
   };
 
   return (
     <div className="mt-2 flex items-center gap-2">
       <select
         className="border p-2 rounded flex-1"
         value={selected}
         onChange={(e) => setSelected(e.target.value)}
       >
         <option value="">Select user</option>
         {users.map((u) => (
           <option key={u.id} value={u.id}>
             {u.name || u.email}
           </option>
         ))}
       </select>
       <button
         className="px-3 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
         onClick={assign}
         disabled={loading}
       >
         Assign
       </button>
       <button
         className="px-3 py-2 bg-gray-300 rounded disabled:opacity-50"
         onClick={unassign}
         disabled={loading}
       >
         Unassign
       </button>
     </div>
   );
 }
