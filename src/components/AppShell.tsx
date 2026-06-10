"use client";

import { useState, useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import Sidebar from "@/components/Sidebar";
import { Menu, Bell, PanelLeft } from "lucide-react";

interface AppShellProps {
 children: React.ReactNode;
 user: {
   name: string;
   role: string;
   department: string;
   position: string;
   modules: string[];
 };
 session?: any;
}

export default function AppShell({ children, user, session }: AppShellProps) {
 const [sidebarOpen, setSidebarOpen] = useState(false);
 const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
 const [notificationsOpen, setNotificationsOpen] = useState(false);
 const [currentTime, setCurrentTime] = useState<Date | null>(null);

 useEffect(() => {
   setCurrentTime(new Date());
   const interval = setInterval(() => {
     setCurrentTime(new Date());
   }, 60000);
   return () => clearInterval(interval);
 }, []);

 useEffect(() => {
   const handleKeyDown = (e: KeyboardEvent) => {
     if (e.key === "Escape") setNotificationsOpen(false);
   };
   if (notificationsOpen) {
     window.addEventListener("keydown", handleKeyDown);
   }
   return () => window.removeEventListener("keydown", handleKeyDown);
 }, [notificationsOpen]);

 const formattedTime = currentTime 
   ? new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit' }).format(currentTime)
   : '';
 const formattedDate = currentTime
   ? new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(currentTime)
   : '';

 return (
   <SessionProvider session={session}>
     <div className="h-screen w-screen flex overflow-hidden bg-slate-50" style={{ background: "var(--content-bg)" }}>
       <Sidebar
         role={user.role}
         userName={user.name}
         modules={user.modules}
         open={sidebarOpen}
         collapsed={sidebarCollapsed}
         onClose={() => setSidebarOpen(false)}
         onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
       />

       {/* Main content wrapper */}
       <div className={`flex-1 flex flex-col min-h-0 h-full overflow-hidden transition-all duration-300 ease-in-out ${sidebarCollapsed ? "lg:pl-[72px]" : "lg:pl-[260px]"}`}>
         
         {/* Top header bar */}
         <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-slate-200 shrink-0 z-10 relative">
           <div className="flex items-center gap-2">
             <button
               onClick={() => setSidebarOpen(true)}
               className="lg:hidden text-slate-500 hover:text-slate-900 transition-colors bg-white border border-slate-200 p-2 rounded-md"
             >
               <Menu className="w-5 h-5" />
             </button>
             
             {/* User Identity - Left Side */}
             <div className="hidden sm:flex items-center ml-2 border-l-[0.5px] border-slate-200 pl-4 py-0.5">
               <div>
                 <h1 className="text-base font-medium text-slate-900 leading-none">{user.name}</h1>
                 <p className="text-xs text-slate-500 mt-1">{user.position}</p>
               </div>
             </div>
           </div>

           <div className="flex items-center gap-4">
             
             {/* Clock & Date */}
             {currentTime && (
               <div className="hidden md:flex flex-col items-end mr-1">
                 <span className="text-[13px] font-medium text-slate-700 leading-none">{formattedTime}</span>
                 <span className="text-[11px] text-slate-500 mt-1">{formattedDate}</span>
               </div>
             )}
             
             {currentTime && <div className="hidden md:block h-6 w-[0.5px] bg-slate-200 mx-1" />}

             <div className="relative">
               <button
                 onClick={() => setNotificationsOpen(!notificationsOpen)}
                 className={`relative p-2 transition-colors ${notificationsOpen ? "text-slate-900" : "text-slate-500 hover:text-slate-900"}`}
               >
                 <Bell className="w-5 h-5" />
                 <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
               </button>

               {/* Notifications Dropdown */}
               {notificationsOpen && (
                 <>
                   <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
                   <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 z-50 rounded-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right shadow-xl">
                     <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between">
                       <span className="text-sm font-medium text-slate-900">Notifikasi</span>
                       <span className="text-xs text-indigo-600 font-medium">4 baru</span>
                     </div>
                     <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                       {[
                         { title: "Pengajuan Cuti Tahunan", user: "Rina Wijaya", time: "5m lalu", type: "Leave", status: "pending" },
                         { title: "SPD butuh persetujuan", user: "Budi Santoso", time: "1j lalu", type: "SPD", status: "urgent" },
                         { title: "Faktur Vendor PRJ-001", user: "PT. Baja Utama", time: "3j lalu", type: "Vendor", status: "pending" },
                         { title: "Pembelian Lampu Site", user: "Andi Pratama", time: "5j lalu", type: "Purchase", status: "approved" },
                         { title: "Log Aktivitas: User Edit", user: "Sistem", time: "8j lalu", type: "System", status: "info" },
                       ].map((notif, i) => (
                         <div key={i} className="px-5 py-4 hover:bg-slate-50 transition-colors cursor-pointer group flex items-start gap-4">
                           <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                             notif.status === 'urgent' ? 'bg-red-500' : 
                             notif.status === 'pending' ? 'bg-amber-500' : 'bg-transparent'
                           }`} />
                           <div className="flex-1">
                             <p className="text-[13px] font-medium text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight mb-1">{notif.title}</p>
                             <div className="flex items-center gap-2">
                               <span className="text-xs text-slate-500">{notif.type}</span>
                               <span className="text-slate-300">•</span>
                               <span className="text-xs text-slate-500">{notif.user}</span>
                               <span className="text-slate-300">•</span>
                               <span className="text-xs text-slate-500">{notif.time}</span>
                             </div>
                           </div>
                         </div>
                       ))}
                     </div>
                     <div className="px-5 py-3 border-t border-slate-200 text-center hover:bg-slate-50 transition-colors cursor-pointer">
                       <button className="text-xs font-medium text-slate-600 hover:text-slate-900">View All</button>
                     </div>
                   </div>
                 </>
               )}
             </div>
           </div>
         </header>

         {/* Page content */}
         <main className="flex-1 min-h-0 p-4 lg:p-5 overflow-y-auto scrollbar-hide relative z-0">
           {children}
         </main>
       </div>
     </div>
   </SessionProvider>
 );
}
