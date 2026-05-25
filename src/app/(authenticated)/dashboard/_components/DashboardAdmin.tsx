"use client";

import {
  users, projects, workPlans, workRealizations, leaveRequests, spds, purchases, payrolls,
  getUserById, getProjectById, getStatusColor, formatDate,
} from "@/lib/data";
import {
  Users, FolderKanban, ClipboardList, CalendarDays,
  Plane, ShoppingCart, Banknote, BarChart3, ChevronRight, CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function DashboardAdmin() {
  const { data: session, status } = useSession();
  const userName = session?.user?.name ?? "User";

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Selamat Pagi";
    if (h < 15) return "Selamat Siang";
    if (h < 18) return "Selamat Sore";
    return "Selamat Malam";
  };

  const pendingLeave = leaveRequests.filter(l => l.status === "pending").length;
  const pendingFinance = [...spds, ...purchases].filter(x => x.status === "pending").length;
  const draftPayrolls = payrolls.filter(p => p.status === "draft").length;
  const activeUsers = users.filter(u => u.isActive).length;
  const activeProjects = projects.filter(p => p.status === "active").length;
  const totalWorkPlans = workPlans.length;
  const totalRealizations = workRealizations.length;

  const cards = [
    { href: "/leave", label: "Cuti Pending", value: `${pendingLeave} Pengajuan`, icon: CalendarDays, color: "amber" },
    { href: "/finance", label: "Pembayaran Pending", value: `${pendingFinance} Tiket`, icon: ShoppingCart, color: "blue" },
    { href: "/payroll", label: "Draft Payroll", value: `${draftPayrolls} Karyawan`, icon: Banknote, color: "violet" },
    { href: "/users", label: "Karyawan Aktif", value: `${activeUsers} Orang`, icon: Users, color: "indigo" },
    { href: "/projects", label: "Proyek Aktif", value: `${activeProjects} Proyek`, icon: FolderKanban, color: "emerald" },
    { href: "/ear", label: "Rencana Kerja", value: `${totalWorkPlans} Rencana`, icon: ClipboardList, color: "slate" },
    { href: "/ear", label: "Realisasi Kerja", value: `${totalRealizations} Realisasi`, icon: CheckCircle2, color: "teal" },
    { href: "/activity-log", label: "Log Aktivitas", value: "Lihat Semua →", icon: BarChart3, color: "rose" },
  ];

  const colorMap: Record<string, string> = {
    amber: "bg-amber-50 text-amber-500 border-amber-200",
    blue: "bg-blue-50 text-blue-500 border-blue-200",
    violet: "bg-violet-50 text-violet-500 border-violet-200",
    indigo: "bg-indigo-50 text-indigo-500 border-indigo-200",
    emerald: "bg-emerald-50 text-emerald-500 border-emerald-200",
    slate: "bg-slate-50 text-slate-500 border-slate-200",
    teal: "bg-teal-50 text-teal-500 border-teal-200",
    rose: "bg-rose-50 text-rose-500 border-rose-200",
  };

  return (
    <div className="flex flex-col h-full overflow-hidden gap-4 w-full animate-in fade-in duration-500">

      {/* Banner */}
      <div className="relative overflow-hidden rounded-xl p-4 md:p-6 bg-indigo-600">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-10 -mb-4 w-24 h-24 bg-indigo-400 opacity-20 rounded-full blur-xl" />
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              {getGreeting()}, {status === "loading" ? <span className="inline-block w-32 h-6 bg-white/20 animate-pulse rounded-md align-middle" /> : userName} 👋
            </h1>
            <p className="text-slate-300 font-medium text-sm mt-1">
              {pendingLeave + pendingFinance > 0
                ? `Ada ${pendingLeave + pendingFinance} hal yang perlu perhatian Anda hari ini.`
                : "Semua sistem berjalan normal. Tidak ada yang perlu ditangani."}
            </p>
          </div>
          <Link href="/activity-log" className="px-5 py-2.5 bg-white/10 border border-white/20 text-white rounded-lg text-sm font-bold hover:bg-white/20 transition-all shrink-0">
            Log Aktivitas
          </Link>
        </div>
      </div>

      {/* Overview Grid - 4 cols, 2 rows */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 shrink-0">
        {cards.map((card) => {
          const Icon = card.icon;
          const cls = colorMap[card.color] ?? colorMap.slate;

          // Map colors to left borders
          const borderColors: Record<string, string> = {
            amber: "border-l-amber-500",
            blue: "border-l-blue-500",
            violet: "border-l-violet-500",
            indigo: "border-l-indigo-500",
            emerald: "border-l-emerald-500",
            slate: "border-l-slate-500",
            teal: "border-l-teal-500",
            rose: "border-l-rose-500",
          };
          const borderCls = borderColors[card.color] ?? "border-l-slate-500";

          return (
            <Link key={card.href + card.label} href={card.href}
              className={`bg-white rounded-xl p-4 border-l-4 ${borderCls} border border-slate-100 hover:border-slate-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between h-[90px] group`}
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{card.label}</span>
                <div className={`p-1.5 rounded-lg border ${cls} group-hover:bg-opacity-80 transition-all`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-800 leading-tight truncate">
                  {card.value}
                </h3>
                <p className="text-[9px] text-slate-400 font-medium mt-0.5 leading-none">Kelola modul sistem</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent employees list */}
      <div className="flex-1 bg-white rounded-xl border border-slate-100 overflow-hidden flex flex-col p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-800 tracking-tight">Daftar Karyawan</h2>
          <Link href="/users" className="text-[10px] font-bold text-indigo-500 hover:text-indigo-700 flex items-center gap-1 transition-colors">
            Kelola Karyawan <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="flex-1 overflow-auto scrollbar-hide">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-50 font-bold text-slate-400 text-[12px]">
                <th className="text-left py-2.5">Nama</th>
                <th className="text-left py-2.5 hidden md:table-cell">Jabatan</th>
                <th className="text-left py-2.5 hidden lg:table-cell">Departemen</th>
                <th className="text-center py-2.5">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.slice(0, 10).map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-[10px] font-bold text-slate-600 border border-slate-200 shrink-0">
                        {user.name.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-800 truncate max-w-[120px]">{user.name}</span>
                    </div>
                  </td>
                  <td className="py-3 text-slate-500 text-xs hidden md:table-cell truncate max-w-[140px]">{user.position}</td>
                  <td className="py-3 text-slate-500 text-xs hidden lg:table-cell">{user.department}</td>
                  <td className="py-3 text-center">
                    <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold capitalize border bg-indigo-50 text-indigo-600 border-indigo-200">
                      {user.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
