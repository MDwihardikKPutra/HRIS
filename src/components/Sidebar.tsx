"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, ClipboardList, CheckCircle2, CalendarDays,
  Plane, ShoppingCart, Wallet,
  Users, FolderKanban, Activity, BarChart3, BookOpen,
  ChevronDown, ChevronUp, Banknote, LogOut,
  Briefcase, Settings, FileText, ShieldCheck, HeartPulse,
  ChevronLeft, ChevronRight
} from "lucide-react";
import { signOut } from "next-auth/react";
import { ROLE_ACCESS, UserRole } from "@/lib/data";

interface MenuItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
  roles?: string[];
}

interface SidebarProps {
  role: string;
  userName: string;
  modules: string[];
  open: boolean;
  collapsed: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
}

export default function Sidebar({ role, userName, modules, open, collapsed, onClose, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();

  const rawMenuSections: MenuSection[] = [
    {
      title: "Beranda",
      items: [
        { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      ],
    },
    {
      title: "Layanan Karyawan",
      items: [
        { label: "Rencana Kerja", href: "/work/plans", icon: ClipboardList },
        { label: "Realisasi Kerja", href: "/work/realizations", icon: CheckCircle2 },
        { label: "Cuti & Izin", href: "/my-leave", icon: CalendarDays },
        { label: "Slip Gaji", href: "/my-payroll", icon: Banknote },
        { label: "Perjalanan Dinas", href: "/spd", icon: Plane },
      ],
    },
    {
      title: "System Modules",
      roles: ["admin", "hr", "pm", "employee"],
      items: [
        { label: "Kalender Perusahaan", href: "/calendar", icon: CalendarDays },
        { label: "Cuti & Kehadiran", href: "/leave", icon: CalendarDays },
        { label: "Perjalanan Dinas", href: "/spd", icon: Plane },
        { label: "Procurement", href: "/purchase", icon: ShoppingCart },
        { label: "Rencana & Realisasi", href: "/ear", icon: ClipboardList },
      ],
    },
    {
      title: "Human Resource",
      roles: ["admin", "hr"],
      items: [
        { label: "Direktori Karyawan", href: "/users", icon: Users },
        { label: "Approval Cuti", href: "/leave", icon: ShieldCheck },
        { label: "Laporan EAR", href: "/ear", icon: BarChart3 },
      ],
    },
    {
      title: "Finance",
      roles: ["admin", "finance"],
      items: [
        { label: "Approval Keuangan", href: "/finance", icon: Wallet },
        { label: "Kelola Payroll", href: "/payroll", icon: Banknote },
        { label: "Pembelian", href: "/purchase", icon: ShoppingCart },
      ],
    },
    {
      title: "Project Management",
      roles: ["admin", "project_manager"],
      items: [
        { label: "Kelola Proyek", href: "/projects", icon: FolderKanban },
        { label: "Laporan EAR", href: "/ear", icon: BarChart3 },
      ],
    },
    {
      title: "Administrator",
      roles: ["admin"],
      items: [
        { label: "Dokumentasi", href: "/documentation", icon: BookOpen },
      ],
    },
  ];

  // Remove empty sections and filter by section-level roles
  const menuSections = rawMenuSections.filter(section => 
    (!section.roles || section.roles.includes(role)) && 
    section.items.length > 0
  );

  // Module access control
  const hasAccess = (item: MenuItem): boolean => {
    if (role === "admin") return true;
    
    // Map href to role-based access config
    const accessMap: Record<string, keyof typeof ROLE_ACCESS["hr"]> = {
      "/leave": "canApproveLeave",
      "/finance": "canApprovePayment",
      "/payroll": "canManagePayroll",
      "/users": "canManageUsers",
      "/projects": "canManageProjects",
      "/ear": "canViewEAR",
      "/documentation": "canManageDocumentation",
    };

    const requiredPermission = accessMap[item.href];
    if (requiredPermission) {
      const userAccess = ROLE_ACCESS[role as UserRole];
      return userAccess ? !!userAccess[requiredPermission] : false;
    }

    return true;
  };

  const isActive = (href: string): boolean => {
    return pathname === href || pathname?.startsWith(href + "/");
  };

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-50 flex flex-col transition-all duration-300 ease-in-out bg-white/95 backdrop-blur-xl border-r border-slate-100 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${collapsed ? "w-[72px] overflow-visible" : "w-[260px] overflow-hidden"}`}
      >
        {/* Header (Logo + Toggle) */}
        <div className="h-16 shrink-0 flex items-center px-4 relative">
          <Link href="/dashboard" className="flex items-center absolute left-4 z-10">
            <div className={`w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center transition-transform duration-300 ${collapsed ? "mx-auto" : ""}`}>
              <div className="w-2.5 h-2.5 bg-white rounded-sm" />
            </div>
            <span className={`ml-3 font-extrabold text-slate-800 text-[17px] tracking-tight whitespace-nowrap transition-opacity duration-300 ${
              collapsed ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}>
              HRIS Next
            </span>
          </Link>

          <div className={`w-full flex transition-all duration-300 z-20 ${collapsed ? "justify-center opacity-0 pointer-events-none" : "justify-end"}`}>
            <button 
              onClick={onToggleCollapse} 
              className="w-7 h-7 flex items-center justify-center bg-white border border-slate-200 shadow-sm text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all duration-200"
              title="Collapse Sidebar"
            >
              <ChevronLeft size={14} />
            </button>
          </div>
          
          {/* Uncollapse button shown only when collapsed */}
          <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 z-20 ${collapsed ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
             <button 
              onClick={onToggleCollapse} 
              className="absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center bg-white border border-slate-200 shadow-sm text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all duration-200"
              title="Expand Sidebar"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className={`flex-1 px-3 py-1 space-y-4 scrollbar-hide ${collapsed ? "overflow-visible" : "overflow-y-auto"}`}>

          {menuSections.map((section) => {
            const visibleItems = section.items.filter(hasAccess);
            if (visibleItems.length === 0) return null;
            
            return (
              <div key={section.title} className="space-y-0.5">
                {/* Section Title */}
                {section.title !== "Beranda" && (
                  <div className={`px-3 mb-1 mt-1 flex items-center h-[16px] transition-all duration-300 ${collapsed ? "justify-center" : ""}`}>
                    {collapsed ? (
                      <div className="w-5 h-px bg-slate-200 rounded-full" />
                    ) : (
                      <span className="text-[10px] font-extrabold tracking-wider text-indigo-600 uppercase truncate">
                        {section.title}
                      </span>
                    )}
                  </div>
                )}

                {visibleItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      prefetch={true}
                      className={`group flex items-center relative w-full h-[36px] px-3 rounded-xl transition-all duration-200 ${
                        active
                          ? "bg-indigo-50/80 text-indigo-700 font-bold"
                          : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      {active && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-indigo-600 rounded-r-full" />
                      )}
                      
                      <Icon className={`w-[18px] h-[18px] mr-3 shrink-0 transition-colors ${active ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"}`} />
                      
                      <div className={`flex-1 flex items-center justify-between transition-opacity duration-300 ease-in-out ${
                        collapsed ? "opacity-0 pointer-events-none absolute" : "opacity-100"
                      }`}>
                        <span className="text-[13px] tracking-wide whitespace-nowrap">
                          {item.label}
                        </span>
                        {item.badge && item.badge > 0 && (
                          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full shrink-0 ${active ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-600"}`}>
                            {item.badge}
                          </span>
                        )}
                      </div>

                      {collapsed && (
                        <div className="absolute left-full ml-4 px-4 py-2.5 bg-slate-900 text-white text-xs font-medium rounded-xl shadow-xl pointer-events-none whitespace-nowrap z-50 scale-0 opacity-0 origin-left group-hover:scale-100 group-hover:opacity-100 transition-all duration-200 ease-out">
                          {item.label}
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* Footer - User Info */}
        <div className="h-[72px] shrink-0 mt-auto relative border-t border-slate-100">
          <Link href="/profile" className="absolute top-2 left-2 right-2 bottom-2 rounded-2xl hover:bg-slate-50 transition-colors p-2 block group">
            <div className="absolute left-[8px] top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-bold shadow-[0_2px_8px_rgba(0,0,0,0.04)] group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              {userName?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className={`absolute left-[50px] top-1/2 -translate-y-1/2 w-[170px] flex items-center justify-between transition-opacity duration-300 ease-in-out ${
              collapsed ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}>
              <div className="flex-1 min-w-0 pr-2">
                <p className="text-[13px] font-bold text-slate-900 truncate tracking-wide">{userName}</p>
                <p className="text-[10px] text-slate-500 font-medium capitalize truncate tracking-wider">{role}</p>
              </div>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  signOut();
                }} 
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors shrink-0"
              >
                <LogOut size={16} />
              </button>
            </div>
          </Link>
        </div>
      </aside>
    </>
  );
}