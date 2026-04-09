"use client";

import { useState, useMemo } from "react";
import { Search, History, Calendar, CreditCard, ClipboardList, Clock, ArrowRight } from "lucide-react";
import { 
    leaveRequests, spds, purchases, vendorPayments, 
    workPlans, workRealizations, getUserById, 
    formatDate, getStatusColor 
} from "@/lib/data";

interface LogEntry {
    id: string;
    timestamp: string;
    user: { name: string; initial: string; role: string };
    action: string;
    resource: string;
    type: "Cuti" | "Keuangan" | "Pekerjaan";
    status: string;
}

export default function ActivityLogPage() {
  const [activeCategory, setActiveCategory] = useState("Semua Log");
  const [searchQuery, setSearchQuery] = useState("");

  const allLogs = useMemo(() => {
    const logs: LogEntry[] = [
        // Leave Logs
        ...leaveRequests.map(l => ({
            id: `leave-${l.id}`,
            timestamp: l.createdAt,
            user: { 
                name: getUserById(l.userId)?.name || "Unknown", 
                initial: getUserById(l.userId)?.name?.charAt(0) || "?",
                role: getUserById(l.userId)?.position || "Staff"
            },
            action: l.status === "approved" ? "Persetujuan Cuti" : "Pengajuan Cuti",
            resource: l.leaveNumber,
            type: "Cuti" as const,
            status: l.status
        })),
        // SPD Logs
        ...spds.map(s => ({
            id: `spd-${s.id}`,
            timestamp: s.createdAt,
            user: { 
                name: getUserById(s.userId)?.name || "Unknown", 
                initial: getUserById(s.userId)?.name?.charAt(0) || "?",
                role: getUserById(s.userId)?.position || "Staff"
            },
            action: s.status === "approved" ? "Persetujuan SPD" : "Pengajuan SPD",
            resource: s.spdNumber,
            type: "Keuangan" as const,
            status: s.status
        })),
        // Purchase Logs
        ...purchases.map(p => ({
            id: `pur-${p.id}`,
            timestamp: p.createdAt,
            user: { 
                name: getUserById(p.userId)?.name || "Unknown", 
                initial: getUserById(p.userId)?.name?.charAt(0) || "?",
                role: getUserById(p.userId)?.position || "Staff"
            },
            action: p.status === "approved" ? "Persetujuan Purchase" : "Pengajuan Purchase",
            resource: p.purchaseNumber,
            type: "Keuangan" as const,
            status: p.status
        })),
        // Vendor Logs
        ...vendorPayments.map(v => ({
            id: `ven-${v.id}`,
            timestamp: v.createdAt,
            user: { 
                name: getUserById(v.userId)?.name || "Unknown", 
                initial: getUserById(v.userId)?.name?.charAt(0) || "?",
                role: getUserById(v.userId)?.position || "Staff"
            },
            action: v.status === "approved" ? "Persetujuan Pembayaran" : "Pengajuan Pembayaran",
            resource: v.paymentNumber,
            type: "Keuangan" as const,
            status: v.status
        })),
        // Work Plan Logs
        ...workPlans.map(wp => ({
            id: `plan-${wp.id}`,
            timestamp: wp.createdAt || wp.planDate,
            user: { 
                name: getUserById(wp.userId)?.name || "Unknown", 
                initial: getUserById(wp.userId)?.name?.charAt(0) || "?",
                role: getUserById(wp.userId)?.position || "Staff"
            },
            action: "Pembuatan Rencana Kerja",
            resource: wp.planNumber,
            type: "Pekerjaan" as const,
            status: wp.status || "active"
        })),
        // Work Realization Logs
        ...workRealizations.map(wr => ({
            id: `real-${wr.id}`,
            timestamp: wr.createdAt || wr.realizationDate,
            user: { 
                name: getUserById(wr.userId)?.name || "Unknown", 
                initial: getUserById(wr.userId)?.name?.charAt(0) || "?",
                role: getUserById(wr.userId)?.position || "Staff"
            },
            action: "Submit Laporan Realisasi",
            resource: wr.realizationNumber || `REAL-${wr.id}`,
            type: "Pekerjaan" as const,
            status: "completed"
        })),
    ];

    return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, []);

  const filteredLogs = useMemo(() => {
    return allLogs.filter(log => {
        const matchesCategory = activeCategory === "Semua Log" || log.type === activeCategory;
        const matchesSearch = log.user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             log.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             log.action.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });
  }, [allLogs, activeCategory, searchQuery]);

  const categories = [
    { id: "Semua Log", icon: History },
    { id: "Cuti", icon: Calendar },
    { id: "Keuangan", icon: CreditCard },
    { id: "Pekerjaan", icon: ClipboardList },
  ];

  return (
    <div className="space-y-4 w-full animate-in fade-in duration-500">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-800 tracking-tight">Log Aktivitas</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Audit trail lengkap transaksi sistem secara real-time</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl ">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Sistem Aktif</span>
        </div>
      </div>

      {/* Control Bar (Geometric) */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 ">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1 lg:pb-0">
                {categories.map((cat) => {
                    const Icon = cat.icon;
                    return (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap uppercase tracking-wider border ${
                                activeCategory === cat.id 
                                ? "bg-indigo-50 text-indigo-600 border-indigo-100" 
                                : "bg-transparent text-slate-400 border-transparent hover:bg-slate-50 hover:text-slate-600"
                            }`}
                        >
                            <Icon className="w-3.5 h-3.5" />
                            {cat.id}
                        </button>
                    );
                })}
            </div>
            <div className="relative group min-w-[320px]">
                <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <input
                    type="text"
                    placeholder="Cari user, aktivitas, atau nomor referensi..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-indigo-400 focus:bg-white transition-all font-medium "
                />
            </div>
        </div>
      </div>

      {/* Main Content (Modern Table) */}
      <div className="bg-white border border-slate-100 rounded-xl overflow-hidden ">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 font-semibold text-slate-500 uppercase tracking-widest text-[10px]">
                <th className="text-left py-2.5 px-4 font-bold">Waktu & Tanggal</th>
                <th className="text-left py-2.5 px-4 font-bold">Personel</th>
                <th className="text-left py-2.5 px-4 font-bold">Aktivitas</th>
                <th className="text-left py-2.5 px-4 hidden md:table-cell font-bold">Kategori</th>
                <th className="text-center py-2.5 px-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredLogs.map((log) => {
                const sc = getStatusColor(log.status);
                const dateObj = new Date(log.timestamp);
                
                return (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-2.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-indigo-500 transition-colors">
                                <Clock className="w-3 h-3" />
                            </div>
                            <div>
                                <p className="font-bold text-slate-700 leading-none mb-0.5">
                                    {dateObj.toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })}
                                </p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase">
                                    {dateObj.toLocaleDateString("id-ID", { day: 'numeric', month: 'short' })}
                                </p>
                            </div>
                        </div>
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600">
                          {log.user.initial}
                        </div>
                        <div className="min-w-0">
                            <p className="font-bold text-slate-800 truncate leading-none mb-0.5">{log.user.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase truncate">{log.user.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-4">
                        <div className="flex items-center gap-2">
                            <div className="min-w-0">
                                <p className="font-bold text-slate-700 leading-none mb-0.5">{log.action}</p>
                                <p className="text-[10px] text-indigo-500 font-sans font-bold tracking-tight">#{log.resource}</p>
                            </div>
                        </div>
                    </td>
                    <td className="py-2.5 px-4 hidden md:table-cell">
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded-md font-bold text-[10px] uppercase tracking-wider border cursor-default ${
                            log.type === "Cuti" ? "bg-amber-50 text-amber-600 border-amber-100" :
                            log.type === "Keuangan" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                            "bg-indigo-50 text-indigo-600 border-indigo-100"
                        }`}>
                            {log.type}
                        </span>
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <span className={`inline-flex px-1.5 py-0.5 rounded-lg text-[10px] font-black border uppercase tracking-widest ${sc.text} ${sc.border === 'border-slate-200' ? 'border-slate-300' : sc.border}`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {filteredLogs.length === 0 && (
                  <tr>
                      <td colSpan={5} className="py-16 text-center text-slate-400 font-medium bg-slate-50/20">
                          <History className="w-10 h-10 mx-auto text-slate-200 mb-3" />
                          Tidak ada riwayat aktivitas ditemukan.
                      </td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
