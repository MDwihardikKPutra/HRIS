"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, ClipboardList, CheckCircle2, CalendarDays,
  Plane, ShoppingCart, CreditCard, Users, FolderKanban,
  FileText, ChevronLeft, ChevronRight, LogOut, X, Activity, Search,
  BarChart3, BookOpen, Wallet, ChevronDown
} from "lucide-react";
import { signOut } from "next-auth/react";
import { getPendingApprovalsCount } from "@/lib/data";
import { useState } from "react";

interface SidebarProps {
  role: string;
  userName: string;
  modules: string[];
  open: boolean;
  collapsed: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
}

const menuSections = [
  {
    label: "Dashboard",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["admin", "user"] },
    ],
  },
  {
    label: "Administrasi",
    items: [
      { label: "Manajemen User", href: "/users", icon: Users, roles: ["admin"], moduleKey: "user" },
      { label: "Daftar Cuti & Izin", href: "/leave", icon: CalendarDays, roles: ["admin", "user"], badgeKey: "leave", moduleKey: "leave-approval" },
      { label: "Approval Pembayaran", href: "/finance", icon: Wallet, roles: ["admin", "user"], badgeKey: "finance", moduleKey: "payment-approval" },
      { label: "Project Management", href: "/projects", icon: FolderKanban, roles: ["admin", "user"], moduleKey: "project-management" },
      { label: "EAR", href: "/ear", icon: BarChart3, roles: ["admin", "user"], moduleKey: "ear" },
      { label: "Dokumentasi", href: "/documentation", icon: BookOpen, roles: ["admin", "user"], moduleKey: "documentation" },
    ],
  },
  {
    label: "Modul",
    items: [
      { label: "Rencana Kerja", href: "/work/plans", icon: ClipboardList, roles: ["admin", "user"], moduleKey: "work-plan" },
      { label: "Realisasi Kerja", href: "/work/realizations", icon: CheckCircle2, roles: ["admin", "user"], moduleKey: "work-realization" },
      { label: "Cuti & Izin", href: "/leave", icon: CalendarDays, roles: ["admin", "user"], moduleKey: "leave" },
      { label: "SPD", href: "/spd", icon: Plane, roles: ["admin", "user"], moduleKey: "spd" },
      { label: "Pembelian", href: "/purchase", icon: ShoppingCart, roles: ["admin", "user"], moduleKey: "purchase" },
      { label: "Pembayaran Vendor", href: "/vendor", icon: CreditCard, roles: ["admin", "user"], moduleKey: "vendor-payment" },
    ],
  },
  {
    label: "Fitur",
    items: [
      { label: "Activity Log", href: "/activity-log", icon: Activity, roles: ["admin", "user"] },
    ],
  },
];

export default function Sidebar({ role, userName, modules, open, collapsed, onClose, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const pendingCounts = getPendingApprovalsCount() as Record<string, number>;
  const [expandedSections, setExpandedSections] = useState<string[]>(["Dashboard", "Administrasi", "Modul", "Fitur"]);

  const toggleSection = (label: string) => {
    if (collapsed) return;
    setExpandedSections(prev => 
      prev.includes(label) 
        ? prev.filter(s => s !== label) 
        : [...prev, label]
    );
  };

  const hasAccess = (item: any) => {
    if (role === "admin") return true; // Admin sees everything
    if (modules.includes("all")) return true;

    // Items with no moduleKey/moduleKeys are always visible (Dashboard, Activity Log)
    if (!item.moduleKey && !item.moduleKeys) return true;

    // Fixed default modules that everyone sees
    const defaultModules = ["work-plan", "work-realization", "documentation"];
    
    // Check single key
    if (item.moduleKey && (defaultModules.includes(item.moduleKey) || modules.includes(item.moduleKey))) {
        return true;
    }

    // Check multiple keys (for grouped modules like Finance)
    if (item.moduleKeys && item.moduleKeys.some((k: string) => modules.includes(k))) {
        return true;
    }

    return false;
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 h-full z-50 flex flex-col transition-all duration-300 ease-in-out border-r border-slate-100 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
        style={{
          background: "var(--sidebar-bg)",
          width: collapsed ? "80px" : "260px",
        }}
      >
        {/* Logo Header */}
        <div className="flex items-center h-20 px-6 shrink-0 relative">
          <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-100">
               <span className="text-white font-black text-xs">HR</span>
            </div>
            <div className={`transition-all duration-300 ${collapsed ? "opacity-0 w-0 -translate-x-4" : "opacity-100 w-auto translate-x-0"}`}>
               <span className="font-bold text-slate-800 text-base tracking-tight whitespace-nowrap block">HRIS Next</span>
               <span className="block text-[11px] text-slate-400 font-medium leading-none whitespace-nowrap">
                  Creative Studio
               </span>
            </div>
          </Link>

          {/* Combined Toggle Button - Fixed position */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full border border-slate-100 bg-white items-center justify-center text-slate-400 hover:text-indigo-600 transition-all shadow-sm z-10 hover:scale-110"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Sidebar Search - Better transition */}
        <div className="px-5 mb-6 overflow-hidden">
            <div className="relative group">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <input 
                    type="text" 
                    placeholder={collapsed ? "" : "Search"} 
                    disabled={collapsed}
                    className={`w-full pl-9 pr-4 py-2 bg-slate-50 border-transparent rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-100 focus:bg-white transition-all font-medium placeholder:text-slate-400 ${collapsed ? "opacity-0 cursor-default" : "opacity-100"}`}
                />
            </div>
        </div>

        {/* Menu sections */}
        <nav className="flex-1 overflow-y-auto px-5 space-y-6 scrollbar-hide">
          {menuSections.map((section) => {
            const visibleItems = section.items.filter(hasAccess);
            if (visibleItems.length === 0) return null;

            const isExpanded = expandedSections.includes(section.label);

            return (
              <div key={section.label}>
                {section.label !== "Dashboard" && (
                <button 
                  onClick={() => toggleSection(section.label)}
                  className={`flex items-center justify-between w-full mb-2 transition-all duration-300 group/label ${collapsed ? "opacity-0 h-0 scale-95" : "opacity-100 h-auto scale-100"}`}
                >
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">
                        {section.label}
                    </span>
                    <ChevronDown className={`w-3 h-3 text-slate-300 transition-transform duration-300 ${isExpanded ? "rotate-0" : "-rotate-90"}`} />
                </button>
                )}
                
                <div className={`space-y-1 transition-all duration-300 overflow-hidden ${isExpanded ? "max-h-[500px] opacity-100" : section.label === "Dashboard" ? "max-h-[100px]" : "max-h-0 opacity-0"}`}>
                  {visibleItems.map((item: any) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
                    const badgeCount = item.badgeKey && role === "admin" ? pendingCounts[item.badgeKey] : 0;

                    return (
                      <Link
                        key={item.href + item.label}
                        href={item.href}
                        onClick={onClose}
                        className={`group flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative ${
                          isActive
                            ? "bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-500/5"
                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                           <Icon className={`w-5 h-5 shrink-0 transition-transform ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
                           <span className={`text-sm font-semibold whitespace-nowrap transition-all duration-300 ${collapsed ? "opacity-0 w-0 -translate-x-4 pointer-events-none" : "opacity-100 w-auto translate-x-0"}`}>
                             {item.label}
                           </span>
                        </div>
                        
                        {/* Notification Badge */}
                        {badgeCount > 0 && (
                            <span className={`px-1.5 py-0.5 rounded-lg text-[12px] font-black transition-all ${
                                collapsed ? "absolute top-2 right-2 scale-75" : "opacity-100"
                            } ${isActive ? "bg-indigo-600 text-white" : "bg-red-500 text-white shadow-sm shadow-red-500/20"}`}>
                                {badgeCount}
                            </span>
                        )}

                        {isActive && !collapsed && (
                           <div className="w-1 h-4 bg-indigo-600 rounded-full absolute left-0" />
                        )}
                        
                        {/* Tooltip for collapsed state */}
                        {collapsed && (
                           <div className="absolute left-16 px-3 py-2 bg-slate-900 text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all translate-x-4 group-hover:translate-x-0 z-50 whitespace-nowrap shadow-lg">
                              {item.label}
                              {badgeCount > 0 && ` (${badgeCount})`}
                           </div>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Sidebar Footer User Info */}
        <div className="p-5 border-t border-slate-50 bg-slate-50/10">
            <div className={`flex items-center gap-3 rounded-2xl bg-slate-50 p-3 transition-colors ${collapsed ? "justify-center" : ""}`}>
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-900 text-xs font-bold shrink-0 shadow-sm border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    {userName?.charAt(0) || "U"}
                </div>
                {!collapsed && (
                    <div className="flex-1 min-w-0 transition-all duration-300">
                        <p className="text-xs font-bold text-slate-800 truncate">{userName}</p>
                        <p className="text-[10px] text-slate-400 font-medium capitalize">{role}</p>
                    </div>
                )}
                {!collapsed && (
                    <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors bg-white rounded-lg shadow-sm border border-slate-100"
                        title="Keluar"
                    >
                        <LogOut className="w-3.5 h-3.5" />
                    </button>
                )}
            </div>
        </div>
      </aside>
    </>
  );
}
