"use client";

import { useState } from"react";
import { workPlans, getUserById, getProjectById, formatDate, getStatusColor, projects } from "@/lib/data";
import Modal from "@/components/Modal";
import { Plus, Search, ClipboardList, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useSession } from"next-auth/react";
import { StatusBadge } from "@/components/DataTable";

export default function WorkPlansPage() {
 const { data: session } = useSession();
 const [isModalOpen, setIsModalOpen] = useState(false);
 const [searchQuery, setSearchQuery] = useState("");
 const [selectedDetailPlan, setSelectedDetailPlan] = useState<any>(null);

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
 }).sort((a, b) => {
   if (a.status === 'approved' && b.status !== 'approved') return 1;
   if (a.status !== 'approved' && b.status === 'approved') return -1;
   return new Date(b.planDate).getTime() - new Date(a.planDate).getTime();
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
          <ClipboardList className="w-5 h-5 text-indigo-600" /> Aktivitas Pekerjaan
        </h1>
        <p className="text-[13px] text-slate-500 mt-1">Strukturisasi target dan laporan harian personel</p>
      </div>
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-medium text-[13px] rounded-md hover:bg-slate-50 transition-colors"
        >
          Export Plans
        </button>
        {session?.user?.role !== 'karyawan' && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-[13px] rounded-md transition-colors"
          >
            <Plus className="w-4 h-4"/>
            Buat Rencana
          </button>
        )}
      </div>
    </div>
    
    {/* Tabs */}
    <div className="px-4 flex gap-6">
      <Link href="/work/plans" className="py-2.5 text-[13px] font-semibold border-b-2 border-indigo-600 text-indigo-700 transition-colors flex items-center gap-2">
        <ClipboardList className="w-4 h-4" /> Rencana Kerja
      </Link>
      <Link href="/work/realizations" className="py-2.5 text-[13px] font-semibold border-b-2 border-transparent text-slate-500 hover:text-slate-700 transition-colors flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4" /> Realisasi Kerja
      </Link>
    </div>
  </div>

  {/* Filter Controls */}
  <div className="p-4 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative group w-full sm:w-auto min-w-[200px] lg:min-w-[300px]">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <input
            type="text"
            placeholder="Cari referensi atau aktivitas..."
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
  <thead>
  <tr className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-[0_2px_10px_rgba(0,0,0,0.02)] text-xs font-medium text-slate-500">
  <th className="text-left py-3 px-4 font-bold">Pemberi Tugas</th>
  <th className="text-left py-3 px-4 font-bold">Proyek & Target</th>
  <th className="text-left py-3 px-4 hidden md:table-cell font-bold">Tenggat Waktu</th>
  <th className="text-center py-3 px-4 font-bold">Status</th>
  <th className="text-right py-3 px-4 font-bold">Opsi</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100 text-[13px] text-slate-700">
 {filteredPlans.map((wp) => {
 const user = getUserById(wp.userId);
 const assigner = wp.assignedBy ? getUserById(wp.assignedBy) : user;
 const project = getProjectById(wp.projectId);
 const sc = getStatusColor(wp.status);
 
 return (
 <tr key={wp.id} className="group hover:bg-slate-50/50 transition-colors">
 <td className="px-4 py-3">
 <div className="flex items-center gap-2.5">
 <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 border border-slate-200">
 {assigner?.name?.charAt(0) ||"?"}
 </div>
 <div>
 <p className="font-bold text-slate-800 leading-none mb-0.5">{assigner?.name ||"-"}</p>
 <p className="text-[10px] text-slate-400 font-bold tracking-tight">#{wp.planNumber}</p>
 </div>
 </div>
 </td>
 <td className="px-4 py-3">
 <div className="flex flex-col">
 <span className="font-bold text-indigo-600 text-[10px] tracking-[0.1em] mb-0.5">{project?.name ||"-"}</span>
 <span className="text-slate-600 font-bold text-[11px] truncate max-w-[200px] leading-tight">{wp.activities}</span>
 </div>
 </td>
 <td className="px-4 py-3 hidden md:table-cell text-slate-500 font-bold text-[11px]">
 {formatDate(wp.planDate)}
 </td>
 <td className="px-4 py-3 text-center font-bold">
  <StatusBadge
    status={wp.status}
    statusColor={{ text: sc.text, border: sc.border === 'border-slate-200' ? 'border-slate-300' : sc.border, bg: sc.bg }}
  />
 </td>
 <td className="px-4 py-3 text-right">
 <button onClick={() => setSelectedDetailPlan(wp)} className="px-2 py-1 text-slate-400 hover:text-indigo-600 transition-colors bg-white hover:bg-indigo-50 border border-slate-100 hover:border-indigo-100 rounded-lg font-bold text-[10px]">
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

 {selectedDetailPlan && (
   <Modal
     isOpen={true}
     onClose={() => setSelectedDetailPlan(null)}
     title="Detail Rencana Kerja"
     size="md"
     footer={
       <div className="flex items-center justify-end gap-3 w-full">
         <button onClick={() => setSelectedDetailPlan(null)} className="px-4 py-2 text-[13px] font-medium text-slate-500 hover:text-slate-900 transition-colors">Tutup</button>
          {session?.user?.role === 'karyawan' && !selectedDetailPlan.isAcknowledged && (
            <button 
              onClick={() => { selectedDetailPlan.isAcknowledged = true; setSelectedDetailPlan(null); }} 
              className="px-4 py-2 text-[13px] font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition-colors flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" /> Tandai Sudah Dibaca
            </button>
          )}
          {session?.user?.role === 'karyawan' && selectedDetailPlan.isAcknowledged && (
            <Link href="/work/realizations" className="px-4 py-2 text-[13px] font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Lapor Realisasi
            </Link>
          )}
       </div>
     }
   >
     <div className="space-y-4">
       <div>
         <label className="text-xs font-medium text-slate-500">Nomor Rencana</label>
         <p className="text-[13px] text-slate-900 mt-1">#{selectedDetailPlan.planNumber}</p>
       </div>
       <div>
         <label className="text-xs font-medium text-slate-500">Target Aktivitas</label>
         <div className="mt-1 p-3 bg-slate-50 border border-slate-100 rounded-md text-[13px] text-slate-700 leading-relaxed">
           {selectedDetailPlan.activities}
         </div>
       </div>
       {selectedDetailPlan.assignedBy && (
         <div>
           <label className="text-xs font-medium text-slate-500">Ditugaskan Oleh</label>
           <p className="text-[13px] font-medium text-indigo-600 mt-1">{getUserById(selectedDetailPlan.assignedBy)?.name}</p>
         </div>
       )}
       <div>
         <label className="text-xs font-medium text-slate-500">Tanggal Target</label>
         <p className="text-[13px] text-slate-900 mt-1">{formatDate(selectedDetailPlan.planDate)}</p>
       </div>
       <div className="grid grid-cols-2 gap-4">
         <div>
           <label className="text-xs font-medium text-slate-500">Status</label>
           <div className="mt-1">
             <StatusBadge status={selectedDetailPlan.status} statusColor={getStatusColor(selectedDetailPlan.status)} />
           </div>
         </div>
       </div>
       
       {selectedDetailPlan.feedback && (
         <div className="mt-4 p-3 bg-amber-50/50 border border-amber-100 rounded-lg">
           <label className="text-xs font-semibold text-amber-800 mb-1 block flex items-center gap-1">
             <ClipboardList className="w-3.5 h-3.5" /> Feedback PM
           </label>
           <p className="text-[13px] text-amber-900 leading-relaxed italic">
             "{selectedDetailPlan.feedback}"
           </p>
         </div>
       )}
     </div>
   </Modal>
 )}
 </div>
 );
}
