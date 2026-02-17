 "use client";
 
 import { useRouter } from "next/navigation";
 
 export function LogoutButton() {
   const router = useRouter();
   const logout = () => {
     localStorage.removeItem("token");
     router.replace("/login");
   };
   return (
    <button className="btn" onClick={logout}>
       Logout
     </button>
   );
 }
