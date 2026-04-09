"use client";

import {
  users, projects, workPlans,
  leaveRequests, spds, purchases, vendorPayments,
  getUserById, formatDate, getStatusColor
} from "@/lib/data";
import {
  Users, FolderKanban, ClipboardList, CalendarDays,
  Plane, ShoppingCart, CreditCard,
  CheckCircle2, Clock, ArrowUpRight, Activity, ChevronRight, LayoutGrid
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getPendingApprovalsCount } from "@/lib/data";

export default function DashboardPage() {
  const router = useRouter();
  const pendingCounts = getPendingApprovalsCount();
  const totalPending = pendingCounts.total;
  
  const allRequests = [
    ...leaveRequests, ...spds, ...purchases, ...vendorPayments
  ];
  const totalProcessed = allRequests.filter(r => r.status !== "pending").length;
  const progressPercent = allRequests.length > 0 
    ? Math.round((totalProcessed / allRequests.length) * 100) 
    : 0;

  const stats = [
    { label: "Total Users", value: users.length, icon: Users, gradient: "from-blue-500 to-blue-600", href: "/users" },
    { label: "Active Projects", value: projects.filter(p => p.status === "active").length, icon: FolderKanban, gradient: "from-emerald-500 to-emerald-600", href: "/projects" },
    { label: "Work Plans", value: workPlans.length, icon: ClipboardList, gradient: "from-violet-500 to-violet-600", href: "/work/plans" },
    { label: "Approval Progress", value: `${progressPercent}%`, subtitle: `${totalProcessed}/${allRequests.length} Processed`, icon: Activity, gradient: "from-indigo-500 to-indigo-600", href: "/leave" },
    { label: "Pending", value: totalPending, icon: Clock, gradient: "from-amber-500 to-amber-600", href: "/leave" },
  ];

  const moduleStats = [
    { label: "Cuti & Izin", total: leaveRequests.length, pending: leaveRequests.filter(l => l.status === "pending").length, approved: leaveRequests.filter(l => l.status === "approved").length, icon: CalendarDays, href: "/leave" },
    { label: "SPD", total: spds.length, pending: spds.filter(s => s.status === "pending").length, approved: spds.filter(s => s.status === "approved").length, icon: Plane, href: "/finance" },
    { label: "Pembelian", total: purchases.length, pending: purchases.filter(p => p.status === "pending").length, approved: purchases.filter(p => p.status === "approved").length, icon: ShoppingCart, href: "/finance" },
    { label: "Vendor", total: vendorPayments.length, pending: vendorPayments.filter(v => v.status === "pending").length, approved: vendorPayments.filter(v => v.status === "approved").length, icon: CreditCard, href: "/finance" },
  ];

  const recentActivities = [
    ...spds.map(s => ({ type: "SPD", user: getUserById(s.userId)?.name || "", initial: getUserById(s.userId)?.name?.charAt(0) || "?", status: s.status, date: s.createdAt, detail: `${s.spdNumber} - ${s.destination}` })),
    ...leaveRequests.map(l => ({ type: "Leave", user: getUserById(l.userId)?.name || "", initial: getUserById(l.userId)?.name?.charAt(0) || "?", status: l.status, date: l.createdAt, detail: l.leaveNumber })),
    ...purchases.map(p => ({ type: "Purchase", user: getUserById(p.userId)?.name || "", initial: getUserById(p.userId)?.name?.charAt(0) || "?", status: p.status, date: p.createdAt, detail: p.purchaseNumber })),
    ...vendorPayments.map(v => ({ type: "Vendor", user: getUserById(v.userId)?.name || "", initial: getUserById(v.userId)?.name?.charAt(0) || "?", status: v.status, date: v.createdAt, detail: v.paymentNumber })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 8); // Reduced to 8 for compactness

  // Map activity type to destination page
  const getActivityHref = (type: string) => {
    switch (type) {
      case "Leave": return "/leave";
      case "SPD": return "/finance";
      case "Purchase": return "/finance";
      case "Vendor": return "/finance";
      default: return "/activity-log";
    }
  };

  return (
    <div className="grid grid-cols-5 gap-3 w-full animate-in fade-in duration-500 pb-4">
      
      {/* Div 1: Banner & Stats (Full Width) */}
      <div className="col-span-5 space-y-3">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-xl p-3 md:p-4 bg-indigo-600">
          <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-xl md:text-2xl font-semibold text-white">Hi, Larasati 👋</h1>
                <p className="text-indigo-100 font-medium text-sm mt-0.5">Anda memiliki {totalPending} pengajuan yang menunggu persetujuan.</p>
              </div>
              <Link href="/leave" className="px-5 py-2.5 bg-white text-indigo-600 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors ">
                  Proses Persetujuan
              </Link>
          </div>
        </div>

        {/* Main Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <Link key={s.label} href={s.href} className="bg-white rounded-xl p-3.5 border border-slate-100  hover:border-indigo-100  transition-all group">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider group-hover:text-indigo-500 transition-colors">{s.label}</span>
                </div>
                <div className="flex flex-col">
                  <p className="text-3xl font-bold text-slate-800 tracking-tight">{s.value}</p>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold mt-0.5">
                      <span className="text-emerald-500">↗ 15%</span>
                      <span className="text-slate-400">vs last mo</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Div 2: Recent Activity (Tall, Col 1-4, Row 2-5) */}
      <div className="col-span-4 row-span-4 row-start-2 bg-white rounded-xl border border-slate-100  overflow-hidden flex flex-col p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-800 uppercase tracking-tight">Aktivitas Terbaru</h2>
            <Link href="/activity-log" className="text-[10px] font-bold text-indigo-500 hover:text-indigo-700 flex items-center gap-1 transition-colors uppercase">
              Lihat Semua <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="flex-1 overflow-x-auto scrollbar-hide">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-50 font-bold text-slate-400 uppercase tracking-widest text-[12px]">
                  <th className="text-left py-2.5">Karyawan</th>
                  <th className="text-left py-2.5">Tipe</th>
                  <th className="text-left py-2.5 hidden lg:table-cell">Referensi</th>
                  <th className="text-center py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentActivities.map((act, i) => {
                  const sc = getStatusColor(act.status);
                  return (
                    <tr key={i} onClick={() => router.push(getActivityHref(act.type))} className="hover:bg-slate-50/80 transition-colors cursor-pointer group">
                      <td className="py-2.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 border border-slate-200 group-hover:border-indigo-200 transition-colors">
                            {act.initial}
                          </div>
                          <span className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors truncate max-w-[140px]">{act.user}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-1">
                        <span className="font-bold text-slate-500 uppercase text-[12px] tracking-tight">{act.type}</span>
                      </td>
                      <td className="py-2.5 text-slate-400 hidden lg:table-cell font-sans">
                         {act.detail}
                      </td>
                      <td className="py-2.5 text-center font-bold">
                        <span className={`inline-flex px-2.5 py-1 rounded-lg text-[12px] font-bold uppercase tracking-wider border cursor-default ${sc.bg} ${sc.text} ${sc.border}`}>
                          {act.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
      </div>

      {/* Div 3: Module Overview (Col 5, Row 2-3) */}
      <div className="col-start-5 row-start-2 row-span-2 bg-white rounded-xl border border-slate-100  p-4">
          <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-800 uppercase tracking-tight">Status Modul</h2>
              <Link href="/finance" className="px-2.5 py-1 border border-indigo-100 text-indigo-600 text-[12px] font-bold rounded-lg hover:bg-indigo-50 transition-colors uppercase">
                  + Baru
              </Link>
          </div>
          <div className="space-y-3.5">
              {moduleStats.map((mod) => {
                const Icon = mod.icon;
                return (
                  <Link key={mod.label} href={mod.href} className="border-b border-slate-50 pb-3 last:border-0 last:pb-0 flex flex-col group hover:bg-slate-50/50 rounded-lg px-2 -mx-2 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <Icon className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                            <p className="text-[12px] font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">{mod.label}</p>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg uppercase tracking-wider border ${mod.pending > 0 ? 'text-amber-600 bg-amber-50 border-amber-100' : 'text-slate-400 bg-slate-50 border-slate-100'}`}>
                            {mod.pending > 0 ? `${mod.pending} P` : 'OK'}
                          </span>
                      </div>
                      <div className="flex items-center gap-2.5 mt-2">
                          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-400 group-hover:bg-indigo-500 transition-colors" style={{ width: `${mod.total > 0 ? (mod.approved / mod.total) * 100 : 0}%` }} />
                          </div>
                          <p className="text-[12px] text-slate-400 font-bold whitespace-nowrap">{mod.approved}/{mod.total}</p>
                      </div>
                  </Link>
                );
              })}
          </div>
      </div>

      {/* Div 7: Request Composition (Donut Chart) (Col 5, Row 4-5) */}
      <div className="col-start-5 row-start-4 row-span-2 bg-white rounded-xl border border-slate-100  p-4 flex flex-col overflow-hidden">
          <div className="mb-4">
              <h2 className="text-base font-bold text-slate-800 uppercase tracking-tight">Komposisi Request</h2>
              <p className="text-[12px] text-slate-400 font-bold uppercase mt-0.5">Distribusi Tipe Pengajuan</p>
          </div>
          
          <div className="flex-1 flex items-center justify-center py-2 relative">
              <div className="w-28 h-28 relative">
                  <svg className="w-full h-full transform -rotate-90">
                      <circle cx="56" cy="56" r="48" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-slate-50" />
                      {/* SPD Ring (45% of 301.59) */}
                      <circle cx="56" cy="56" r="48" stroke="currentColor" strokeWidth="10" fill="transparent" strokeDasharray="135.71 165.88" strokeDashoffset="0" className="text-indigo-500" />
                      {/* Purchase Ring (30%) */}
                      <circle cx="56" cy="56" r="48" stroke="currentColor" strokeWidth="10" fill="transparent" strokeDasharray="90.48 211.11" strokeDashoffset="-135.71" className="text-emerald-400" />
                      {/* Vendor Ring (25%) */}
                      <circle cx="56" cy="56" r="48" stroke="currentColor" strokeWidth="10" fill="transparent" strokeDasharray="75.40 226.19" strokeDashoffset="-226.19" className="text-amber-400" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-lg font-black text-slate-800 tracking-tighter">84</span>
                    <span className="text-[12px] font-bold text-slate-400 uppercase leading-none">TOTAL</span>
                  </div>
              </div>
          </div>

          <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-[12px] font-bold">
                  <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-indigo-500" />
                      <span className="text-slate-500 uppercase">SPD</span>
                  </div>
                  <span className="text-slate-800">45%</span>
              </div>
              <div className="flex items-center justify-between text-[12px] font-bold">
                  <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="text-slate-500 uppercase">Purchasing</span>
                  </div>
                  <span className="text-slate-800">30%</span>
              </div>
              <div className="flex items-center justify-between text-[12px] font-bold">
                  <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-amber-400" />
                      <span className="text-slate-500 uppercase">Vendor</span>
                  </div>
                  <span className="text-slate-800">25%</span>
              </div>
          </div>
      </div>



    </div>
  );
}
