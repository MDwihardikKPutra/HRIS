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
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
    <div className="flex flex-col h-full overflow-hidden gap-4 w-full pb-0">

      {/* Banner */}
      <div className="relative overflow-hidden rounded-xl p-4 bg-indigo-600 shrink-0">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-10 -mb-4 w-24 h-24 bg-indigo-400 opacity-20 rounded-full blur-xl" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex-1">
            <span className="text-xs text-indigo-200 font-medium mb-1 inline-block">
              Dashboard HR
            </span>
            <h1 className="text-xl font-semibold text-white">
              {getGreeting()}, {status === "loading" ? <span className="inline-block w-32 h-6 bg-white/20 animate-pulse rounded-md align-middle" /> : userName} 👋
            </h1>
            {pendingLeaveCount > 0 ? (
              <p className="text-indigo-100 text-xs mt-1 leading-relaxed">
                Ada <span className="font-medium text-white">{pendingLeaveCount} pengajuan cuti</span> menunggu persetujuan Anda.
              </p>
            ) : (
              <p className="text-indigo-100 text-xs mt-1">Semua pengajuan cuti sudah diproses.</p>
            )}
            
            {/* Quick Actions inside Banner */}
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <Link href="/users" className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-md text-[13px] font-medium transition-all flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" /> Tambah Karyawan
              </Link>
              <Link href="/leave" className="px-3 py-1.5 bg-white text-indigo-700 hover:bg-slate-50 text-[13px] font-medium rounded-md transition-all flex items-center gap-1.5 shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verifikasi Cuti
                {pendingLeaveCount > 0 && <span className="text-[11px] font-medium">({pendingLeaveCount})</span>}
              </Link>
              <Link href="/ear" className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-md text-[13px] font-medium transition-all flex items-center gap-1.5">
                <ClipboardList className="w-3.5 h-3.5" /> Laporan EAR
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
        <Link href="/leave"
          className="bg-white p-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all flex flex-col justify-between group"
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs text-slate-500">Cuti Pending</span>
            <div className="text-amber-500">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-medium text-slate-900 leading-none">
              {pendingLeaveCount} <span className="text-xs text-slate-400 font-normal">Pengajuan</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-1.5 leading-none">Perlu tindakan segera</p>
          </div>
        </Link>

        <Link href="/leave"
          className="bg-white p-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all flex flex-col justify-between group"
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs text-slate-500">Sedang Cuti</span>
            <div className="text-emerald-500">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-medium text-slate-900 leading-none">
              {approvedLeaveCount} <span className="text-xs text-slate-400 font-normal">Karyawan</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-1.5 leading-none">Telah disetujui & aktif</p>
          </div>
        </Link>

        <Link href="/users"
          className="bg-white p-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all flex flex-col justify-between group"
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs text-slate-500">Total Karyawan</span>
            <div className="text-indigo-500">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-medium text-slate-900 leading-none">
              {activeEmployees} <span className="text-xs text-slate-400 font-normal">Aktif</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-1.5 leading-none">Personel aktif terdaftar</p>
          </div>
        </Link>

        <Link href="/ear"
          className="bg-white p-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all flex flex-col justify-between group"
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs text-slate-500">Rencana Kerja</span>
            <div className="text-slate-500">
              <ClipboardList className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-medium text-slate-900 leading-none">
              {totalWorkPlans} <span className="text-xs text-slate-400 font-normal">Rencana</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-1.5 leading-none">Pengajuan bulan ini</p>
          </div>
        </Link>
      </div>

      {/* HR Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 shrink-0 flex-1 min-h-0">
        {/* Department Distribution (Horizontal Bar Chart) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-4 relative flex flex-col h-full overflow-hidden">
          <div className="flex items-center justify-between shrink-0">
            <div>
              <h3 className="text-[13px] font-medium text-slate-900">
                Distribusi Karyawan per Departemen
              </h3>
            </div>
          </div>

          <div className="relative flex-1 w-full mt-2 min-h-0">
            <ChartContainer config={deptChartConfig} className="h-full w-full aspect-auto">
              <BarChart data={deptData} layout="vertical" margin={{ top: 5, right: 10, left: 30, bottom: 5 }}>
                <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  width={100}
                  style={{ fontSize: "11px", fill: "#64748b", fontWeight: 500 }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={16}>
                  {deptData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </div>
        </div>

        {/* Leave Reason Allocation (Donut Chart) */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col h-full overflow-hidden">
          <div className="shrink-0 mb-2">
            <h3 className="text-[13px] font-medium text-slate-900">
              Alokasi Jenis Cuti
            </h3>
          </div>

          <div className="flex items-center justify-between gap-4 flex-1 min-h-0">
            {/* Donut Circle */}
            <div className="relative flex items-center justify-center shrink-0 w-24 h-24">
              <ChartContainer config={leaveDonutConfig} className="w-24 h-24 aspect-square">
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
                <span className="text-[10px] text-slate-500 leading-none">Total</span>
                <span className="text-xs font-medium text-slate-900 mt-0.5 leading-none">{totalLeaveDays}</span>
              </div>
            </div>

            {/* Legends Breakdown */}
            <div className="flex-1 flex flex-col justify-center space-y-2 overflow-y-auto pr-1 scrollbar-hide h-full">
              {leaveData.map((d, idx) => (
                <div key={idx} className="flex items-center justify-between text-[11px] border-b border-slate-100 pb-1.5 last:border-0 last:pb-0">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: d.fill }} />
                    <span className="text-slate-500 truncate">{d.name}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-medium text-slate-900">{d.value}</span>
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
        <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between shrink-0 bg-white">
            <h2 className="text-[13px] font-medium text-slate-900">Pengajuan Cuti Terbaru</h2>
            <Link href="/leave" className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors">
              Lihat Semua <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="flex-1 overflow-auto scrollbar-hide">
            {recentActivities.length > 0 ? (
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead className="sticky top-0 bg-white z-10 text-xs font-medium text-slate-500">
                  <tr className="border-b border-slate-200 text-xs font-medium text-slate-500">
                    <th className="px-4 py-2 font-medium">Karyawan</th>
                    <th className="px-4 py-2 font-medium">Referensi</th>
                    <th className="px-4 py-2 font-medium hidden lg:table-cell">Durasi</th>
                    <th className="px-4 py-2 font-medium text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[13px] text-slate-700">
                  {recentActivities.map((act, i) => {
                    const sc = getStatusColor(act.status);
                    return (
                      <tr key={i} onClick={() => setSelectedActivity(act)} className="hover:bg-slate-50/50 transition-colors cursor-pointer group">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-full border border-slate-200 text-slate-600 font-medium text-[11px] flex items-center justify-center shrink-0">{act.initial}</div>
                            <span className="font-medium text-slate-900 truncate max-w-[140px]">{act.user}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-500 text-xs">#{act.detail}</td>
                        <td className="px-4 py-3 text-slate-600 text-xs hidden lg:table-cell">{act.extraDetails?.[2]?.value ?? "-"}</td>
                        <td className="px-4 py-3 text-center text-xs">
                          <span className={`capitalize font-medium ${sc.text.replace('text-', 'text-').replace('-800', '-600').replace('-700', '-600')}`}>{act.status}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <FileText className="w-8 h-8 text-slate-200 mb-2" />
                <p className="text-xs">Belum ada pengajuan cuti.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Column: Karyawan Cuti Minggu Ini */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between shrink-0 bg-white">
            <h2 className="text-[13px] font-medium text-slate-900">Cuti Minggu Ini</h2>
          </div>
          
          <div className="flex-1 overflow-auto scrollbar-hide">
            {upcomingLeaves.length > 0 ? (
              <div className="divide-y divide-slate-100">
              {upcomingLeaves.map((leave, i) => (
                <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-50 transition-all group">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-[11px] font-medium text-slate-600 shrink-0">
                      {leave.initial}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-slate-900 text-[13px] truncate">{leave.userName}</p>
                      <p className="text-xs text-slate-500 truncate mt-0.5">{leave.position}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-slate-900 font-medium">{leave.typeName}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{leave.startDateFormatted}</p>
                  </div>
                </div>
              ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-8 text-slate-400">
                <CalendarDays className="w-8 h-8 text-slate-200 mb-2" />
                <p className="text-xs">Tidak ada karyawan yang cuti minggu ini.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <Modal isOpen={!!selectedActivity} onClose={() => setSelectedActivity(null)} title="Detail Pengajuan Cuti" size="lg"
        footer={
          <div className="flex justify-end gap-3 w-full">
            <button onClick={() => setSelectedActivity(null)} className="text-[13px] font-medium text-slate-600 hover:text-slate-900 transition-colors">Tutup</button>
            {selectedActivity?.href && (
              <button onClick={() => router.push(selectedActivity.href)} className="px-4 py-1.5 bg-slate-900 text-white rounded-md text-[13px] font-medium hover:bg-slate-800 transition-colors flex items-center gap-2">
                Proses <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        }
      >
        {selectedActivity && (
          <div className="p-2 space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
              <div>
                <h4 className="font-medium text-slate-900 text-[13px]">{selectedActivity.type}</h4>
                <p className="text-xs text-slate-500">{new Date(selectedActivity.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-[13px]">
              <div><p className="text-xs text-slate-500 mb-1">Pengaju</p><p className="font-medium text-slate-900">{selectedActivity.user}</p></div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Status</p>
                <span className={`capitalize font-medium text-slate-900`}>{selectedActivity.status}</span>
              </div>
              {selectedActivity.extraDetails?.map((f: any, idx: number) => (
                <div key={idx}><p className="text-xs text-slate-500 mb-1">{f.label}</p><p className="font-medium text-slate-900">{f.value}</p></div>
              ))}
            </div>
            {selectedActivity.description && (
              <div className="pt-3 border-t border-slate-200">
                <p className="text-xs text-slate-500 mb-1">Alasan</p>
                <div className="text-[13px] text-slate-900 leading-relaxed">{selectedActivity.description}</div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
