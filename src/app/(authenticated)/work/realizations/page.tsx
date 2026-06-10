"use client";

import { useState } from "react";
import { workRealizations, getUserById, getProjectById, formatDate, getStatusColor, projects, workPlans } from "@/lib/data";
import Modal from "@/components/Modal";
import { CheckCircle2, Search, Plus, ClipboardList } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { StatusBadge, AvatarInitial } from "@/components/DataTable";

export default function WorkRealizationsPage() {
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<any>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const filteredRealizations = workRealizations.filter((wr) => {
    // 1. Strict filter: Modul is ONLY for individual user requests
    if (session?.user?.id && wr.userId !== parseInt(session.user.id)) return false;
    if (selectedDate && wr.realizationDate !== selectedDate) return false;

    const user = getUserById(wr.userId);
    const project = getProjectById(wr.projectId);
    return (
      (user?.name ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project?.name ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      wr.activities.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }).sort((a, b) => {
    if (a.status === 'approved' && b.status !== 'approved') return 1;
    if (a.status !== 'approved' && b.status === 'approved') return -1;
    return new Date(b.realizationDate).getTime() - new Date(a.realizationDate).getTime();
  });

  return (
    <div className="flex flex-col h-full overflow-hidden w-full space-y-4">
      {/* Unified Dashboard Card */}
      <div className="flex-1 min-h-0 bg-white rounded-xl border border-slate-200 flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <div className="border-b border-slate-200 shrink-0">
          <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-lg font-medium text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-indigo-600" /> Aktivitas Pekerjaan
              </h1>
              <p className="text-[13px] text-slate-500 mt-1">Strukturisasi target dan laporan harian personel</p>
            </div>
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-medium text-[13px] rounded-md hover:bg-slate-50 transition-colors"
              >
                Export Log
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-[13px] rounded-md transition-colors"
              >
                <Plus className="w-4 h-4" />
                Lapor Realisasi
              </button>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="px-4 flex gap-6">
            <Link href="/work/plans" className="py-2.5 text-[13px] font-semibold border-b-2 border-transparent text-slate-500 hover:text-slate-700 transition-colors flex items-center gap-2">
              <ClipboardList className="w-4 h-4" /> Rencana Kerja
            </Link>
            <Link href="/work/realizations" className="py-2.5 text-[13px] font-semibold border-b-2 border-indigo-600 text-indigo-700 transition-colors flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Realisasi Kerja
            </Link>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border-b border-slate-200 shrink-0">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 bg-white border border-slate-200 rounded-md text-[13px] focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <div className="relative group w-full sm:w-auto min-w-[200px] lg:min-w-[300px]">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="text"
                placeholder="Cari aktivitas, personel, atau proyek..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-md text-[13px] focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Main Table */}
        <div className="flex-1 overflow-auto scrollbar-hide">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead className="sticky top-0 bg-white z-10 text-xs font-medium text-slate-500">
              <tr className="border-b border-slate-200 text-xs font-medium text-slate-500">
                <th className="py-3 px-4 font-medium">Pelaksana</th>
                <th className="py-3 px-4 font-medium">Proyek & Aktivitas</th>
                <th className="py-3 px-4 hidden md:table-cell font-medium">Velocity</th>
                <th className="py-3 px-4 font-medium text-center">Status</th>
                <th className="py-3 px-4 font-medium text-right">Opsi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[13px] text-slate-700">
              {filteredRealizations.map((wr) => {
                const user = getUserById(wr.userId);
                const project = getProjectById(wr.projectId);
                const sc = getStatusColor(wr.status);

                return (
                  <tr key={wr.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <AvatarInitial name={user?.name || "?"} size="sm" />
                        <div>
                          <p className="font-medium text-slate-900 mb-0.5">{user?.name || "-"}</p>
                          <p className="text-xs text-slate-500">{formatDate(wr.realizationDate)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-900 text-[13px] mb-0.5">{project?.name || "-"}</span>
                        <span className="text-slate-500 text-[13px] truncate max-w-[200px]">{wr.activities}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="flex flex-col gap-1.5 w-24">
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>Eff.</span>
                          <span>{wr.progress}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${wr.progress}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <StatusBadge
                        status={wr.status}
                        statusColor={{ text: sc.text, border: sc.border === 'border-slate-200' ? 'border-slate-300' : sc.border, bg: sc.bg }}
                      />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => setSelectedDetail(wr)} className="px-3 py-1.5 text-[13px] font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 rounded-md transition-colors border border-slate-200">
Detail
</button>
                    </td>
                  </tr>
                );
              })}
              {filteredRealizations.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500 text-[13px]">
                    Tidak ada data realisasi ditemukan.
                  </td>
                </tr>
              )}
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
            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50 rounded-md transition-colors">Batal</button>
            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-[13px] font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors">Kirim Laporan</button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs text-slate-500 mb-1.5 block">Rencana Kerja Terkait</label>
            <select className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-[13px] focus:outline-none focus:border-indigo-500 transition-colors appearance-none">
              <option value="">Pilih Rencana Kerja...</option>
              {workPlans.filter(wp => session?.user?.id && wp.userId === parseInt(session.user.id)).map(wp => {
                const proj = getProjectById(wp.projectId);
                return (
                  <option key={wp.id} value={wp.id}>
                    #{wp.planNumber} - {proj?.name || 'Non Project'} - {wp.activities.substring(0, 30)}...
                  </option>
                );
              })}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1.5 block">Deskripsi Aktivitas</label>
            <textarea rows={3} placeholder="Apa yang Anda kerjakan hari ini?" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-[13px] focus:outline-none focus:border-indigo-500 transition-colors resize-none" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-slate-500">Persentase Target (Velocity)</label>
              <span className="text-[13px] font-medium text-slate-900">85%</span>
            </div>
            <input type="range" min="0" max="100" defaultValue="85" className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
            <div className="flex justify-between text-[11px] text-slate-400 font-medium mt-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      </Modal>
    {selectedDetail && (
      <Modal
        isOpen={true}
        onClose={() => { setSelectedDetail(null); setFeedbackText(""); }}
        title="Detail Realisasi Kerja"
        size="md"
        footer={
          <div className="flex items-center justify-between w-full">
            <button onClick={() => { setSelectedDetail(null); setFeedbackText(""); }} className="px-4 py-2 text-[13px] font-medium text-slate-600 hover:bg-slate-100 rounded-md transition-colors">Tutup</button>
            {session?.user?.role !== 'karyawan' && selectedDetail.status === 'pending' && (
              <div className="flex gap-2">
                <button onClick={() => { setSelectedDetail(null); setFeedbackText(""); }} className="px-3 py-2 text-[12px] font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-md transition-colors">Tolak Mutlak</button>
                <button onClick={() => { setSelectedDetail(null); setFeedbackText(""); }} className="px-3 py-2 text-[12px] font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-md transition-colors">Perpanjang (Extend)</button>
                <button onClick={() => { setSelectedDetail(null); setFeedbackText(""); }} className="px-3 py-2 text-[12px] font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition-colors">Terima</button>
              </div>
            )}
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-500">Nomor Laporan</label>
            <p className="text-[13px] text-slate-900 mt-1">#{selectedDetail.realizationNumber}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500">Pencapaian Aktivitas</label>
            <div className="mt-1 p-3 bg-slate-50 border border-slate-100 rounded-md text-[13px] text-slate-700 leading-relaxed">
              {selectedDetail.activities}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500">Tanggal Pelaporan</label>
            <p className="text-[13px] text-slate-900 mt-1">{formatDate(selectedDetail.realizationDate)}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-500">Status</label>
              <div className="mt-1">
                <StatusBadge status={selectedDetail.status} statusColor={getStatusColor(selectedDetail.status)} />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500">Velocity</label>
              <p className="text-[13px] font-bold text-slate-900 mt-1">{selectedDetail.progress}%</p>
            </div>
          </div>
          
          {selectedDetail.feedback && (
            <div className="mt-4 p-3 bg-amber-50/50 border border-amber-100 rounded-lg">
              <label className="text-xs font-semibold text-amber-800 mb-1 block flex items-center gap-1">
                <ClipboardList className="w-3.5 h-3.5" /> Feedback PM
              </label>
              <p className="text-[13px] text-amber-900 leading-relaxed italic">
                "{selectedDetail.feedback}"
              </p>
            </div>
          )}

          {session?.user?.role !== 'karyawan' && selectedDetail.status === 'pending' && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <label className="text-xs font-medium text-slate-700 mb-2 block">
                Berikan Feedback (Opsional)
              </label>
              <textarea 
                rows={3} 
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Tulis catatan, alasan penolakan, atau instruksi perpanjangan di sini..." 
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-[13px] focus:outline-none focus:border-indigo-500 transition-colors resize-none placeholder:text-slate-400" 
              />
            </div>
          )}
        </div>
      </Modal>
    )}
  </div>
  );
}