"use client";

import { useState } from "react";
import { workPlans, getUserById, getProjectById, formatDate, getStatusColor, projects } from "@/lib/data";
import Modal from "@/components/Modal";
import { Plus, Search } from "lucide-react";

export default function WorkPlansPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPlans = workPlans.filter((wp) => {
    const user = getUserById(wp.userId);
    const project = getProjectById(wp.projectId);
    return (
        user?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wp.activities.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-4 w-full animate-in fade-in duration-500">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-800 tracking-tight">Rencana Kerja</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Strukturisasi target dan tugas harian personel</p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-600 font-medium text-xs rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
          >
            Export Plans
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded-xl transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            Buat Rencana
          </button>
        </div>
      </div>

      {/* Content table */}
      <div className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)] mt-2">
        <div className="p-5 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-base font-semibold text-slate-800">Daftar Rencana Aktif</h2>
          <div className="relative group min-w-[300px]">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400 group-focus-within:text-indigo-500" />
            <input
              type="text"
              placeholder="Cari rencana, personel, atau proyek..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:outline-none focus:border-indigo-300 focus:bg-white transition-all font-medium"
            />
          </div>
        </div>

        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 font-semibold text-slate-500 uppercase tracking-widest text-[10px]">
                <th className="text-left py-3.5 px-6">Pemilik Rencana</th>
                <th className="text-left py-3.5 px-4">Proyek & Target</th>
                <th className="text-left py-3.5 px-4 hidden md:table-cell">Tenggat Waktu</th>
                <th className="text-center py-3.5 px-4">Status</th>
                <th className="text-right py-3.5 px-6">Opsi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredPlans.map((wp) => {
                const user = getUserById(wp.userId);
                const project = getProjectById(wp.projectId);
                const sc = getStatusColor(wp.status);
                
                return (
                  <tr key={wp.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 border border-slate-200">
                          {user?.name?.charAt(0) || "?"}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 leading-none mb-1">{user?.name || "-"}</p>
                          <p className="text-[10px] text-slate-400 font-medium">#{wp.planNumber}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                            <span className="font-bold text-indigo-600 text-[12px] uppercase tracking-[0.1em] mb-0.5">{project?.name || "-"}</span>
                            <span className="text-slate-600 font-semibold truncate max-w-[200px]">{wp.activities}</span>
                        </div>
                    </td>
                    <td className="py-3.5 px-4 hidden md:table-cell text-slate-500 font-bold">
                        {formatDate(wp.planDate)}
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold">
                      <span className={`inline-flex px-2 py-0.5 rounded-lg text-[12px] font-black uppercase tracking-wider border cursor-default ${sc.bg} ${sc.text} ${sc.border}`}>
                        {wp.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right">
                        <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors bg-white hover:bg-indigo-50 border border-slate-100 hover:border-indigo-100 rounded-lg shadow-sm font-bold text-[10px] uppercase">
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
        title="Buat Rencana Kerja"
        size="md"
        footer={
          <>
            <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors">Batal</button>
            <button onClick={() => setIsModalOpen(true)} className="px-5 py-2.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-sm">Simpan Rencana</button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">Tanggal Target</label>
              <input type="date" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 transition-all font-medium shadow-sm" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">Proyek Mandat</label>
              <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 transition-all font-medium appearance-none shadow-sm">
                <option value="">Pilih Proyek</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700">Detail Rencana Aktivitas</label>
            <textarea rows={4} placeholder="Jelaskan apa yang akan Anda capai..." className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 transition-all resize-none shadow-sm"></textarea>
          </div>
        </div>
      </Modal>
    </div>
  );
}
