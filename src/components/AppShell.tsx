"use client";

import { useState } from "react";
import { SessionProvider } from "next-auth/react";
import Sidebar from "@/components/Sidebar";
import { Menu, Bell } from "lucide-react";

interface AppShellProps {
  children: React.ReactNode;
  user: {
    name: string;
    role: string;
    department: string;
    position: string;
  };
}

export default function AppShell({ children, user }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <SessionProvider>
      <div className="min-h-screen bg-slate-50/80">
        <Sidebar
          role={user.role}
          userName={user.name}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main content */}
        <div className="lg:pl-64">
          {/* Top header */}
          <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-slate-500 hover:text-slate-700"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Welcome, {user.name?.split(" ")[0]}
                </p>
                <p className="text-xs text-slate-400">
                  {user.position} • {user.department}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Clock */}
              <LiveClock />

              {/* Notification bell */}
              <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
              </button>
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
  const [time, setTime] = useState(new Date());

  if (typeof window !== "undefined") {
    setTimeout(() => setTime(new Date()), 1000);
  }

  return (
    <div className="hidden sm:block text-right">
      <p className="text-sm font-semibold text-slate-700 tabular-nums">
        {time.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
      </p>
      <p className="text-[10px] text-slate-400">
        {time.toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short" })}
      </p>
    </div>
  );
}
