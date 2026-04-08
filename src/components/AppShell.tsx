"use client";

import { useState, useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import Sidebar from "@/components/Sidebar";
import { Menu, Bell, LayoutGrid } from "lucide-react";

interface AppShellProps {
  children: React.ReactNode;
  user: {
    name: string;
    role: string;
    department: string;
    position: string;
    modules: string[];
  };
}

export default function AppShell({ children, user }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <SessionProvider>
      <div className="min-h-screen" style={{ background: "var(--content-bg)" }}>
        <Sidebar
          role={user.role}
          userName={user.name}
          modules={user.modules}
          open={sidebarOpen}
          collapsed={sidebarCollapsed}
          onClose={() => setSidebarOpen(false)}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Main content */}
        <div className={`transition-all duration-300 ease-in-out ${sidebarCollapsed ? "lg:pl-[80px]" : "lg:pl-[260px]"}`}>

          {/* Clean top header bar */}
          <header
            className="sticky top-0 z-30 h-16 flex items-center justify-between px-6 border-b border-slate-100 backdrop-blur-md bg-white/80"
          >
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-slate-500 hover:text-slate-900 transition-colors bg-white border border-slate-100 shadow-sm p-2 rounded-lg"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-5">
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className={`relative p-2 rounded-full transition-all ${notificationsOpen ? "bg-indigo-50 text-indigo-600" : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"}`}
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-white" />
                </button>

                {/* Notifications Dropdown */}
                {notificationsOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
                    <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-100 z-50 rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right shadow-[0_15px_35px_-5px_rgba(0,0,0,0.1)]">
                      <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                        <span className="text-xs font-semibold text-slate-900">Notifications</span>
                        <span className="text-[10px] px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-lg font-bold">4 NEW</span>
                      </div>
                      <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                        {[
                          { title: "Pengajuan Cuti Tahunan", user: "Rina Wijaya", time: "5m lalu", type: "Leave", status: "pending" },
                          { title: "SPD butuh persetujuan", user: "Budi Santoso", time: "1j lalu", type: "SPD", status: "urgent" },
                          { title: "Faktur Vendor PRJ-001", user: "PT. Baja Utama", time: "3j lalu", type: "Vendor", status: "pending" },
                          { title: "Pembelian Lampu Site", user: "Andi Pratama", time: "5j lalu", type: "Purchase", status: "approved" },
                          { title: "Log Aktivitas: User Edit", user: "Sistem", time: "8j lalu", type: "System", status: "info" },
                        ].map((notif, i) => (
                          <div key={i} className="px-5 py-4 hover:bg-slate-50 transition-colors cursor-pointer group flex items-start gap-4">
                            <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                              notif.status === 'urgent' ? 'bg-red-500 animate-pulse' : 
                              notif.status === 'pending' ? 'bg-amber-400' : 'bg-slate-300'
                            }`} />
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">{notif.title}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1.5 py-0.5 rounded bg-slate-100">{notif.type}</span>
                                <span className="text-[10px] text-slate-400 font-medium">{notif.user} • {notif.time}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 text-center hover:bg-slate-100 transition-colors cursor-pointer">
                        <button className="text-xs font-semibold text-indigo-600">View All</button>
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              <div className="hidden sm:block h-6 w-px bg-slate-200 mx-1" />
              
              <div className="flex items-center gap-3 cursor-pointer group">
                  <div className="w-9 h-9 rounded-full bg-slate-100 overflow-hidden border border-slate-200 flex items-center justify-center">
                     <span className="text-sm font-bold text-slate-600 group-hover:text-indigo-600">{user.name.charAt(0)}</span>
                  </div>
                  <div className="hidden sm:block">
                      <p className="text-sm font-semibold text-slate-800 leading-none group-hover:text-indigo-600 transition-colors">{user.name}</p>
                      <p className="text-xs text-slate-500 font-medium leading-none mt-1.5">{user.position}</p>
                  </div>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </SessionProvider>
  );
}

function LiveClock() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time) return null;

  return (
    <div className="hidden sm:block text-right">
      <p className="text-[10px] text-slate-500 font-medium">
        {time.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
      </p>
      <p className="text-[12px] font-bold text-slate-800 tabular-nums tracking-wider leading-tight">
        {time.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
      </p>
    </div>
  );
}
