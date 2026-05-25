"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, ClipboardList, CheckCircle2, CalendarDays,
  Plane, ShoppingCart, Wallet,
  Users, FolderKanban, Activity, BarChart3, BookOpen,
  ChevronDown, ChevronUp, Banknote, LogOut,
  Briefcase, Settings, FileText
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";
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
  defaultOpen?: boolean;
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
  const userAccess = ROLE_ACCESS[role as UserRole];
  const isFinance = userAccess?.canApprovePayment;
  const isHR = userAccess?.canApproveLeave;
  const isAdmin = role === "admin";

  // Build the dynamic Beranda items based on core role
  const berandaItems: MenuItem[] = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  ];

  if (isAdmin) {
    berandaItems.push(
      { label: "Karyawan", href: "/users", icon: Users },
      { label: "Log Aktivitas", href: "/activity-log", icon: Activity }
    );
  } else if (isFinance) {
    berandaItems.push(
      { label: "Approval Pembayaran", href: "/finance", icon: Wallet },
      { label: "Kelola Payroll", href: "/payroll", icon: Banknote }
    );
  } else if (isHR) {
    berandaItems.push(
      { label: "Daftar Cuti", href: "/leave", icon: CalendarDays },
      { label: "Karyawan", href: "/users", icon: Users }
    );
  } else if (role === "project_manager") {
    berandaItems.push(
      { label: "Laporan EAR", href: "/ear", icon: BarChart3 },
      { label: "Proyek", href: "/projects", icon: FolderKanban }
    );
  } else {
    // Karyawan Biasa
    berandaItems.push(
      { label: "Slip Gaji", href: "/my-payroll", icon: Banknote },
      { label: "Cuti & Izin", href: "/my-leave", icon: CalendarDays }
    );
  }

  // Filter out items that have been moved to Beranda so they don't duplicate
  const berandaHrefs = berandaItems.map(item => item.href);

  const rawMenuSections: MenuSection[] = [
    {
      title: "Beranda",
      defaultOpen: true,
      items: berandaItems,
    },
    {
      title: "Pekerjaan",
      defaultOpen: true,
      items: [
        { label: "Rencana Kerja", href: "/work/plans", icon: ClipboardList },
        { label: "Realisasi Kerja", href: "/work/realizations", icon: CheckCircle2 },
        { label: "Laporan EAR", href: "/ear", icon: BarChart3 },
      ].filter(item => !berandaHrefs.includes(item.href)),
    },
    {
      title: "Pengajuan",
      defaultOpen: true,
      items: [
        { label: "Cuti & Izin", href: "/my-leave", icon: CalendarDays },
        { label: "SPD / Perjalanan", href: "/spd", icon: Plane },
        { label: "Pembelian", href: "/purchase", icon: ShoppingCart },
      ].filter(item => !berandaHrefs.includes(item.href)),
    },
    {
      title: "Persetujuan",
      defaultOpen: false,
      items: [
        { label: "Daftar Cuti", href: "/leave", icon: CalendarDays },
        { label: "Approval Pembayaran", href: "/finance", icon: Wallet },
        { label: "Kelola Payroll", href: "/payroll", icon: Banknote },
      ].filter(item => !berandaHrefs.includes(item.href)),
    },
    {
      title: "Pengaturan",
      defaultOpen: false,
      items: [
        { label: "Karyawan", href: "/users", icon: Users },
        { label: "Proyek", href: "/projects", icon: FolderKanban },
      ].filter(item => !berandaHrefs.includes(item.href)),
    },
    ...(isAdmin ? [{
      title: "Sistem",
      defaultOpen: false,
      items: [
        { label: "Log Aktivitas", href: "/activity-log", icon: Activity },
        { label: "Dokumentasi", href: "/documentation", icon: BookOpen },
      ].filter(item => !berandaHrefs.includes(item.href)),
    }] : []),
  ];

  // Remove empty sections
  const menuSections = rawMenuSections.filter(section => section.items.length > 0);

  const [expandedSections, setExpandedSections] = useState<string[]>(
    menuSections.filter(s => s.defaultOpen).map(s => s.title)
  );

  const toggleSection = (label: string) => {
    if (collapsed) return;
    setExpandedSections(prev =>
      prev.includes(label)
        ? prev.filter(s => s !== label)
        : [...prev, label]
    );
  };

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

  const sectionIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    "Pekerjaan": Briefcase,
    "Pengajuan": FileText,
    "Persetujuan": CheckCircle2,
    "Pengaturan": Settings,
    "Sistem": Activity,
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
        className={`fixed top-0 left-0 h-full z-50 flex flex-col transition-all duration-300 ease-in-out border-r border-slate-100 bg-white ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${collapsed ? "w-[72px] overflow-visible" : "w-[260px] overflow-hidden"}`}
      >
        {/* Logo Header */}
        <div className="flex items-center h-16 px-6 shrink-0 relative overflow-hidden">
          <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
            <svg className="w-7 h-7 text-indigo-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 10l6 9 6-9" />
              <path d="M12 6v5" />
            </svg>
            <span className={`font-extrabold text-slate-800 text-lg tracking-tight block whitespace-nowrap transition-all duration-300 ease-in-out overflow-hidden ${
              collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
            }`}>
              ProWork
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className={`flex-1 px-3 py-2 space-y-1.5 scrollbar-hide ${collapsed ? "overflow-visible" : "overflow-y-auto"}`}>
          {!collapsed && (
            <div className="px-2 mb-2 transition-all duration-350">
              <h2 className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">MENU</h2>
            </div>
          )}

          {menuSections.map((section) => {
            const visibleItems = section.items.filter(hasAccess);
            if (visibleItems.length === 0) return null;

            // Render Beranda items directly as top-level menus
            if (section.title === "Beranda") {
              return visibleItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`group flex items-center transition-all duration-200 relative px-3 py-2.5 rounded-xl ${
                      active
                        ? "bg-indigo-600 text-white shadow-sm font-semibold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className={`w-[18px] h-[18px] shrink-0 ${active ? "text-white" : "text-slate-400 group-hover:text-slate-600"}`} />
                    <div className={`flex items-center justify-between flex-1 transition-all duration-300 ease-in-out overflow-hidden ${
                      collapsed ? "w-0 opacity-0 pointer-events-none ml-0" : "w-auto opacity-100 ml-3"
                    }`}>
                      <span className="text-sm font-medium leading-none whitespace-nowrap">
                        {item.label}
                      </span>
                      {item.badge && item.badge > 0 && (
                        <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${active ? "bg-white text-indigo-600" : "bg-red-500 text-white"}`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                    {collapsed && (
                      <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg invisible opacity-0 group-hover:visible group-hover:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap z-50">
                        {item.label}
                      </div>
                    )}
                  </Link>
                );
              });
            }

            // Other sections are rendered as expandable list headers
            const SectionIcon = sectionIcons[section.title] || ClipboardList;
            const isAnyChildActive = visibleItems.some(item => isActive(item.href));
            const isExpanded = expandedSections.includes(section.title);

            return (
              <div key={section.title} className="space-y-1">
                <button
                  onClick={() => toggleSection(section.title)}
                  className={`w-full group flex items-center transition-all duration-200 px-3 py-2.5 rounded-xl relative ${
                    isAnyChildActive
                      ? "bg-indigo-600 text-white shadow-sm font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <SectionIcon className={`w-[18px] h-[18px] shrink-0 ${isAnyChildActive ? "text-white" : "text-slate-400 group-hover:text-slate-600"}`} />
                  <div className={`flex items-center justify-between flex-1 transition-all duration-300 ease-in-out overflow-hidden ${
                    collapsed ? "w-0 opacity-0 pointer-events-none ml-0" : "w-auto opacity-100 ml-3"
                  }`}>
                    <span className="text-sm font-medium leading-none whitespace-nowrap text-left flex-1">
                      {section.title}
                    </span>
                    <span className="shrink-0 ml-2">
                      {isExpanded ? (
                        <ChevronUp className={`w-4 h-4 ${isAnyChildActive ? "text-white" : "text-slate-400"}`} />
                      ) : (
                        <ChevronDown className={`w-4 h-4 ${isAnyChildActive ? "text-white" : "text-slate-400"}`} />
                      )}
                    </span>
                  </div>

                  {collapsed && (
                    <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg invisible opacity-0 group-hover:visible group-hover:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap z-50">
                      {section.title}
                    </div>
                  )}
                </button>

                {/* Submenu with Tree Lines */}
                {!collapsed && isExpanded && (
                  <div className="relative ml-6 pl-4 my-1 space-y-1 transition-all duration-300 ease-in-out">
                    {visibleItems.map((item, index) => {
                      const subActive = isActive(item.href);
                      const isFirst = index === 0;
                      const isLast = index === visibleItems.length - 1;

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={onClose}
                          className={`group flex items-center relative py-2 px-3.5 rounded-xl transition-all duration-150 ${
                            subActive
                              ? "bg-white text-indigo-600 font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-slate-100/50"
                              : "text-slate-500 hover:text-slate-800 font-medium hover:bg-slate-50/50"
                          }`}
                        >
                          {/* Vertical tree line segment */}
                          <div 
                            className="absolute -left-4 w-px bg-slate-200/60" 
                            style={{
                              top: isFirst ? '50%' : '0px',
                              bottom: isLast ? '50%' : '0px'
                            }}
                          />
                          
                          {/* Horizontal connection tick line */}
                          <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-4 h-px bg-slate-200/60" />
                          
                          <span className="text-xs leading-none whitespace-nowrap">
                            {item.label}
                          </span>

                          {item.badge && item.badge > 0 && (
                            <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-red-500 text-white">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer - User Info */}
        <div className="p-3 border-t border-slate-100/80">
          <div className="flex items-center p-2 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {userName?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className={`flex-1 flex items-center justify-between min-w-0 transition-all duration-300 ease-in-out overflow-hidden ${
              collapsed ? "w-0 opacity-0 pointer-events-none ml-0" : "w-auto opacity-100 ml-2.5"
            }`}>
              <div className="flex-1 min-w-0 pr-2">
                <p className="text-xs font-semibold text-slate-800 truncate">{userName}</p>
                <p className="text-[10px] text-slate-400 font-medium capitalize truncate">{role}</p>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                title="Keluar"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}