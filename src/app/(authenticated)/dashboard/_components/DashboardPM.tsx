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
    })),
    ...allRealizations.map(wr => ({
      type: "Realisasi", icon: CheckCircle2,
      user: getUserById(wr.userId)?.name || "",
      initial: getUserById(wr.userId)?.name?.charAt(0) || "?",
      project: getProjectById(wr.projectId)?.name || "-",
      status: `${wr.progress}%`, date: wr.createdAt || wr.realizationDate,
      detail: wr.realizationNumber,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);

  return (
    <div className="flex flex-col h-full overflow-hidden w-full space-y-4">

      {/* Banner */}
      <div className="relative overflow-hidden rounded-xl p-4 md:p-6 bg-indigo-600">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-10 -mb-4 w-24 h-24 bg-indigo-400 opacity-20 rounded-full blur-xl" />
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              {getGreeting()}, {status === "loading" ? <span className="inline-block w-32 h-6 bg-white/20 animate-pulse rounded-md align-middle" /> : userName} 👋
            </h1>
            {pendingPlans > 0 ? (
              <p className="text-blue-100 font-medium text-sm mt-1">
                Ada <span className="font-bold text-white">{pendingPlans} rencana kerja</span> dari tim Anda yang menunggu ditinjau.
              </p>
            ) : (
              <p className="text-blue-100 font-medium text-sm mt-1">
                Anda mengelola <span className="font-bold text-white">{activeProjects.length} proyek aktif</span>. Rata-rata progres tim: <span className="font-bold text-white">{avgProgress}%</span>.
              </p>
            )}
          </div>
          <Link href="/ear" className="px-5 py-2.5 bg-white text-blue-700 rounded-lg text-sm font-bold hover:bg-slate-50 transition-all flex items-center gap-2 shrink-0">
            Laporan EAR
            <span className="bg-blue-100 text-blue-700 py-0.5 px-2 rounded-md text-xs">{allPlans.length + allRealizations.length}</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
        <Link href="/projects" className="bg-white p-5 rounded-2xl border-2 border-slate-100 shadow-sm hover:shadow-md hover:border-teal-200 transition-all group flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-500 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <FolderKanban className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Proyek Aktif</p>
            <p className="text-xl font-bold text-slate-800 leading-none">{activeProjects.length} <span className="text-xs text-slate-500 font-medium">Proyek</span></p>
          </div>
        </Link>

        <Link href="/ear" className="bg-white p-5 rounded-2xl border-2 border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Rencana Kerja</p>
            <p className="text-xl font-bold text-slate-800 leading-none">{allPlans.length} <span className="text-xs text-slate-500 font-medium">Rencana</span></p>
          </div>
        </Link>

        <Link href="/ear" className="bg-white p-5 rounded-2xl border-2 border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all group flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Realisasi</p>
            <p className="text-xl font-bold text-slate-800 leading-none">{allRealizations.length} <span className="text-xs text-slate-500 font-medium">Laporan</span></p>
          </div>
        </Link>

        <Link href="/ear" className="bg-white p-5 rounded-2xl border-2 border-slate-100 shadow-sm hover:shadow-md hover:border-amber-200 transition-all group flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Rata-rata Progres</p>
            <p className="text-xl font-bold text-slate-800 leading-none">{avgProgress}<span className="text-xs text-slate-500 font-medium">%</span></p>
          </div>
        </Link>
      </div>

      <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-4">
        {/* EAR Activity Table */}
        <div className="flex-[2] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col p-5">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <h2 className="text-base font-bold text-slate-800 tracking-tight">Aktivitas EAR Proyek</h2>
            <Link href="/ear" className="text-[10px] font-bold text-indigo-500 hover:text-indigo-700 flex items-center gap-1 transition-colors">
              Lihat Laporan EAR <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="flex-1 overflow-auto scrollbar-hide">
            {recentEAR.length > 0 ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-50 font-bold text-slate-400 text-[12px] sticky top-0 bg-white z-10">
                    <th className="text-left py-2.5">Anggota Tim</th>
                    <th className="text-left py-2.5">Tipe</th>
                    <th className="text-left py-2.5 hidden md:table-cell">Proyek</th>
                    <th className="text-center py-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentEAR.map((act, i) => {
                    const Icon = act.icon;
                    const sc = getStatusColor(act.status);
                    return (
                      <tr key={i} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-[10px] font-bold text-slate-600 border border-slate-200 group-hover:border-teal-200 transition-colors shrink-0">
                              {act.initial}
                            </div>
                            <span className="font-bold text-slate-800 group-hover:text-teal-600 transition-colors truncate max-w-[120px]">{act.user}</span>
                          </div>
                        </td>
                        <td className="py-3 px-1">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-md bg-slate-50 border border-slate-100 text-slate-400 group-hover:text-teal-500 group-hover:bg-teal-50 transition-colors shrink-0">
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <span className="font-bold text-slate-600 text-[12px]">{act.type}</span>
                          </div>
                        </td>
                        <td className="py-3 text-slate-500 text-xs hidden md:table-cell truncate max-w-[140px]">{act.project}</td>
                        <td className="py-3 text-center">
                          <span className={`inline-flex px-3 py-1 rounded-full text-[11px] font-bold capitalize border ${sc.bg} ${sc.text} ${sc.border}`}>
                            {act.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <BarChart3 className="w-10 h-10 mx-auto text-slate-200 mb-2" />
                <p className="text-sm">Belum ada laporan EAR untuk proyek Anda.</p>
              </div>
            )}
          </div>
        </div>

        {/* Analytics Chart */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col p-5">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <h2 className="text-base font-bold text-slate-800 tracking-tight">Kesehatan Proyek</h2>
          </div>
          <div className="flex-1 min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Selesai Tepat Waktu', value: 65, fill: '#10b981' },
                    { name: 'Dalam Proses', value: 25, fill: '#6366f1' },
                    { name: 'Tertunda', value: 10, fill: '#f59e0b' },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#6366f1" />
                  <Cell fill="#f59e0b" />
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', fontSize: '12px', fontWeight: 'bold' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="shrink-0 mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"/> <span className="font-medium text-slate-600">Selesai</span></div>
              <span className="font-bold text-slate-900">65%</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500"/> <span className="font-medium text-slate-600">Proses</span></div>
              <span className="font-bold text-slate-900">25%</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"/> <span className="font-medium text-slate-600">Tertunda</span></div>
              <span className="font-bold text-slate-900">10%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
