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
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 8);

  return (
    <div className="flex flex-col h-[calc(100vh-5.5rem)] overflow-hidden gap-5 w-full pb-2">

      {/* Banner */}
      <div className="relative overflow-hidden rounded-xl p-4 md:p-6 bg-indigo-600">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-10 -mb-4 w-24 h-24 bg-indigo-400 opacity-20 rounded-full blur-xl" />
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              {getGreeting()}, {status === "loading" ? <span className="inline-block w-32 h-6 bg-white/20 animate-pulse rounded-md align-middle" /> : userName} 👋
            </h1>
            {pendingLeave + pendingSPD > 0 ? (
              <p className="text-blue-100 font-medium text-sm mt-1">
                Ada <span className="font-bold text-white">{pendingLeave + pendingSPD} pengajuan</span> Anda yang sedang menunggu diproses.
              </p>
            ) : (
              <p className="text-blue-100 font-medium text-sm mt-1">Tidak ada pengajuan yang tertunda. Semangat bekerja hari ini! 💪</p>
            )}
          </div>
          <Link href="/work/plans" className="px-5 py-2.5 bg-white text-blue-700 rounded-lg text-sm font-bold hover:bg-slate-50 transition-all flex items-center gap-2 shrink-0">
            Rencana Kerja
            {myWorkPlans.length > 0 && <span className="bg-blue-100 text-blue-700 py-0.5 px-2 rounded-md text-xs">{myWorkPlans.length}</span>}
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
        <Link href="/work/plans"
          className="bg-white p-5 rounded-2xl border-2 border-slate-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 flex flex-col justify-between min-h-[100px] group"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rencana Kerja</span>
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-500 group-hover:bg-indigo-100/70 transition-colors">
              <ClipboardList className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-base md:text-lg font-black text-slate-800 tracking-tight leading-none">
              {myWorkPlans.length} <span className="text-xs text-slate-400 font-medium">Rencana</span>
            </h3>
            <p className="text-[10px] text-indigo-600 font-semibold mt-1 leading-none">Rencana kerja bulan ini</p>
          </div>
        </Link>

        <Link href="/work/realizations"
          className="bg-white p-5 rounded-2xl border-2 border-slate-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 flex flex-col justify-between min-h-[100px] group"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Realisasi</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-500 group-hover:bg-emerald-100/70 transition-colors">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-base md:text-lg font-black text-slate-800 tracking-tight leading-none">
              {myRealizations.length} <span className="text-xs text-slate-400 font-medium">Laporan</span>
            </h3>
            <p className="text-[10px] text-emerald-600 font-semibold mt-1 leading-none">Laporan realisasi selesai</p>
          </div>
        </Link>

        <Link href="/my-leave"
          className="bg-white p-5 rounded-2xl border-2 border-slate-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 flex flex-col justify-between min-h-[100px] group"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cuti Saya</span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-500 group-hover:bg-amber-100/70 transition-colors">
              <CalendarDays className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-base md:text-lg font-black text-slate-800 tracking-tight leading-none">
              {myLeave.length} <span className="text-xs text-slate-400 font-medium">Hari</span>
            </h3>
            <p className="text-[10px] text-amber-600 font-semibold mt-1 leading-none">
              {pendingLeave > 0 ? `${pendingLeave} pengajuan pending` : "Semua pengajuan diproses"}
            </p>
          </div>
        </Link>

        <Link href="/spd"
          className="bg-white p-5 rounded-2xl border-2 border-slate-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 flex flex-col justify-between min-h-[100px] group"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">SPD</span>
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-500 group-hover:bg-blue-100/70 transition-colors">
              <Plane className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-base md:text-lg font-black text-slate-800 tracking-tight leading-none">
              {mySPD.length} <span className="text-xs text-slate-400 font-medium">Perjalanan</span>
            </h3>
            <p className="text-[10px] text-blue-600 font-semibold mt-1 leading-none">
              {pendingSPD > 0 ? `${pendingSPD} pending` : "Tidak ada dinas aktif"}
            </p>
          </div>
        </Link>
      </div>

      {/* Recent Activities */}
      <div className="flex-1 bg-white rounded-2xl border-2 border-slate-100 shadow-sm overflow-hidden flex flex-col p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-800 tracking-tight">Pengajuan Saya</h2>
          <Link href="/my-leave" className="text-[10px] font-bold text-indigo-500 hover:text-indigo-700 flex items-center gap-1 transition-colors">
            Lihat Semua <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="flex-1 overflow-auto scrollbar-hide">
          {recentActivities.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-50 font-bold text-slate-400 text-[12px]">
                  <th className="text-left py-2.5">Tipe</th>
                  <th className="text-left py-2.5 hidden lg:table-cell">Referensi</th>
                  <th className="text-left py-2.5 hidden lg:table-cell">Tanggal</th>
                  <th className="text-center py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentActivities.map((act, i) => {
                  const Icon = act.icon;
                  const sc = getStatusColor(act.status);
                  return (
                    <tr key={i} onClick={() => setSelectedActivity(act)} className="hover:bg-slate-50/80 transition-colors cursor-pointer group">
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-md bg-slate-50 border border-slate-100 text-slate-400 group-hover:text-indigo-500 group-hover:bg-indigo-50 transition-colors shrink-0">
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <span className="font-bold text-slate-700 text-[12px]">{act.type}</span>
                        </div>
                      </td>
                      <td className="py-3 text-slate-400 font-sans text-xs hidden lg:table-cell">#{act.detail}</td>
                      <td className="py-3 text-slate-500 text-xs hidden lg:table-cell">{new Date(act.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</td>
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
              <p className="text-sm">Belum ada pengajuan.</p>
              <Link href="/my-leave" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-indigo-500 hover:text-indigo-700">
                Buat Pengajuan Baru <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <Modal isOpen={!!selectedActivity} onClose={() => setSelectedActivity(null)} title="Detail Pengajuan" size="lg"
        footer={
          <>
            <button onClick={() => setSelectedActivity(null)} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors">Tutup</button>
            {selectedActivity?.href && (
              <button onClick={() => router.push(selectedActivity.href)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2">
                Lihat Detail <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
          </>
        }
      >
        {selectedActivity && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100">
                <selectedActivity.icon className="w-5 h-5 text-indigo-500" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-base">{selectedActivity.type}</h4>
                <p className="text-xs text-slate-500">{new Date(selectedActivity.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-[11px] font-bold text-slate-400 mb-1">No. Referensi</p><p className="text-sm font-semibold text-slate-800 font-sans">{selectedActivity.detail}</p></div>
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
                <p className="text-[11px] font-bold text-slate-400 mb-2">Keterangan</p>
                <div className="p-3 bg-slate-50 rounded-lg text-sm text-slate-700 leading-relaxed border border-slate-100">{selectedActivity.description}</div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
