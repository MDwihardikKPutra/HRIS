"use client";

import { useState } from"react";
import { workPlans, getUserById, getProjectById, formatDate, getStatusColor, projects } from"@/lib/data";
import Modal from"@/components/Modal";
import { Plus, Search } from"lucide-react";
import { useSession } from"next-auth/react";

export default function WorkPlansPage() {
 const { data: session } = useSession();
 const [isModalOpen, setIsModalOpen] = useState(false);
 const [searchQuery, setSearchQuery] = useState("");

 const filteredPlans = workPlans.filter((wp) => {
 // 1. Strict filter: Modul is ONLY for individual user requests
 if (session?.user?.id && wp.userId !== parseInt(session.user.id)) return false;

 const user = getUserById(wp.userId);
 const project = getProjectById(wp.projectId);
 return (
 (user?.name ??"").toLowerCase().includes(searchQuery.toLowerCase()) ||
 (project?.name ??"").toLowerCase().includes(searchQuery.toLowerCase()) ||
 wp.activities.toLowerCase().includes(searchQuery.toLowerCase())
 );
 });

 return (
  <div className="flex flex-col h-full overflow-hidden w-full space-y-4">
  {/* Unified Dashboard Card */}
  <div className="flex-1 min-h-0 bg-white rounded-2xl flex flex-col overflow-hidden">
  
  {/* Top Header */}
  <div className="border-b border-slate-100 p-4 shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
  <div>
  <h1 className="text-xl md:text-2xl font-semibold text-slate-800 tracking-tight">Rencana Kerja</h1>
  <p className="text-sm font-medium text-slate-500 mt-1">Strukturisasi target dan tugas harian personel</p>
  </div>
  <div className="flex items-center gap-2.5 shrink-0">
  <button
  onClick={() => setIsModalOpen(true)}
  className="px-4 py-2 bg-white border border-slate-200 text-slate-600 font-medium text-xs rounded-xl hover:bg-slate-50 transition-colors"
  >
  Export Plans
  </button>
  <button
  onClick={() => setIsModalOpen(true)}
  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded-xl transition-colors"
  >
  <Plus className="w-3.5 h-3.5"/>
  Buat Rencana
  </button>
  </div>
  </div>

  {/* Filter Controls */}
  <div className="p-4 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
  <h2 className="text-base font-semibold text-slate-800">Daftar Rencana Aktif</h2>
  <div className="relative group min-w-[300px]">
  <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400 group-focus-within:text-indigo-500"/>
  <input
  type="text"
  placeholder="Cari rencana, personel, atau proyek..."
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:outline-none focus:border-indigo-300 focus:bg-white transition-all font-medium"
  />
  </div>
  </div>

  {/* Main Table */}
  <div className="flex-1 overflow-auto scrollbar-hide">
  <table className="w-full text-xs">
  <thead>
  <tr className="bg-white border-b border-slate-200 font-semibold text-slate-500 tracking-wide text-[10px] sticky top-0 z-20 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
  <th className="text-left py-3 px-4 font-bold">Pemilik Rencana</th>
  <th className="text-left py-3 px-4 font-bold">Proyek & Target</th>
  <th className="text-left py-3 px-4 hidden md:table-cell font-bold">Tenggat Waktu</th>
  <th className="text-center py-3 px-4 font-bold">Status</th>
  <th className="text-right py-3 px-4 font-bold">Opsi</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-50">
 {filteredPlans.map((wp) => {
 const user = getUserById(wp.userId);
 const project = getProjectById(wp.projectId);
 const sc = getStatusColor(wp.status);
 
 return (
 <tr key={wp.id} className="group hover:bg-slate-50/50 transition-colors">
 <td className="py-2.5 px-4">
 <div className="flex items-center gap-2.5">
 <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 border border-slate-200">
 {user?.name?.charAt(0) ||"?"}
 </div>
 <div>
 <p className="font-bold text-slate-800 leading-none mb-0.5">{user?.name ||"-"}</p>
 <p className="text-[10px] text-slate-400 font-bold tracking-tight">#{wp.planNumber}</p>
 </div>
 </div>
 </td>
 <td className="py-2.5 px-4">
 <div className="flex flex-col">
 <span className="font-bold text-indigo-600 text-[10px] tracking-[0.1em] mb-0.5">{project?.name ||"-"}</span>
 <span className="text-slate-600 font-bold text-[11px] truncate max-w-[200px] leading-tight">{wp.activities}</span>
 </div>
 </td>
 <td className="py-2.5 px-4 hidden md:table-cell text-slate-500 font-bold text-[11px]">
 {formatDate(wp.planDate)}
 </td>
 <td className="py-2.5 px-4 text-center font-bold">
 <span className={`inline-flex px-1.5 py-0.5 rounded-lg text-[10px] font-black tracking-wide border cursor-default ${sc.bg} ${sc.text} ${sc.border}`}>
 {wp.status}
 </span>
 </td>
 <td className="py-2.5 px-4 text-right">
 <button className="px-2 py-1 text-slate-400 hover:text-indigo-600 transition-colors bg-white hover:bg-indigo-50 border border-slate-100 hover:border-indigo-100 rounded-lg font-bold text-[10px]">
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
 <button onClick={() => setIsModalOpen(true)} className="px-5 py-2.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all">Simpan Rencana</button>
 </>
 }
 >
 <div className="space-y-4">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div className="space-y-1.5">
 <label className="text-xs font-medium text-slate-700">Tanggal Target</label>
 <input type="date"className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 transition-all font-medium"/>
 </div>
 <div className="space-y-1.5">
 <label className="text-xs font-medium text-slate-700">Proyek Mandat</label>
 <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 transition-all font-medium appearance-none">
 <option value="">Pilih Proyek</option>
 {projects.map(p => (
 <option key={p.id} value={p.id}>{p.name}</option>
 ))}
 </select>
 </div>
 </div>
 <div className="space-y-1.5">
 <label className="text-xs font-medium text-slate-700">Detail Rencana Aktivitas</label>
 <textarea rows={4} placeholder="Jelaskan apa yang akan Anda capai..."className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 transition-all resize-none"></textarea>
 </div>
 </div>
 </Modal>
 </div>
 );
}
