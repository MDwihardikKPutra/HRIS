"use client";

import { useState } from "react";
import {
  workPlans, workRealizations, leaveRequests, spds, purchases,
  getUserById, getProjectById, getStatusColor, formatDate,
} from "@/lib/data";
import {
  ClipboardList, CalendarDays, Plane, ShoppingCart,
  CheckCircle2, ChevronRight, FileText, ExternalLink
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Modal from "@/components/Modal";
import { StatusBadge } from "@/components/DataTable";

export default function DashboardKaryawan() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const userName = session?.user?.name ?? "User";
  const userId = session?.user?.id ? parseInt(session.user.id) : null;
  const [selectedActivity, setSelectedActivity] = useState<any | null>(null);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Selamat Pagi";
    if (h < 15) return "Selamat Siang";
    if (h < 18) return "Selamat Sore";
    return "Selamat Malam";
  };

  // Personal metrics
  const myWorkPlans = workPlans.filter(wp => wp.userId === userId);
  const myRealizations = workRealizations.filter(wr => wr.userId === userId);
  const myLeave = leaveRequests.filter(l => l.userId === userId);
  const mySPD = spds.filter(s => s.userId === userId);
  const myPurchases = purchases.filter(p => p.userId === userId);

  const pendingLeave = myLeave.filter(l => l.status === "pending").length;
  const pendingSPD = mySPD.filter(s => s.status === "pending").length;
  const activeTasks = myWorkPlans.filter(wp => wp.assignedBy && (wp.status === "pending" || wp.status === "extended")).length;

  // Personal recent activities
  const recentActivities = [
    ...myLeave.map(l => ({
      type: "Cuti", icon: CalendarDays,
      user: userName, initial: userName.charAt(0),
      status: l.status, date: l.createdAt, detail: l.leaveNumber,
      description: l.reason,
      extraDetails: [
        { label: "Mulai", value: formatDate(l.startDate) },
        { label: "Selesai", value: formatDate(l.endDate) },
        { label: "Durasi", value: `${l.totalDays} Hari` },
      ],
      href: "/my-leave",
    })),
    ...mySPD.map(s => ({
      type: "SPD", icon: Plane,
      user: userName, initial: userName.charAt(0),
      status: s.status, date: s.createdAt, detail: s.spdNumber,
      description: s.purpose,
      extraDetails: [
        { label: "Tujuan", value: s.destination },
        { label: "Berangkat", value: formatDate(s.departureDate) },
        { label: "Total Biaya", value: `Rp ${s.totalCost.toLocaleString("id-ID")}` },
      ],
      href: "/spd",
    })),
    ...myPurchases.map(p => ({
      type: "Pembelian", icon: ShoppingCart,
      user: userName, initial: userName.charAt(0),
      status: p.status, date: p.createdAt, detail: p.purchaseNumber,
      description: p.description,
      extraDetails: [
        { label: "Total", value: `Rp ${p.totalPrice.toLocaleString("id-ID")}` },
      ],
      href: "/purchase",
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="flex flex-col h-full overflow-hidden gap-4 w-full pb-0">

      {/* Banner */}
      <div className="relative overflow-hidden rounded-xl p-4 bg-indigo-600 shrink-0">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-10 -mb-4 w-24 h-24 bg-indigo-400 opacity-20 rounded-full blur-xl" />
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl font-semibold text-white">
              {getGreeting()}, {status === "loading" ? <span className="inline-block w-32 h-6 bg-white/20 animate-pulse rounded-md align-middle" /> : userName} 👋
            </h1>
            {pendingLeave + pendingSPD > 0 || activeTasks > 0 ? (
              <div className="mt-1 space-y-0.5">
                {pendingLeave + pendingSPD > 0 && (
                  <p className="text-blue-100 text-[13px]">
                    Ada <span className="font-medium text-white">{pendingLeave + pendingSPD} pengajuan</span> Anda yang sedang menunggu diproses.
                  </p>
                )}
                {activeTasks > 0 && (
                  <p className="text-indigo-100 text-[13px] flex items-center gap-1.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                    Terdapat <span className="font-bold text-white">{activeTasks} tugas dari PM</span> yang perlu segera Anda selesaikan!
                  </p>
                )}
              </div>
            ) : (
              <p className="text-blue-100 text-[13px] mt-1">Tidak ada pengajuan tertunda maupun tugas baru. Semangat bekerja hari ini! 💪</p>
            )}
          </div>
          <Link href="/work/plans" className="px-4 py-2 bg-white text-indigo-700 hover:bg-slate-50 active:scale-95 transition-all rounded-md text-[13px] font-medium flex items-center gap-2 shrink-0">
            Rencana Kerja
            {myWorkPlans.length > 0 && <span className="text-indigo-700 text-[11px]">({myWorkPlans.length})</span>}
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
        <Link href="/work/plans"
          className="bg-white p-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all flex flex-col justify-between group"
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs text-slate-500">Rencana Kerja</span>
            <div className="text-indigo-500">
              <ClipboardList className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-medium text-slate-900 leading-none">
              {myWorkPlans.length} <span className="text-[11px] text-slate-400 font-normal">Rencana</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-1.5 leading-none">Rencana kerja bulan ini</p>
          </div>
        </Link>

        <Link href="/work/realizations"
          className="bg-white p-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all flex flex-col justify-between group"
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs text-slate-500">Realisasi</span>
            <div className="text-emerald-500">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-medium text-slate-900 leading-none">
              {myRealizations.length} <span className="text-[11px] text-slate-400 font-normal">Laporan</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-1.5 leading-none">Laporan realisasi selesai</p>
          </div>
        </Link>

        <Link href="/my-leave"
          className="bg-white p-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all flex flex-col justify-between group"
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs text-slate-500">Cuti Saya</span>
            <div className="text-amber-500">
              <CalendarDays className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-medium text-slate-900 leading-none">
              {myLeave.length} <span className="text-[11px] text-slate-400 font-normal">Hari</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-1.5 leading-none">
              {pendingLeave > 0 ? `${pendingLeave} pengajuan pending` : "Semua pengajuan diproses"}
            </p>
          </div>
        </Link>

        <Link href="/spd"
          className="bg-white p-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all flex flex-col justify-between group"
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs text-slate-500">SPD</span>
            <div className="text-blue-500">
              <Plane className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-medium text-slate-900 leading-none">
              {mySPD.length} <span className="text-[11px] text-slate-400 font-normal">Perjalanan</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-1.5 leading-none">
              {pendingSPD > 0 ? `${pendingSPD} pending` : "Tidak ada dinas aktif"}
            </p>
          </div>
        </Link>
      </div>

      {/* Bottom Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0">
        
        {/* PM Tasks Widget (Detailed) */}
        <div className="lg:col-span-2 flex flex-col h-full bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between shrink-0 bg-white">
            <h2 className="text-[13px] font-medium text-slate-900 flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-indigo-600" /> Tugas dari PM
            </h2>
            <Link href="/work/plans" className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors">
              Buka Modul <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="flex-1 overflow-auto p-4 space-y-3 bg-slate-50/50">
            {myWorkPlans.filter(wp => wp.assignedBy).length > 0 ? (
              myWorkPlans.filter(wp => wp.assignedBy).map(wp => {
                const sc = getStatusColor(wp.status);
                const proj = getProjectById(wp.projectId);
                return (
                  <div key={wp.id} className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start mb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-md tracking-wide">
                          {proj?.name || "Non Project"}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">#{wp.planNumber}</span>
                      </div>
                      <StatusBadge status={wp.status} statusColor={sc} />
                    </div>
                    <p className="text-[13px] text-slate-800 font-medium leading-relaxed mb-3 line-clamp-2 group-hover:line-clamp-none transition-all">
                      {wp.activities}
                    </p>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-[9px] text-slate-400 font-medium mb-0.5 uppercase tracking-wide">Tenggat Waktu</p>
                          <p className="text-[11px] text-slate-700 font-semibold flex items-center gap-1">
                            <CalendarDays className="w-3 h-3 text-slate-400" />
                            {formatDate(wp.planDate)}
                          </p>
                        </div>
                        <div>
                          <p className="text-[9px] text-slate-400 font-medium mb-0.5 uppercase tracking-wide">Ditugaskan Oleh</p>
                          <p className="text-[11px] text-slate-700 font-semibold">
                            {getUserById(wp.assignedBy!)?.name}
                          </p>
                        </div>
                      </div>
                      <Link href="/work/realizations" className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-medium rounded-lg transition-colors flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3" /> Lapor
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <CheckCircle2 className="w-8 h-8 text-slate-200 mb-2" />
                <p className="text-xs">Tidak ada tugas aktif dari PM.</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col h-full min-h-0">
          <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between shrink-0 bg-white">
            <h2 className="text-[13px] font-medium text-slate-900">Pengajuan Lainnya</h2>
            <Link href="/my-leave" className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors">
              Lihat <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="flex-1 overflow-auto scrollbar-hide">
            {recentActivities.length > 0 ? (
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <tbody className="divide-y divide-slate-100 text-[13px] text-slate-700">
                  {recentActivities.map((act, i) => {
                    const Icon = act.icon;
                    const sc = getStatusColor(act.status);
                    return (
                      <tr key={i} onClick={() => setSelectedActivity(act)} className="hover:bg-slate-50/50 transition-colors cursor-pointer group">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                              <Icon className="w-4 h-4 text-slate-600" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium text-slate-900 text-[12px] leading-tight">{act.type}</span>
                              <span className="text-[10px] text-slate-500">{new Date(act.date).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <StatusBadge status={act.status} statusColor={sc} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <FileText className="w-8 h-8 text-slate-200 mb-2" />
                <p className="text-xs">Belum ada pengajuan.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <Modal isOpen={!!selectedActivity} onClose={() => setSelectedActivity(null)} title="Detail Pengajuan" size="lg"
        footer={
          <div className="flex justify-end gap-3 w-full">
            <button onClick={() => setSelectedActivity(null)} className="text-[13px] font-medium text-slate-600 hover:text-slate-900 transition-colors">Tutup</button>
            {selectedActivity?.href && (
              <button onClick={() => router.push(selectedActivity.href)} className="px-4 py-1.5 bg-slate-900 text-white rounded-md text-[13px] font-medium hover:bg-slate-800 transition-colors flex items-center gap-2">
                Lihat Detail <ExternalLink className="w-3.5 h-3.5" />
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
              <div><p className="text-xs text-slate-500 mb-1">No. Referensi</p><p className="font-medium text-slate-900">{selectedActivity.detail}</p></div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Status</p>
                <div className="inline-block">
                  <StatusBadge status={selectedActivity.status} statusColor={getStatusColor(selectedActivity.status)} />
                </div>
              </div>
              {selectedActivity.extraDetails?.map((f: any, idx: number) => (
                <div key={idx}><p className="text-xs text-slate-500 mb-1">{f.label}</p><p className="font-medium text-slate-900">{f.value}</p></div>
              ))}
            </div>
            {selectedActivity.description && (
              <div className="pt-3 border-t border-slate-200">
                <p className="text-xs text-slate-500 mb-1">Keterangan</p>
                <div className="text-[13px] text-slate-900 leading-relaxed">{selectedActivity.description}</div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
