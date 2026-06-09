"use client";

import { useState, useMemo } from "react";
import {
  users, leaveRequests, projects, workPlans, workRealizations, spds, leaveTypes,
  getUserById, getProjectById, getStatusColor, formatDate, getLeaveTypeById
} from "@/lib/data";
import {
  CalendarDays, Users, CheckCircle2, Clock, Briefcase, Plus,
  ClipboardList, BarChart3, ChevronRight, FileText, ExternalLink, UserCheck
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Modal from "@/components/Modal";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";
import { BarChart, Bar, Cell, PieChart, Pie, XAxis, YAxis, CartesianGrid } from "recharts";

const deptChartConfig = {
  count: {
    label: "Jumlah Karyawan",
    color: "#3b82f6",
  },
} satisfies ChartConfig;

const leaveDonutConfig = {
  tahunan: { label: "Cuti Tahunan", color: "#3b82f6" },
  sakit: { label: "Cuti Sakit", color: "#ef4444" },
  melahirkan: { label: "Cuti Melahirkan", color: "#ec4899" },
  izin: { label: "Izin Pribadi", color: "#f59e0b" },
  besar: { label: "Cuti Besar", color: "#8b5cf6" },
} satisfies ChartConfig;

export default function DashboardHR() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const userName = session?.user?.name ?? "User";
  const [selectedActivity, setSelectedActivity] = useState<any | null>(null);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Selamat Pagi";
    if (h < 15) return "Selamat Siang";
    if (h < 18) return "Selamat Sore";
    return "Selamat Malam";
  };

  // Metrics
  const pendingLeaveCount = leaveRequests.filter(l => l.status === "pending").length;
  const approvedLeaveCount = leaveRequests.filter(l => l.status === "approved").length;
  const activeEmployees = users.filter(u => u.isActive).length;
  const totalWorkPlans = workPlans.length;

  // Projection of Today's date for demo data: May 25, 2026
  const todayStr = "2026-05-25";
  const todayDate = new Date(todayStr);

  // Active leaves today
  const activeLeavesToday = leaveRequests.filter(l => {
    if (l.status !== "approved") return false;
    const start = new Date(l.startDate);
    const end = new Date(l.endDate);
    return todayDate >= start && todayDate <= end;
  });

  // Active SPDs today
  const activeSpdsToday = spds.filter(s => {
    if (s.status !== "approved") return false;
    const start = new Date(s.departureDate);
    const end = new Date(s.returnDate);
    return todayDate >= start && todayDate <= end;
  });

  const totalEmployees = users.filter(u => u.isActive).length;
  const cutiCount = activeLeavesToday.length;
  const spdCount = activeSpdsToday.length;
  const activeWorkingCount = totalEmployees - cutiCount - spdCount;

  // Department distribution (Bar Chart data)
  const deptData = useMemo(() => {
    const counts: Record<string, number> = {};
    users.forEach(u => {
      if (u.isActive) {
        counts[u.department] = (counts[u.department] || 0) + 1;
      }
    });

    const deptColors: Record<string, string> = {
      "Engineering": "#3b82f6",       // blue-500
      "Finance": "#8b5cf6",           // violet-500
      "Human Resource": "#10b981",     // emerald-500
      "Procurement": "#f59e0b",        // amber-500
      "IT": "#ec4899",                 // pink-500
      "Project Management": "#06b6d4", // cyan-500
    };

    return Object.entries(counts).map(([name, count]) => ({
      name,
      count,
      fill: deptColors[name] || "#64748b",
    })).sort((a, b) => b.count - a.count);
  }, []);

  // Leave Type distribution (Donut Chart data)
  const leaveData = useMemo(() => {
    const counts: Record<number, number> = {};
    leaveRequests.forEach(l => {
      if (l.status === "approved") {
        counts[l.leaveTypeId] = (counts[l.leaveTypeId] || 0) + l.totalDays;
      }
    });
    
    const leaveTypeColors: Record<number, string> = {
      1: "#3b82f6", // Cuti Tahunan (blue)
      2: "#ef4444", // Cuti Sakit (red)
      3: "#ec4899", // Cuti Melahirkan (pink)
      4: "#f59e0b", // Izin Pribadi (amber)
      5: "#8b5cf6", // Cuti Besar (violet)
    };

    return leaveTypes.map(lt => ({
      name: lt.name,
      value: counts[lt.id] || 0,
      fill: leaveTypeColors[lt.id] || "#64748b",
    })).filter(d => d.value > 0);
  }, []);

  const totalLeaveDays = useMemo(() => {
    return leaveData.reduce((sum, item) => sum + item.value, 0);
  }, [leaveData]);

  // Recent activities: Leave requests
  const recentActivities = leaveRequests
    .map(l => ({
      type: "Cuti", icon: CalendarDays,
      user: getUserById(l.userId)?.name || "",
      initial: getUserById(l.userId)?.name?.charAt(0) || "?",
      status: l.status, date: l.createdAt, detail: l.leaveNumber,
      description: l.reason,
      extraDetails: [
        { label: "Tanggal Mulai", value: formatDate(l.startDate) },
        { label: "Tanggal Selesai", value: formatDate(l.endDate) },
        { label: "Durasi", value: `${l.totalDays} Hari` },
      ],
      href: "/leave",
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 8);

  const upcomingLeaves = useMemo(() => {
    // Get approved leave requests
    const approved = leaveRequests.filter(l => l.status === "approved");
    
    return approved.map((l, idx) => {
      const user = getUserById(l.userId);
      
      // Project dates to current week (May 25, 2026) for demo realism
      const startDates = ["2026-05-26", "2026-05-25"];
      const endDates = ["2026-05-29", "2026-05-26"];
      
      const sDate = startDates[idx] || l.startDate;
      const eDate = endDates[idx] || l.endDate;

      const formatCustomDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
      };

      return {
        id: l.id,
        userName: user?.name || "Karyawan",
        position: user?.position || "Staff",
        department: user?.department || "Engineering",
        initial: user?.name?.charAt(0) || "?",
        startDateFormatted: `${formatCustomDate(sDate)} - ${formatCustomDate(eDate)}`,
        totalDays: l.totalDays,
        typeName: getLeaveTypeById(l.leaveTypeId)?.name || "Cuti Tahunan",
      };
    });
  }, []);

  return (
    <div className="flex flex-col h-full overflow-hidden gap-5 w-full pb-2">

      {/* Banner */}
      <div className="relative overflow-hidden rounded-xl p-4 md:p-6 bg-indigo-600 shrink-0">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-10 -mb-4 w-24 h-24 bg-indigo-400 opacity-20 rounded-full blur-xl" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex-1">
            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-white/15 text-indigo-100 border border-white/20 tracking-widest uppercase mb-1.5 inline-block">
              DASHBOARD HR
            </span>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              {getGreeting()}, {status === "loading" ? <span className="inline-block w-32 h-6 bg-white/20 animate-pulse rounded-md align-middle" /> : userName} 👋
            </h1>
            {pendingLeaveCount > 0 ? (
              <p className="text-indigo-100 font-medium text-sm mt-1 max-w-lg leading-relaxed">
                Ada <span className="font-bold text-white">{pendingLeaveCount} pengajuan cuti</span> menunggu persetujuan Anda.
              </p>
            ) : (
              <p className="text-indigo-100 font-medium text-sm mt-1">Semua pengajuan cuti sudah diproses.</p>
            )}
            
            {/* Quick Actions inside Banner */}
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <Link href="/users" className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" /> Tambah Karyawan
              </Link>
              <Link href="/leave" className="px-3 py-1.5 bg-white text-indigo-700 hover:bg-slate-50 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verifikasi Cuti
                {pendingLeaveCount > 0 && <span className="bg-indigo-100 text-indigo-750 py-0.2 px-1.5 rounded-md text-[10px] font-black">{pendingLeaveCount}</span>}
              </Link>
              <Link href="/ear" className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5">
                <ClipboardList className="w-3.5 h-3.5" /> Laporan EAR
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
        <Link href="/leave"
          className="bg-white p-5 rounded-2xl border-2 border-slate-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 flex flex-col justify-between min-h-[100px] group"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cuti Pending</span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-500 group-hover:bg-amber-100/70 transition-colors">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-base md:text-lg font-black text-slate-800 tracking-tight leading-none">
              {pendingLeaveCount} <span className="text-xs text-slate-400 font-medium">Pengajuan</span>
            </h3>
            <p className="text-[10px] text-amber-600 font-semibold mt-1 leading-none">Perlu tindakan segera</p>
          </div>
        </Link>

        <Link href="/leave"
          className="bg-white p-5 rounded-2xl border-2 border-slate-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 flex flex-col justify-between min-h-[100px] group"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sedang Cuti</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-500 group-hover:bg-emerald-100/70 transition-colors">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-base md:text-lg font-black text-slate-800 tracking-tight leading-none">
              {approvedLeaveCount} <span className="text-xs text-slate-400 font-medium">Karyawan</span>
            </h3>
            <p className="text-[10px] text-emerald-600 font-semibold mt-1 leading-none">Telah disetujui & aktif</p>
          </div>
        </Link>

        <Link href="/users"
          className="bg-white p-5 rounded-2xl border-2 border-slate-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 flex flex-col justify-between min-h-[100px] group"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Karyawan</span>
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-500 group-hover:bg-indigo-100/70 transition-colors">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-base md:text-lg font-black text-slate-800 tracking-tight leading-none">
              {activeEmployees} <span className="text-xs text-slate-400 font-medium">Aktif</span>
            </h3>
            <p className="text-[10px] text-indigo-600 font-semibold mt-1 leading-none">Personel aktif terdaftar</p>
          </div>
        </Link>

        <Link href="/ear"
          className="bg-white p-5 rounded-2xl border-2 border-slate-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 flex flex-col justify-between min-h-[100px] group"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rencana Kerja</span>
            <div className="p-1.5 rounded-lg bg-slate-50 text-slate-500 group-hover:bg-slate-100/70 transition-colors">
              <ClipboardList className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-base md:text-lg font-black text-slate-800 tracking-tight leading-none">
              {totalWorkPlans} <span className="text-xs text-slate-400 font-medium">Rencana</span>
            </h3>
            <p className="text-[10px] text-slate-400 font-medium mt-1 leading-none">Pengajuan rencana bulan ini</p>
          </div>
        </Link>
      </div>

      {/* HR Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 shrink-0 h-[225px]">
        {/* Department Distribution (Horizontal Bar Chart) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border-2 border-slate-100 shadow-sm p-5 relative flex flex-col justify-between h-full">
          <div className="flex items-center justify-between shrink-0">
            <div>
              <h3 className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">
                Distribusi Karyawan per Departemen
              </h3>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Proporsi staf aktif terdaftar per departemen</p>
            </div>
          </div>

          <div className="relative flex-1 w-full mt-2 min-h-[140px]">
            <ChartContainer config={deptChartConfig} className="h-[140px] w-full min-h-[140px] aspect-auto">
              <BarChart data={deptData} layout="vertical" margin={{ top: 5, right: 10, left: 30, bottom: 5 }}>
                <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  width={100}
                  style={{ fontSize: "9px", fill: "#64748b", fontWeight: "bold" }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={12}>
                  {deptData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </div>
        </div>

        {/* Leave Reason Allocation (Donut Chart) */}
        <div className="bg-white rounded-2xl border-2 border-slate-100 shadow-sm p-5 flex flex-col justify-between h-full">
          <div className="shrink-0">
            <h3 className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">
              Alokasi Jenis Cuti
            </h3>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">Proporsi pengambilan jenis cuti disetujui</p>
          </div>

          <div className="flex items-center justify-between gap-4 flex-1 min-h-0 py-2">
            {/* Donut Circle */}
            <div className="relative flex items-center justify-center shrink-0 w-24 h-24 min-h-[96px] min-w-[96px]">
              <ChartContainer config={leaveDonutConfig} className="w-24 h-24 min-h-[96px] min-w-[96px] aspect-square">
                <PieChart>
                  <Pie
                    data={leaveData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={26}
                    outerRadius={36}
                    strokeWidth={1}
                    stroke="#ffffff"
                  />
                </PieChart>
              </ChartContainer>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">Total</span>
                <span className="text-[12px] font-black text-slate-700 mt-1 leading-none">{totalLeaveDays} Hari</span>
              </div>
            </div>

            {/* Legends Breakdown */}
            <div className="flex-1 flex flex-col justify-center space-y-1.5 overflow-y-auto max-h-[140px] pr-1 scrollbar-hide">
              {leaveData.map((d, idx) => (
                <div key={idx} className="flex items-center justify-between text-[10px] border-b border-slate-50 pb-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: d.fill }} />
                    <span className="text-slate-500 font-semibold truncate max-w-[80px]">{d.name}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-bold text-slate-800">{d.value} Hari</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: Lists & Tables */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 flex-1 min-h-0">
        
        {/* Left 2 Columns: Recent Leave Requests */}
        <div className="xl:col-span-2 bg-white rounded-2xl border-2 border-slate-100 shadow-sm overflow-hidden flex flex-col p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-800 tracking-tight">Pengajuan Cuti Terbaru</h2>
            <Link href="/leave" className="text-[10px] font-bold text-indigo-500 hover:text-indigo-700 flex items-center gap-1 transition-colors">
              Lihat Semua <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="flex-1 overflow-auto scrollbar-hide">
            {recentActivities.length > 0 ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-50 font-bold text-slate-400 text-[12px]">
                    <th className="text-left py-2.5">Karyawan</th>
                    <th className="text-left py-2.5">Referensi</th>
                    <th className="text-left py-2.5 hidden lg:table-cell">Durasi</th>
                    <th className="text-center py-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentActivities.map((act, i) => {
                    const sc = getStatusColor(act.status);
                    const extra = act.extraDetails;
                    return (
                      <tr key={i} onClick={() => setSelectedActivity(act)} className="hover:bg-slate-50/80 transition-colors cursor-pointer group">
                        <td className="py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-[10px] font-bold text-slate-600 border border-slate-200 group-hover:border-indigo-200 transition-colors shrink-0">{act.initial}</div>
                            <span className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors truncate max-w-[140px]">{act.user}</span>
                          </div>
                        </td>
                        <td className="py-3 text-slate-400 font-sans text-xs">#{act.detail}</td>
                        <td className="py-3 text-slate-600 text-xs hidden lg:table-cell">{extra?.[2]?.value ?? "-"}</td>
                        <td className="py-3 text-center">
                          <span className={`inline-flex px-3 py-1 rounded-full text-[11px] font-bold capitalize border ${sc.bg} ${sc.text} ${sc.border}`}>{act.status}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <FileText className="w-10 h-10 mx-auto text-slate-200 mb-2" />
                <p className="text-sm">Belum ada pengajuan cuti.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Column: Karyawan Cuti Minggu Ini */}
        <div className="bg-white rounded-2xl border-2 border-slate-100 shadow-sm overflow-hidden flex flex-col p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-800 tracking-tight">Karyawan Cuti Minggu Ini</h2>
            <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-100 rounded text-[9px] font-bold text-emerald-700 capitalize">
              Aktif
            </span>
          </div>
          
          <div className="flex-1 overflow-auto scrollbar-hide space-y-3 pr-1">
            {upcomingLeaves.length > 0 ? (
              upcomingLeaves.map((leave, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50/40 hover:bg-slate-50 border border-slate-100/50 hover:border-slate-200/85 rounded-xl transition-all group">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[10px] font-bold text-emerald-600 shrink-0">
                      {leave.initial}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-800 text-xs truncate group-hover:text-indigo-650 transition-colors">{leave.userName}</p>
                      <p className="text-[10px] text-slate-400 font-semibold truncate leading-none mt-1">{leave.position} • {leave.department}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100/50 rounded-md text-[9px] font-black tracking-wide block w-fit ml-auto mb-1">
                      {leave.typeName}
                    </span>
                    <p className="text-[10px] text-slate-500 font-bold leading-none">{leave.startDateFormatted}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 text-slate-400">
                <CalendarDays className="w-9 h-9 text-slate-200 mb-2" />
                <p className="text-xs">Tidak ada karyawan yang cuti minggu ini.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <Modal isOpen={!!selectedActivity} onClose={() => setSelectedActivity(null)} title="Detail Pengajuan Cuti" size="lg"
        footer={
          <>
            <button onClick={() => setSelectedActivity(null)} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors">Tutup</button>
            {selectedActivity?.href && (
              <button onClick={() => router.push(selectedActivity.href)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2">
                Proses <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
          </>
        }
      >
        {selectedActivity && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
                <CalendarDays className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-base">{selectedActivity.type}</h4>
                <p className="text-xs text-slate-500">{new Date(selectedActivity.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-[11px] font-bold text-slate-400 mb-1">Pengaju</p><p className="text-sm font-semibold text-slate-800">{selectedActivity.user}</p></div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 mb-1">Status</p>
                <span className={`inline-flex px-2.5 py-0.5 rounded text-[11px] font-bold capitalize border ${getStatusColor(selectedActivity.status).bg} ${getStatusColor(selectedActivity.status).text} ${getStatusColor(selectedActivity.status).border}`}>{selectedActivity.status}</span>
              </div>
              {selectedActivity.extraDetails?.map((f: any, idx: number) => (
                <div key={idx}><p className="text-[11px] font-bold text-slate-400 mb-1">{f.label}</p><p className="text-sm font-semibold text-slate-800">{f.value}</p></div>
              ))}
            </div>
            {selectedActivity.description && (
              <div className="pt-4 border-t border-slate-100">
                <p className="text-[11px] font-bold text-slate-400 mb-2">Alasan</p>
                <div className="p-3 bg-slate-50 rounded-lg text-sm text-slate-700 leading-relaxed border border-slate-100">{selectedActivity.description}</div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
