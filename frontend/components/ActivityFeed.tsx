 "use client";
 
 import { Activity, User, List } from "@/types";
 
export default function ActivityFeed({
  activities,
  users,
  lists,
}: {
  activities: Activity[];
  users: User[];
  lists: List[];
}) {
  const userById = new Map(users.map((u) => [u.id, u]));
  const listTitleById = new Map(lists.map((l) => [l.id, l.title]));
  const format = (a: Activity) => {
    if (a.action === "TASK_CREATED") return "Task created";
    if (a.action === "TASK_DELETED") return "Task deleted";
    if (a.action === "TASK_MOVED") return `Task moved to position ${a.metadata?.newPosition}`;
    if (a.action === "TASK_MOVED_ACROSS") {
      const title = listTitleById.get(a.metadata?.newListId) || a.metadata?.newListId;
      return `Task moved across to ${title} at ${a.metadata?.newPosition}`;
    }
    if (a.action === "TASK_ASSIGNED") {
      const u = userById.get(a.metadata?.assignedUserId);
      const label = u ? u.name || u.email : a.metadata?.assignedUserId;
      return `Task assigned to ${label}`;
    }
    if (a.action === "TASK_UNASSIGNED") {
      const u = userById.get(a.metadata?.unassignedUserId);
      const label = u ? u.name || u.email : a.metadata?.unassignedUserId;
      return `Task unassigned from ${label}`;
    }
    return a.action;
  };
   return (
     <div className="min-w-[280px] card">
       <div className="px-4 py-2 border-b font-medium">Activity</div>
       <div className="max-h-[60vh] overflow-y-auto p-2 space-y-2">
         {activities.length === 0 ? (
           <div className="text-sm text-gray-500 px-2 py-4">No activity yet</div>
         ) : (
           activities.map((a) => (
             <div key={a.id} className="px-3 py-2 bg-gray-50 rounded text-sm">
              <div className="font-medium">{format(a)}</div>
               <div className="text-xs text-gray-500">
                 {new Date(a.createdAt).toLocaleString()}
               </div>
             </div>
           ))
         )}
       </div>
     </div>
   );
 }
