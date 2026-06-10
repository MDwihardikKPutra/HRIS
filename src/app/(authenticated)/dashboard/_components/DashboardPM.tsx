"use client";

import {
  projects, workPlans, workRealizations,
  getUserById, getProjectById, getStatusColor, formatDate,
} from "@/lib/data";
import {
  FolderKanban, ClipboardList, CheckCircle2, BarChart3,
  ChevronRight, TrendingUp
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export default function DashboardPM() {
  const { data: session, status } = useSession();
  const userName = session?.user?.name ?? "User";
  const userId = session?.user?.id ? parseInt(session.user.id) : null;

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Selamat Pagi";
    if (h < 15) return "Selamat Siang";
    if (h < 18) return "Selamat Sore";
    return "Selamat Malam";
  };

  // PM manages projects where they are manager
  const myProjects = projects.filter(p => p.managerId === userId);
  const activeProjects = myProjects.filter(p => p.status === "active");

  // EAR metrics across my projects
  const myProjectIds = myProjects.map(p => p.id);
  const allPlans = workPlans.filter(wp => myProjectIds.includes(wp.projectId));
  const allRealizations = workRealizations.filter(wr => myProjectIds.includes(wr.projectId));
  const pendingPlans = allPlans.filter(wp => wp.status === "pending").length;
  const pendingRealizations = allRealizations.filter(wr => wr.status === "pending").length;
  const totalPending = pendingPlans + pendingRealizations;
  const avgProgress = allRealizations.length > 0
    ? Math.round(allRealizations.reduce((sum, r) => sum + r.progress, 0) / allRealizations.length)
    : 0;

  // Recent EAR activities (plans + realizations across PM's projects)
  const recentEAR = [
    ...allPlans.map(wp => ({
      type: "Rencana Kerja", icon: ClipboardList,
      user: getUserById(wp.userId)?.name || "",
      initial: getUserById(wp.userId)?.name?.charAt(0) || "?",
      project: getProjectById(wp.projectId)?.name || "-",
      status: wp.status, date: wp.createdAt || wp.planDate,
      detail: wp.planNumber,
      activities: wp.activities,
    })),
    ...allRealizations.map(wr => ({
      type: "Realisasi", icon: CheckCircle2,
      user: getUserById(wr.userId)?.name || "",
      initial: getUserById(wr.userId)?.name?.charAt(0) || "?",
      project: getProjectById(wr.projectId)?.name || "-",
      status: `${wr.progress}%`, date: wr.createdAt || wr.realizationDate,
      detail: wr.realizationNumber,
      activities: wr.activities,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const pendingItems = [
    ...allPlans.filter(p => p.status === "pending").map(p => ({
      type: "Rencana Kerja",
      user: getUserById(p.userId)?.name || "",
      initial: getUserById(p.userId)?.name?.charAt(0) || "?",
      activities: p.activities,
      date: p.createdAt || p.planDate
    })),
    ...allRealizations.filter(r => r.status === "pending").map(r => ({
      type: "Realisasi",
      user: getUserById(r.userId)?.name || "",
      initial: getUserById(r.userId)?.name?.charAt(0) || "?",
      activities: r.activities,
      date: r.createdAt || r.realizationDate
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3);

  return (
    <div className="flex flex-col h-full overflow-hidden w-full gap-4 pb-0">

      {/* Banner */}
      <div className="relative overflow-hidden rounded-xl p-4 bg-indigo-600 shrink-0">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-10 -mb-4 w-24 h-24 bg-indigo-400 opacity-20 rounded-full blur-xl" />
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl font-semibold text-white">
              {getGreeting()}, {status === "loading" ? <span className="inline-block w-32 h-6 bg-white/20 animate-pulse rounded-md align-middle" /> : userName} 👋
            </h1>
            {pendingPlans > 0 ? (
              <p className="text-blue-100 text-[13px] mt-1">
                Ada <span className="font-medium text-white">{pendingPlans} rencana kerja</span> dari tim Anda yang menunggu ditinjau.
              </p>
            ) : (
              <p className="text-blue-100 text-[13px] mt-1">
                Anda mengelola <span className="font-medium text-white">{activeProjects.length} proyek aktif</span>. Rata-rata progres tim: <span className="font-medium text-white">{avgProgress}%</span>.
              </p>
            )}
          </div>
          <Link href="/ear" className="px-4 py-2 bg-white text-blue-700 rounded-md text-[13px] font-medium hover:bg-slate-50 transition-all flex items-center gap-2 shrink-0">
            Laporan EAR
            <span className="text-blue-700 text-[11px]">({allPlans.length + allRealizations.length})</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
        <Link href="/projects" className="bg-white p-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all group flex items-center gap-3">
          <div className="text-teal-500 shrink-0">
            <FolderKanban className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 mb-0.5">Proyek Aktif</p>
            <p className="text-lg font-medium text-slate-900 leading-none">{activeProjects.length} <span className="text-[11px] text-slate-400 font-normal">Proyek</span></p>
          </div>
        </Link>

        <Link href="/ear" className="bg-white p-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all group flex items-center gap-3">
          <div className="text-indigo-500 shrink-0">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 mb-0.5">Rencana Kerja</p>
            <p className="text-lg font-medium text-slate-900 leading-none">{allPlans.length} <span className="text-[11px] text-slate-400 font-normal">Rencana</span></p>
          </div>
        </Link>

        <Link href="/ear" className="bg-white p-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all group flex items-center gap-3">
          <div className="text-emerald-500 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 mb-0.5">Realisasi</p>
            <p className="text-lg font-medium text-slate-900 leading-none">{allRealizations.length} <span className="text-[11px] text-slate-400 font-normal">Laporan</span></p>
          </div>
        </Link>

        <Link href="/ear" className="bg-white p-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all group flex items-center gap-3">
          <div className="text-amber-500 shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 mb-0.5">Rata-rata Progres</p>
            <p className="text-lg font-medium text-slate-900 leading-none">{avgProgress}<span className="text-[11px] text-slate-400 font-normal">%</span></p>
          </div>
        </Link>
      </div>

      <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-4">
        {/* EAR Activity Table */}
        <div className="flex-[2] bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col h-full">
          <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between shrink-0 bg-white">
            <h2 className="text-[13px] font-medium text-slate-900">Aktivitas EAR Proyek</h2>
            <Link href="/ear" className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors">
              Lihat Laporan EAR <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="flex-1 overflow-auto scrollbar-hide">
            {recentEAR.length > 0 ? (
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead className="sticky top-0 bg-white z-10 text-xs font-medium text-slate-500">
                  <tr className="border-b border-slate-200 whitespace-nowrap text-xs font-medium text-slate-500">
                    <th className="px-4 py-2 font-medium">Anggota Tim</th>
                    <th className="px-4 py-2 font-medium w-10 text-center">Tipe</th>
                    <th className="px-4 py-2 font-medium">Aktivitas</th>
                    <th className="px-4 py-2 font-medium hidden md:table-cell">Proyek</th>
                    <th className="px-4 py-2 font-medium text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[13px] text-slate-700">
                  {recentEAR.map((act, i) => {
                    const Icon = act.icon;
                    const sc = getStatusColor(act.status);
                    return (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-full border border-slate-200 text-slate-600 font-medium text-[11px] flex items-center justify-center shrink-0">
                              {act.initial}
                            </div>
                            <span className="font-medium text-slate-900 truncate max-w-[120px]">{act.user}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 w-10">
                          <div className="flex items-center justify-center text-slate-500" title={act.type}>
                            <Icon className="w-4 h-4" />
                          </div>
                        </td>
                        <td className="px-4 py-3 min-w-[200px]">
                          <span className="text-xs text-slate-600 block leading-relaxed">
                            {act.activities}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-500 text-xs hidden md:table-cell truncate max-w-[140px]">{act.project}</td>
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          <span className={`capitalize font-medium ${sc.text.replace('text-', 'text-').replace('-800', '-600').replace('-700', '-600')}`}>
                            {act.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <BarChart3 className="w-8 h-8 text-slate-200 mb-2" />
                <p className="text-xs">Belum ada laporan EAR untuk proyek Anda.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side Widgets */}
        <div className="flex-1 flex flex-col gap-4 min-h-0">
          {/* Active Projects Progress - Real Data */}
          <div className="flex-1 bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col p-4 min-h-0">
            <h2 className="text-[13px] font-medium text-slate-900 shrink-0 mb-3">Progress Proyek Aktif</h2>
            <div className="flex-1 overflow-auto scrollbar-hide space-y-4">
              {activeProjects.slice(0, 4).map((p, i) => {
                 const pReals = workRealizations.filter(r => r.projectId === p.id);
                 const pProgress = pReals.length > 0 ? Math.round(pReals.reduce((sum, r) => sum + r.progress, 0) / pReals.length) : 0;
                 return (
                   <div key={i} className="flex flex-col gap-1.5">
                     <div className="flex justify-between items-center text-[11px]">
                       <span className="font-medium text-slate-700 truncate max-w-[150px]">{p.name}</span>
                       <span className="font-bold text-slate-900">{pProgress}%</span>
                     </div>
                     <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                       <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pProgress}%` }} />
                     </div>
                   </div>
                 )
              })}
              {activeProjects.length === 0 && (
                 <div className="h-full flex items-center justify-center">
                   <p className="text-xs text-slate-400 text-center">Belum ada proyek aktif.</p>
                 </div>
              )}
            </div>
          </div>

          {/* Target Timeline Project Widget */}
          <div className="flex-[1.2] bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col p-4 min-h-0">
            <div className="flex items-center justify-between mb-3 shrink-0">
              <h2 className="text-[13px] font-medium text-slate-900">Target Timeline Proyek</h2>
              <span className="text-[10px] text-slate-500 font-medium">Batas Waktu</span>
            </div>
            
            <div className="flex-1 overflow-auto scrollbar-hide space-y-4 relative">
              <div className="absolute left-2 top-2 bottom-2 w-px bg-indigo-100" />
              {activeProjects.slice(0, 3).map((p, i) => {
                // Generate a mock target date based on project ID for consistent display
                const targetDate = new Date();
                targetDate.setMonth(targetDate.getMonth() + (p.id % 4) + 1);
                targetDate.setDate(targetDate.getDate() + (p.id * 5));
                
                const isNear = targetDate.getTime() - new Date().getTime() < 30 * 24 * 60 * 60 * 1000;

                return (
                  <div key={i} className="flex items-start gap-3 relative z-10 pl-1">
                    <div className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${isNear ? 'bg-amber-500 ring-4 ring-amber-50' : 'bg-indigo-500 ring-4 ring-indigo-50'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-medium text-slate-900 truncate">{p.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${isNear ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-600'}`}>
                          {targetDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        {isNear && <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest">Segera</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
              {activeProjects.length === 0 && (
                <div className="h-full flex items-center justify-center pl-4">
                  <p className="text-[11px] text-slate-400">Belum ada target proyek.</p>
                </div>
              )}
            </div>
            
            <Link href="/projects" className="shrink-0 mt-3 flex items-center justify-center w-full py-1.5 border border-slate-200 text-slate-600 rounded-lg text-[11px] font-bold hover:bg-slate-50 transition-colors shadow-sm">
              Kelola Proyek
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
