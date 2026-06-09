"use client";

import { useState } from "react";
import { workRealizations, getUserById, getProjectById, formatDate, getStatusColor, projects } from "@/lib/data";
import Modal from "@/components/Modal";
import { CheckCircle2, Search, Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import { StatusBadge, AvatarInitial } from "@/components/DataTable";

export default function WorkRealizationsPage() {
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRealizations = workRealizations.filter((wr) => {
    // 1. Strict filter: Modul is ONLY for individual user requests
    if (session?.user?.id && wr.userId !== parseInt(session.user.id)) return false;

    const user = getUserById(wr.userId);
    const project = getProjectById(wr.projectId);
    return (
      (user?.name ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project?.name ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      wr.activities.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="flex flex-col h-full overflow-hidden w-full space-y-4">
      {/* Unified Dashboard Card */}
      <div className="flex-1 min-h-0 bg-white rounded-2xl flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <div className="border-b border-slate-100 p-4 shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-slate-800 tracking-tight">Realisasi Kerja</h1>
            <p className="text-sm font-medium text-slate-500 mt-1">Laporan pencapaian tugas dan progres harian tim</p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-600 font-medium text-xs rounded-xl hover:bg-slate-50 transition-colors"
            >
              Export Log
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded-xl transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Lapor Realisasi
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="p-4 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
          <h2 className="text-base font-semibold text-slate-800">Daftar Capaian Harian</h2>
          <div className="relative group min-w-[300px]">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400 group-focus-within:text-indigo-500" />
            <input
              type="text"
              placeholder="Cari aktivitas, personel, atau proyek..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-400 focus:bg-white transition-all font-medium"
            />
          </div>
        </div>

        {/* Main Table */}
        <div className="flex-1 overflow-auto scrollbar-hide">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-white border-b border-slate-200 font-semibold text-slate-500 tracking-wide text-[10px] sticky top-0 z-20 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                <th className="text-left py-3 px-4 font-bold">Pelaksana</th>
                <th className="text-left py-3 px-4 font-bold">Proyek & Aktivitas</th>
                <th className="text-left py-3 px-4 hidden md:table-cell font-bold">Velocity</th>
                <th className="text-center py-3 px-4 font-bold">Status</th>
                <th className="text-right py-3 px-4 font-bold">Opsi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredRealizations.map((wr) => {
                const user = getUserById(wr.userId);
                const project = getProjectById(wr.projectId);
                const sc = getStatusColor(wr.status);

                return (
                  <tr key={wr.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <AvatarInitial name={user?.name || "?"} size="sm" />
                        <div>
                          <p className="font-bold text-slate-800 leading-none mb-0.5">{user?.name || "-"}</p>
                          <p className="text-[10px] text-slate-400 font-bold tracking-tight">{formatDate(wr.realizationDate)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-indigo-600 text-[10px] tracking-[0.1em] mb-0.5">{project?.name || "-"}</span>
                        <span className="text-slate-600 font-bold text-[11px] truncate max-w-[200px] leading-tight">{wr.activities}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-4 hidden md:table-cell">
                      <div className="flex flex-col gap-1 w-24">
                        <div className="flex items-center justify-between text-[9px] text-slate-400 font-bold">
                          <span>Eff.</span>
                          <span>{wr.progress}%</span>
                        </div>
                        <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${wr.progress}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <StatusBadge
                        status={wr.status}
                        statusColor={{ text: sc.text, border: sc.border === 'border-slate-200' ? 'border-slate-300' : sc.border, bg: sc.bg }}
                      />
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <button className="px-3 py-1.5 text-[10px] font-bold text-indigo-600 hover:text-white bg-indigo-50 hover:bg-indigo-600 rounded-lg transition-colors border border-indigo-100 hover:border-indigo-600">
                        Detail
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Input Realisasi Kerja"
        size="md"
        footer={
          <>
            <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors">Batal</button>
            <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all">Kirim Laporan</button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700">Proyek Terkait</label>
            <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 transition-all font-medium appearance-none">
              <option value="">Pilih Proyek</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700">Deskripsi Aktivitas</label>
            <textarea rows={3} placeholder="Apa yang Anda kerjakan hari ini?" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 transition-all resize-none" />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-slate-700">Persentase Target (Velocity)</label>
              <span className="text-xs font-bold text-indigo-600">85%</span>
            </div>
            <input type="range" min="0" max="100" defaultValue="85" className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}