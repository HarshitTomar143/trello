 "use client";
 
 import { useDroppable } from "@dnd-kit/core";
 
 export default function ListColumn({
   id,
  title,
   children,
 }: {
   id: string;
  title: string;
   children: React.ReactNode;
 }) {
   const { isOver, setNodeRef } = useDroppable({ id });
   return (
     <div
       ref={setNodeRef}
      className={`min-w-[340px] card p-4 flex flex-col ${isOver ? "ring-2 ring-blue-300 bg-blue-50" : ""}`}
     >
       {children}
      {isOver && (
        <div className="mt-2 text-xs text-blue-700 bg-blue-100 border border-blue-200 rounded px-2 py-1">
          Drop to move to {title}
        </div>
      )}
     </div>
   );
 }
