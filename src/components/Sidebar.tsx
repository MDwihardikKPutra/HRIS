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
        <div className="flex items-center h-16 px-5 shrink-0 relative">
          <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
               <span className="text-white font-black text-[10px]">HR</span>
            </div>
            <div className={`transition-all duration-300 ${collapsed ? "opacity-0 w-0 -translate-x-4 overflow-hidden pointer-events-none absolute" : "opacity-100 w-auto translate-x-0 relative"}`}>
               <span className="font-bold text-slate-800 text-base tracking-tight whitespace-nowrap block">HRIS Next</span>
               <span className="block text-[11px] text-slate-400 font-bold leading-none whitespace-nowrap">
                  Human Resource Integration System
               </span>
            </div>
          </Link>

          {/* Combined Toggle Button - Fixed position */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full border border-slate-100 bg-white items-center justify-center text-slate-400 hover:text-indigo-600 transition-all z-10 hover:scale-110"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>



        {/* Menu sections */}
        <nav className="flex-1 overflow-y-auto px-4 space-y-4 pt-2 scrollbar-hide">
          {menuSections.map((section) => {
            const visibleItems = section.items.filter(hasAccess);
            if (visibleItems.length === 0) return null;

            const isExpanded = expandedSections.includes(section.label);

            return (
              <div key={section.label}>
                {section.label !== "Dashboard" && (
                <button 
                  onClick={() => toggleSection(section.label)}
                  className={`flex items-center justify-between w-full mb-1.5 transition-all duration-300 group/label px-1 ${collapsed ? "opacity-0 h-0 w-0 overflow-hidden pointer-events-none absolute" : "opacity-100 h-auto scale-100 relative"}`}
                >
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap truncate">
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
                        className={`group flex items-center justify-between transition-all duration-200 relative ${
                          collapsed ? "w-9 h-9 mx-auto justify-center rounded-lg p-0" : "w-full px-2.5 py-1.5 gap-2.5 rounded-lg"
                        } ${
                          isActive
                            ? "bg-indigo-50 text-indigo-600"
                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                      >
                        <div className={`flex items-center gap-2.5 ${collapsed ? "justify-center" : ""}`}>
                           <Icon className={`w-[16px] h-[16px] shrink-0 transition-transform ${collapsed ? "" : isActive ? "scale-110" : "group-hover:scale-110"}`} />
                           <span className={`text-xs font-semibold whitespace-nowrap transition-all duration-300 ${collapsed ? "opacity-0 w-0 -translate-x-4 pointer-events-none absolute overflow-hidden" : "opacity-100 w-auto translate-x-0 relative"}`}>
                             {item.label}
                           </span>
                        </div>
                        
                        {/* Notification Badge */}
                        {badgeCount > 0 && (
                            <span className={`rounded-md font-black transition-all ${
                                collapsed ? "absolute top-0 right-0 w-3 h-3 text-[8px] flex items-center justify-center p-0" : "px-1.5 py-0.5 text-[10px]"
                            } ${isActive ? "bg-indigo-600 text-white" : "bg-red-500 text-white"}`}>
                                {badgeCount}
                            </span>
                        )}

                        {isActive && !collapsed && (
                           <div className="w-1 h-4 bg-indigo-600 rounded-full absolute left-0" />
                        )}
                        
                        {/* Tooltip for collapsed state */}
                        {collapsed && (
                           <div className="absolute left-16 px-3 py-2 bg-slate-900 text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all translate-x-4 group-hover:translate-x-0 z-50 whitespace-nowrap">
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
        <div className="p-4 border-t border-slate-50 bg-slate-50/10">
            <div className={`flex items-center gap-2.5 rounded-xl bg-slate-50 p-2 transition-colors ${collapsed ? "justify-center" : ""}`}>
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-900 text-[10px] font-bold shrink-0 border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    {userName?.charAt(0) || "U"}
                </div>
                {!collapsed && (
                    <div className="flex-1 min-w-0 transition-all duration-300">
                        <p className="text-xs font-bold text-slate-800 truncate leading-none mb-1">{userName}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{role}</p>
                    </div>
                )}
                {!collapsed && (
                    <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors bg-white rounded-lg border border-slate-100"
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
