"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, ClipboardList, CheckCircle2, CalendarDays,
  Plane, ShoppingCart, CreditCard, Users, FolderKanban,
  FileText, Bell, ChevronLeft, Fingerprint, LogOut, X
} from "lucide-react";
import { signOut } from "next-auth/react";

interface SidebarProps {
  role: string;
  userName: string;
  open: boolean;
  onClose: () => void;
}

const menuItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["admin", "user"] },
  { type: "divider", label: "Work Management" },
  { label: "Work Plan", href: "/work/plans", icon: ClipboardList, roles: ["admin", "user"] },
  { label: "Work Realization", href: "/work/realizations", icon: CheckCircle2, roles: ["admin", "user"] },
  { type: "divider", label: "Requests" },
  { label: "Leave", href: "/leave", icon: CalendarDays, roles: ["admin", "user"] },
  { label: "SPD", href: "/spd", icon: Plane, roles: ["admin", "user"] },
  { label: "Purchase", href: "/purchase", icon: ShoppingCart, roles: ["admin", "user"] },
  { label: "Vendor Payment", href: "/vendor-payment", icon: CreditCard, roles: ["admin", "user"] },
  { type: "divider", label: "Administration" },
  { label: "Approval", href: "/approval", icon: CheckCircle2, roles: ["admin"] },
  { label: "Users", href: "/users", icon: Users, roles: ["admin"] },
  { label: "Projects", href: "/projects", icon: FolderKanban, roles: ["admin"] },
  { label: "Documentation", href: "/documentation", icon: FileText, roles: ["admin"] },
];

export default function Sidebar({ role, userName, open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-200/80 z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-slate-100">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-sm">
              <Fingerprint className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-sm tracking-tight">HRIS</span>
              <span className="block text-[10px] text-slate-400 -mt-0.5 leading-none">Management System</span>
            </div>
          </Link>
          <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
          {menuItems.map((item, idx) => {
            if (item.type === "divider") {
              return (
                <div key={idx} className="pt-4 pb-1.5 px-3">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    {item.label}
                  </span>
                </div>
              );
            }
            if (item.roles && !item.roles.includes(role)) return null;

            const Icon = item.icon!;
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href!}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150 group ${
                  isActive
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-500"}`} />
                <span>{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User info & logout */}
        <div className="border-t border-slate-100 p-3">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-50">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-white text-xs font-semibold">
              {userName?.charAt(0) || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-900 truncate">{userName}</p>
              <p className="text-[10px] text-slate-500 capitalize">{role}</p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-slate-400 hover:text-red-500 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
